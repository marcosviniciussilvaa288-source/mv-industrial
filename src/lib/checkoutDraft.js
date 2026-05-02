const CHECKOUT_DRAFT_KEY = "mv_checkout_draft";

export const SHIPPING_OPTIONS = {
  delivery: {
    id: "delivery",
    label: "Enviar no meu endereço",
    price: 25,
    description: "Entrega em Manaus e região metropolitana.",
  },
  pickup: {
    id: "pickup",
    label: "Retirar na loja",
    price: 0,
    description: "Retirada combinada direto com a MV Industrial.",
  },
};

export const PAYMENT_METHODS = {
  pix: {
    id: "pix",
    label: "Pix",
    description: "Aprovação imediata",
  },
  mercadopago: {
    id: "mercadopago",
    label: "Cartão pelo Mercado Pago",
    description: "Crédito, débito e saldo Mercado Pago",
  },
  boleto: {
    id: "boleto",
    label: "Boleto",
    description: "Compensação em até 2 dias úteis",
  },
};

function roundMoney(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

export function calculateCheckoutTotals(draft) {
  const items = Array.isArray(draft.items) ? draft.items : [];
  const subtotal = roundMoney(
    items.reduce(
      (acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 1),
      0
    )
  );
  const discountPercent = Number(draft.discountPercent || 0);
  const discountValue = roundMoney(subtotal * (discountPercent / 100));
  const shippingOption =
    SHIPPING_OPTIONS[draft.shippingOptionId] || SHIPPING_OPTIONS.delivery;
  const shippingValue = roundMoney(shippingOption.price);
  const total = roundMoney(subtotal - discountValue + shippingValue);

  return {
    subtotal,
    discountPercent,
    discountValue,
    shippingValue,
    total,
  };
}

export function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function createCheckoutDraft({
  coupon = null,
  discountPercent = 0,
  items,
  source = "cart",
}) {
  const draft = {
    coupon,
    discountPercent,
    items,
    paymentMethodId: "pix",
    shippingAddress: {
      label: "Trabalho",
      street: "Avenida Autaz Mirim",
      number: "2111",
      neighborhood: "Coroado",
      city: "Manaus",
      cep: "69082265",
    },
    shippingOptionId: "delivery",
    source,
  };

  return {
    ...draft,
    totals: calculateCheckoutTotals(draft),
  };
}

export function saveCheckoutDraft(draft) {
  const nextDraft = {
    ...draft,
    totals: calculateCheckoutTotals(draft),
  };

  sessionStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(nextDraft));
  return nextDraft;
}

export function getCheckoutDraft() {
  try {
    const saved = sessionStorage.getItem(CHECKOUT_DRAFT_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function clearCheckoutDraft() {
  sessionStorage.removeItem(CHECKOUT_DRAFT_KEY);
}
