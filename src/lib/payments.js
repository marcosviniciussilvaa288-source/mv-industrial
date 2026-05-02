export async function createPaymentPreference(cartItems) {
  const response = await fetch("/api/create-preference", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: cartItems,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Erro ao criar pagamento");
  }

  return data;
}