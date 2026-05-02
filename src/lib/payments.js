const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function createPaymentPreference({
  orderId,
  items,
  total,
  coupon,
  payerEmail,
  paymentMethod,
  shipping,
}) {
  const response = await fetch(`${API_URL}/create_preference`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      coupon,
      items,
      orderId,
      payerEmail,
      paymentMethod,
      shipping,
      total,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Nao foi possivel iniciar o pagamento.");
  }

  return data;
}
