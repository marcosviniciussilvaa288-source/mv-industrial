import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../auth/AuthContext";
import { createOrder } from "../lib/orders";
import { Link } from "react-router-dom";

export default function Cart() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
  } = useCart();

  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const whatsappMessage =
    cartItems.length === 0
      ? "Olá, vim pelo site da MV Industrial."
      : `Olá, quero orçamento destes produtos:\n${cartItems
          .map(
            (item, index) =>
              `${index + 1}. ${item.name} - Quantidade: ${item.quantity} - Valor: R$ ${Number(item.price).toFixed(2)}`
          )
          .join("\n")}\n\nTotal estimado: R$ ${cartTotal.toFixed(2)}`;

  const handleSaveOrder = async () => {
    setMessage("");
    setErrorMsg("");

    if (!user) {
      setErrorMsg("Você precisa estar logado.");
      return;
    }

    if (cartItems.length === 0) {
      setErrorMsg("Carrinho vazio.");
      return;
    }

    setSaving(true);

    const { error } = await createOrder(user.id, cartItems, cartTotal);

    setSaving(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setMessage("Pedido salvo com sucesso no banco.");
    clearCart();
  };

  const handleCheckout = async () => {
    setMessage("");
    setErrorMsg("");

    if (!user) {
      setErrorMsg("Você precisa estar logado.");
      return;
    }

    if (cartItems.length === 0) {
      setErrorMsg("Carrinho vazio.");
      return;
    }

    setSaving(true);

    const { data, error } = await createOrder(user.id, cartItems, cartTotal);

    if (error) {
      setSaving(false);
      setErrorMsg(error.message);
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/create_preference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: data.id,
          items: cartItems,
        }),
      });

      const checkout = await response.json();
      setSaving(false);

      if (checkout.init_point) {
        window.location.href = checkout.init_point;
        return;
      }

      setErrorMsg("Não foi possível iniciar o pagamento.");
    } catch (error) {
      setSaving(false);
      setErrorMsg("Erro ao conectar com o servidor de pagamento.");
    }
  };

  return (
    <section className="page">
      <div className="container">
        <h1>Carrinho</h1>

        {!user && (
          <p style={{ marginBottom: "16px" }}>
            Faça <Link to="/login">login</Link> para salvar pedido ou pagar.
          </p>
        )}

        {cartItems.length === 0 ? (
          <p>Seu carrinho está vazio.</p>
        ) : (
          <div className="cart-page">
            <div className="cart-list-box">
              {cartItems.map((item) => (
                <div key={item.slug} className="cart-row">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-row-image"
                  />

                  <div className="cart-row-info">
                    <h3>{item.name}</h3>
                    <p>R$ {Number(item.price).toFixed(2)}</p>
                    <p>Estoque: {item.stock}</p>
                  </div>

                  <div className="cart-row-actions">
                    <div className="qty-box">
                      <button onClick={() => decreaseQuantity(item.slug)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => increaseQuantity(item.slug)}>+</button>
                    </div>

                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.slug)}
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Resumo</h2>
              <p>
                Total: <strong>R$ {cartTotal.toFixed(2)}</strong>
              </p>

              {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
              {message && <p style={{ color: "green" }}>{message}</p>}

              <button
                className="hero-primary-btn"
                style={{
                  width: "100%",
                  border: "none",
                  cursor: "pointer",
                  marginTop: "12px",
                }}
                onClick={handleSaveOrder}
                disabled={saving}
              >
                {saving ? "Salvando pedido..." : "Salvar pedido no banco"}
              </button>

              <button
                className="hero-primary-btn"
                style={{
                  width: "100%",
                  border: "none",
                  cursor: "pointer",
                  marginTop: "12px",
                  background: "#0A3D62",
                }}
                onClick={handleCheckout}
                disabled={saving}
              >
                {saving ? "Preparando pagamento..." : "Pagar com Mercado Pago"}
              </button>

              <a
                href={`https://wa.me/5592994877241?text=${encodeURIComponent(
                  whatsappMessage
                )}`}
                target="_blank"
                rel="noreferrer"
                className="hero-primary-btn"
                style={{
                  display: "block",
                  textAlign: "center",
                  marginTop: "12px",
                }}
              >
                Enviar pedido no WhatsApp
              </a>

              <button className="clear-btn" onClick={clearCart}>
                Limpar carrinho
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}