import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  createCheckoutDraft,
  calculateCheckoutTotals,
  formatCurrency,
  getCheckoutDraft,
  saveCheckoutDraft,
  SHIPPING_OPTIONS,
} from "../lib/checkoutDraft";

export default function CheckoutDelivery() {
  const navigate = useNavigate();
  const { cartItems } = useCart();

  const initialDraft = useMemo(() => {
    return getCheckoutDraft() || createCheckoutDraft({ items: cartItems });
  }, [cartItems]);

  const [draft, setDraft] = useState(initialDraft);
  const [shippingOptionId, setShippingOptionId] = useState(
    initialDraft?.shippingOptionId || "delivery"
  );
  const [shippingAddress, setShippingAddress] = useState(
    initialDraft?.shippingAddress || {}
  );

  const hasItems = draft?.items?.length > 0;
  const selectedShipping = SHIPPING_OPTIONS[shippingOptionId];
  const updatedDraft = {
    ...draft,
    shippingAddress,
    shippingOptionId,
  };
  const totals = calculateCheckoutTotals(updatedDraft);

  const updateAddress = (field, value) => {
    setShippingAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContinue = () => {
    const nextDraft = saveCheckoutDraft({
      ...draft,
      shippingAddress,
      shippingOptionId,
    });

    setDraft(nextDraft);
    navigate("/checkout/pagamento");
  };

  if (!hasItems) {
    return (
      <section className="checkout-flow-page">
        <div className="container checkout-empty-state">
          <h1>Seu carrinho está vazio</h1>
          <p>Adicione produtos antes de escolher a entrega.</p>
          <Link to="/catalogo" className="hero-primary-btn">
            Ver produtos
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout-flow-page">
      <div className="container checkout-flow-layout">
        <div className="checkout-flow-main">
          <h1>Confira a forma de entrega</h1>

          <div className="checkout-option-card">
            {Object.values(SHIPPING_OPTIONS).map((option) => (
              <label
                key={option.id}
                className={`checkout-radio-row ${
                  shippingOptionId === option.id ? "checkout-radio-active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="shipping"
                  checked={shippingOptionId === option.id}
                  onChange={() => setShippingOptionId(option.id)}
                />
                <span>
                  <strong>{option.label}</strong>
                  <small>{option.description}</small>
                </span>
                <strong>{option.price > 0 ? formatCurrency(option.price) : "Grátis"}</strong>
              </label>
            ))}

            {shippingOptionId === "delivery" && (
              <div className="checkout-address-box">
                <div className="checkout-form-grid">
                  <label>
                    Endereço
                    <input
                      value={shippingAddress.street || ""}
                      onChange={(e) => updateAddress("street", e.target.value)}
                    />
                  </label>
                  <label>
                    Número
                    <input
                      value={shippingAddress.number || ""}
                      onChange={(e) => updateAddress("number", e.target.value)}
                    />
                  </label>
                  <label>
                    Bairro
                    <input
                      value={shippingAddress.neighborhood || ""}
                      onChange={(e) =>
                        updateAddress("neighborhood", e.target.value)
                      }
                    />
                  </label>
                  <label>
                    Cidade
                    <input
                      value={shippingAddress.city || ""}
                      onChange={(e) => updateAddress("city", e.target.value)}
                    />
                  </label>
                  <label>
                    CEP
                    <input
                      value={shippingAddress.cep || ""}
                      onChange={(e) => updateAddress("cep", e.target.value)}
                    />
                  </label>
                  <label>
                    Identificação
                    <input
                      value={shippingAddress.label || ""}
                      onChange={(e) => updateAddress("label", e.target.value)}
                    />
                  </label>
                </div>
              </div>
            )}

            <div className="checkout-option-footer">
              <Link to="/carrinho">Alterar produtos</Link>
              <button type="button" onClick={handleContinue}>
                Continuar
              </button>
            </div>
          </div>
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
            <strong>{formatCurrency(selectedShipping.price)}</strong>
          </div>
          <hr />
          <div className="checkout-total-line">
            <span>Total</span>
            <strong>{formatCurrency(totals.total)}</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}
