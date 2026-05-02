import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { createOrder } from "../lib/orders";
import { createPaymentPreference } from "../lib/payments";
import {
  calculateCheckoutTotals,
  formatCurrency,
  getCheckoutDraft,
  PAYMENT_METHODS,
  saveCheckoutDraft,
  SHIPPING_OPTIONS,
} from "../lib/checkoutDraft";

export default function CheckoutPayment() {
  const { user } = useAuth();
  const initialDraft = useMemo(() => getCheckoutDraft(), []);
  const [draft, setDraft] = useState(initialDraft);
  const [paymentMethodId, setPaymentMethodId] = useState(
    initialDraft?.paymentMethodId || "pix"
  );
  const [contactEmail, setContactEmail] = useState(
    user?.email || initialDraft?.customerEmail || ""
  );
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const hasItems = draft?.items?.length > 0;
  const totals = calculateCheckoutTotals({
    ...draft,
    paymentMethodId,
  });
  const shippingOption =
    SHIPPING_OPTIONS[draft?.shippingOptionId] || SHIPPING_OPTIONS.delivery;

  const handlePay = async () => {
    setErrorMsg("");
    const payerEmail = contactEmail.trim() || user?.email || "";

    if (!hasItems) {
      setErrorMsg("Não há produtos para finalizar.");
      return;
    }

    if (!payerEmail) {
      setErrorMsg("Informe um e-mail para receber os dados da compra.");
      return;
    }

    const nextDraft = saveCheckoutDraft({
      ...draft,
      customerEmail: payerEmail,
      paymentMethodId,
    });

    setDraft(nextDraft);
    setSaving(true);

    try {
      let orderId = `site-${Date.now()}`;

      if (user?.id) {
        const { data, error } = await createOrder(
          user.id,
          nextDraft.items,
          nextDraft.totals.total
        );

        if (!error && data?.id) {
          orderId = data.id;
        }
      }

      const checkout = await createPaymentPreference({
        coupon: nextDraft.coupon,
        items: nextDraft.items,
        orderId,
        payerEmail,
        paymentMethod: paymentMethodId,
        shipping: {
          address: nextDraft.shippingAddress,
          method: nextDraft.shippingOptionId,
          price: nextDraft.totals.shippingValue,
        },
        total: nextDraft.totals.total,
      });

      const paymentUrl = checkout.init_point || checkout.sandbox_init_point;

      if (!paymentUrl) {
        throw new Error("Não foi possível iniciar o pagamento.");
      }

      window.location.assign(paymentUrl);
    } catch (error) {
      setErrorMsg(error.message || "Erro ao conectar com o pagamento.");
      setSaving(false);
    }
  };

  if (!hasItems) {
    return (
      <section className="checkout-flow-page">
        <div className="container checkout-empty-state">
          <h1>Não há compra em andamento</h1>
          <p>Volte ao carrinho para iniciar um novo checkout.</p>
          <Link to="/carrinho" className="hero-primary-btn">
            Ir ao carrinho
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout-flow-page">
      <div className="container checkout-flow-layout">
        <div className="checkout-flow-main">
          <h1>Escolha como pagar</h1>

          <div className="checkout-cashback-note">
            Você recebe atendimento MV Industrial nesta compra.
          </div>

          <div className="checkout-contact-card">
            <label htmlFor="checkout-email">E-mail para receber a compra</label>
            <input
              id="checkout-email"
              type="email"
              value={contactEmail}
              onChange={(event) => setContactEmail(event.target.value)}
              placeholder="seuemail@exemplo.com"
            />
          </div>

          <div className="checkout-payment-card">
            {Object.values(PAYMENT_METHODS).map((method) => (
              <label
                key={method.id}
                className={`checkout-payment-row ${
                  paymentMethodId === method.id ? "checkout-radio-active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethodId === method.id}
                  onChange={() => setPaymentMethodId(method.id)}
                />
                <span className={`payment-method-icon payment-${method.id}`}>
                  {method.id === "pix" ? "◆" : method.id === "boleto" ? "≡" : "MP"}
                </span>
                <span>
                  <strong>{method.label}</strong>
                  <small>{method.description}</small>
                </span>
              </label>
            ))}

            <div className="checkout-option-footer">
              <Link to="/checkout/entrega">Alterar entrega</Link>
              <button type="button" onClick={handlePay} disabled={saving}>
                {saving ? "Abrindo Mercado Pago..." : "Continuar"}
              </button>
            </div>
          </div>

          {errorMsg && <p className="checkout-flow-error">{errorMsg}</p>}
        </div>

        <aside className="checkout-summary-card">
          <h2>Resumo da compra</h2>
          <div>
            <span>Produto</span>
            <strong>{formatCurrency(totals.subtotal)}</strong>
          </div>
          {totals.discountValue > 0 && (
            <div className="checkout-discount-line">
              <span>Desconto do produto</span>
              <strong>-{formatCurrency(totals.discountValue)}</strong>
            </div>
          )}
          <div>
            <span>Frete</span>
            <strong>{formatCurrency(shippingOption.price)}</strong>
          </div>
          {draft?.coupon && <button className="checkout-coupon-link">Cupom {draft.coupon}</button>}
          <hr />
          <div className="checkout-pay-line">
            <span>Você pagará</span>
            <strong>{formatCurrency(totals.total)}</strong>
          </div>
          {totals.discountValue > 0 && (
            <small>Você economizou {formatCurrency(totals.discountValue)}</small>
          )}
        </aside>
      </div>
    </section>
  );
}
