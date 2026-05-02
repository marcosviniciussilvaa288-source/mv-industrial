import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { clearCheckoutDraft, getCheckoutDraft } from "../lib/checkoutDraft";

const statusContent = {
  success: {
    title: "Pagamento aprovado",
    message:
      "Recebemos a confirmação do Mercado Pago. Seu pedido já foi registrado e será preparado pela MV Industrial.",
    tone: "success",
  },
  approved: {
    title: "Pagamento aprovado",
    message:
      "Recebemos a confirmação do Mercado Pago. Seu pedido já foi registrado e será preparado pela MV Industrial.",
    tone: "success",
  },
  pending: {
    title: "Pagamento pendente",
    message:
      "Seu pagamento ainda está em análise ou aguardando confirmação. Assim que o Mercado Pago aprovar, o pedido será atualizado.",
    tone: "pending",
  },
  failure: {
    title: "Pagamento não concluído",
    message:
      "Não foi possível finalizar o pagamento. Você pode voltar ao carrinho e tentar novamente.",
    tone: "failure",
  },
  rejected: {
    title: "Pagamento recusado",
    message:
      "O Mercado Pago recusou essa tentativa. Confira os dados de pagamento ou tente outro método.",
    tone: "failure",
  },
};

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();

  const status = searchParams.get("status");
  const orderId = searchParams.get("order_id") || searchParams.get("external_reference");
  const paymentId = searchParams.get("payment_id");
  const content = statusContent[status] || {
    title: "Checkout Mercado Pago",
    message:
      "Finalize sua compra pelo carrinho. Depois do pagamento, você verá o status do pedido aqui.",
    tone: "neutral",
  };

  useEffect(() => {
    if (content.tone === "success") {
      const draft = getCheckoutDraft();

      if (!draft || draft.source === "cart") {
        clearCart();
      }

      clearCheckoutDraft();
    }
  }, [clearCart, content.tone]);

  return (
    <section className="checkout-return-page">
      <div className="container checkout-return-layout">
        <div className={`checkout-status-card checkout-status-${content.tone}`}>
          <span className="checkout-status-icon">
            {content.tone === "success" ? "✓" : content.tone === "failure" ? "!" : "..."}
          </span>

          <h1>{content.title}</h1>
          <p>{content.message}</p>

          {(orderId || paymentId) && (
            <div className="checkout-reference-box">
              {orderId && (
                <span>
                  Pedido: <strong>{orderId}</strong>
                </span>
              )}
              {paymentId && (
                <span>
                  Pagamento: <strong>{paymentId}</strong>
                </span>
              )}
            </div>
          )}

          <div className="checkout-actions">
            <Link to="/catalogo" className="hero-primary-btn">
              Ver produtos
            </Link>
            <Link to="/carrinho" className="hero-secondary-btn">
              Voltar ao carrinho
            </Link>
            <a
              href="https://wa.me/5592994877241"
              target="_blank"
              rel="noreferrer"
              className="checkout-whatsapp-link"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
