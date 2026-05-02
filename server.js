import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const PORT = Number(process.env.PORT) || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const BACKEND_URL = process.env.BACKEND_URL;
const allowedOrigins = (process.env.CORS_ORIGINS || FRONTEND_URL)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const requiredEnv = ["MP_ACCESS_TOKEN"];

const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
  throw new Error(`Variaveis de ambiente ausentes: ${missingEnv.join(", ")}`);
}

const mercadoPagoClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

const preferenceClient = new Preference(mercadoPagoClient);
const paymentClient = new Payment(mercadoPagoClient);

const canUpdateOrders =
  Boolean(process.env.SUPABASE_URL) &&
  Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

const supabase = canUpdateOrders
  ? createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : null;

if (!canUpdateOrders) {
  console.warn(
    "SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY ausentes. Pagamentos serao criados, mas o webhook nao atualizara pedidos automaticamente."
  );
}

const app = express();
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origem nao permitida pelo CORS."));
    },
  })
);
app.use(express.json());

function roundMoney(value) {
  return Math.round(Number(value) * 100) / 100;
}

function normalizeCartItems(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.map((item) => {
    const title = item.name || item.title;
    const unitPrice = Number(item.price ?? item.unit_price);
    const quantity = Number(item.quantity ?? 1);

    return {
      id: String(item.slug || item.id || title || ""),
      title,
      quantity,
      unit_price: unitPrice,
    };
  });
}

function hasInvalidCartItem(item) {
  return (
    !item.title ||
    !Number.isFinite(item.quantity) ||
    item.quantity <= 0 ||
    !Number.isFinite(item.unit_price) ||
    item.unit_price <= 0
  );
}

function buildPreferenceItems(items, totalAmount) {
  const subtotal = roundMoney(
    items.reduce((acc, item) => acc + item.unit_price * item.quantity, 0)
  );
  const requestedTotal = Number(totalAmount);
  const finalTotal =
    Number.isFinite(requestedTotal) && requestedTotal > 0
      ? roundMoney(requestedTotal)
      : subtotal;

  if (finalTotal > subtotal) {
    throw new Error("Total do pagamento maior que o subtotal dos itens.");
  }

  const ratio = finalTotal / subtotal;
  let accumulated = 0;

  return items.map((item, index) => {
    const isLastItem = index === items.length - 1;
    const originalLineTotal = item.unit_price * item.quantity;
    const discountedLineTotal = isLastItem
      ? roundMoney(finalTotal - accumulated)
      : roundMoney(originalLineTotal * ratio);

    accumulated = roundMoney(accumulated + discountedLineTotal);

    return {
      id: item.id,
      title:
        item.quantity > 1
          ? `${item.title} (Qtd. ${item.quantity})`
          : item.title,
      quantity: 1,
      currency_id: "BRL",
      unit_price: discountedLineTotal,
    };
  });
}

app.get("/", (_req, res) => {
  res.send("Servidor de pagamento da MV Industrial rodando.");
});

app.get("/health", (_req, res) => {
  res.json({ ok: true, webhook_updates_orders: canUpdateOrders });
});

app.post("/create_preference", async (req, res) => {
  try {
    const { coupon, items, orderId, payerEmail, paymentMethod, shipping, total } =
      req.body;

    if (!orderId) {
      return res.status(400).json({ error: "orderId nao enviado." });
    }

    const cartItems = normalizeCartItems(items);

    if (cartItems.length === 0 || cartItems.some(hasInvalidCartItem)) {
      return res.status(400).json({ error: "Itens invalidos ou nao enviados." });
    }

    const payableItems = [...cartItems];
    const shippingPrice = Number(shipping?.price || 0);

    if (Number.isFinite(shippingPrice) && shippingPrice > 0) {
      payableItems.push({
        id: "frete",
        title: "Frete",
        quantity: 1,
        unit_price: shippingPrice,
      });
    }

    const preferenceItems = buildPreferenceItems(payableItems, total);
    const notificationUrl = BACKEND_URL ? `${BACKEND_URL}/webhook` : undefined;
    const preferenceBody = {
      items: preferenceItems,
      external_reference: orderId,
      back_urls: {
        success: `${FRONTEND_URL}/checkout?status=success&order_id=${orderId}`,
        failure: `${FRONTEND_URL}/checkout?status=failure&order_id=${orderId}`,
        pending: `${FRONTEND_URL}/checkout?status=pending&order_id=${orderId}`,
      },
      auto_return: "approved",
      metadata: {
        coupon: coupon || null,
        order_id: orderId,
        payment_method: paymentMethod || null,
        shipping_method: shipping?.method || null,
        shipping_price: shipping?.price || 0,
      },
      ...(payerEmail ? { payer: { email: payerEmail } } : {}),
      ...(notificationUrl ? { notification_url: notificationUrl } : {}),
    };

    const preference = await preferenceClient.create({ body: preferenceBody });

    return res.json({
      id: preference.id,
      init_point: preference.init_point,
      sandbox_init_point: preference.sandbox_init_point,
    });
  } catch (error) {
    console.error("Erro ao criar preferencia:", error);
    const message = String(error.message || "");

    if (message.toLowerCase().includes("unauthorized")) {
      return res.status(401).json({
        error:
          "Token do Mercado Pago inválido ou não configurado. Atualize o MP_ACCESS_TOKEN no arquivo .env.",
      });
    }

    return res
      .status(500)
      .json({ error: message || "Erro ao criar preferencia." });
  }
});

app.post("/webhook", async (req, res) => {
  try {
    console.log("Webhook recebido:", JSON.stringify(req.body, null, 2));

    const paymentId =
      req.body.data?.id ||
      req.query["data.id"] ||
      (typeof req.body.resource === "string"
        ? req.body.resource.split("/").pop()
        : undefined) ||
      req.query.id;

    if (!paymentId) {
      return res.sendStatus(200);
    }

    const payment = await paymentClient.get({ id: paymentId });
    const orderId = payment.external_reference;
    const paymentStatus = payment.status;

    if (!orderId) {
      return res.sendStatus(200);
    }

    if (!supabase) {
      console.warn(
        `Pedido ${orderId} recebeu pagamento ${paymentStatus}, mas o Supabase service role nao esta configurado.`
      );
      return res.sendStatus(200);
    }

    let newStatus = "pendente";

    if (paymentStatus === "approved") {
      newStatus = "pago";
    } else if (
      paymentStatus === "rejected" ||
      paymentStatus === "cancelled"
    ) {
      newStatus = "cancelado";
    }

    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      console.error("Erro ao atualizar pedido no Supabase:", error);
      return res.status(500).json({ error: error.message });
    }

    console.log(`Pedido ${orderId} atualizado para status: ${newStatus}`);
    return res.sendStatus(200);
  } catch (error) {
    console.error("Erro no webhook:", error);
    return res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
