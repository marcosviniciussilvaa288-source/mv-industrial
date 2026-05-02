export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const token = process.env.MP_ACCESS_TOKEN;

    if (!token) {
      return res.status(500).json({
        error: "Token do Mercado Pago não configurado.",
      });
    }

    const { items } = req.body;

    const preference = {
      items: items.map((item) => ({
        title: item.name,
        quantity: Number(item.quantity || 1),
        unit_price: Number(item.price || 0),
        currency_id: "BRL",
      })),
    };

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preference),
    });

    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao criar pagamento",
    });
  }
}