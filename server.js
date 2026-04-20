import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mercadopago from "mercadopago";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const {
  MP_ACCESS_TOKEN,
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  FRONTEND_URL,
} = process.env;

mercadopago.configure({
  access_token: MP_ACCESS_TOKEN,
});

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

app.get("/", (_req, res) => {
  res.send("Servidor de pagamento da MV Industrial rodando.");
});

app.post("/create_preference", async (req, res) => {
  try {
    const { items, orderId } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Itens não enviados." });
    }

    if (!orderId) {
      return res.status(400).json({ error: "orderId não enviado." });
    }

    const preference = {
      items: items.map((item) => ({
        title: item.name,
        quantity: Number(item.quantity),
        currency_id: "BRL",
        unit_price: Number(item.price),
      })),
      external_reference: orderId,
      notification_url: "http://SEU_ENDERECO_PUBLICO/webhook",
      back_urls: {
        success: `${FRONTEND_URL}/checkout?status=success`,
        failure: `${FRONTEND_URL}/checkout?status=failure`,
        pending: `${FRONTEND_URL}/checkout?status=pending`,
      },
      auto_return: "approved",
    };

    const response = await mercadopago.preferences.create(preference);

    return res.json({
      id: response.body.id,
      init_point: response.body.init_point,
      sandbox_init_point: response.body.sandbox_init_point,
    });
  } catch (error) {
    console.error("Erro ao criar preferência:", error);
    return res.status(500).json({ error: "Erro ao criar preferência." });
  }
});

app.post("/webhook", async (req, res) => {
  try {
    console.log("Webhook recebido:", JSON.stringify(req.body, null, 2));

    const type = req.body.type || req.body.action;
    const paymentId =
      req.body.data?.id ||
      req.body.resource?.split("/")?.pop();

    if (!paymentId) {
      return res.sendStatus(200);
    }

    const paymentResponse = await mercadopago.payment.findById(paymentId);
    const payment = paymentResponse.body;

    const orderId = payment.external_reference;
    const paymentStatus = payment.status;

    if (!orderId) {
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
    } else if (
      paymentStatus === "pending" ||
      paymentStatus === "in_process" ||
      paymentStatus === "in_mediation"
    ) {
      newStatus = "pendente";
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

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});