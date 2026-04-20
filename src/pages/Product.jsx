import { useParams } from "react-router-dom";
import { products } from "../data/products";
import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function Product() {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();

  if (!product) {
    return (
      <section className="page">
        <div className="container">
          <h1>Produto não encontrado</h1>
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="container">
        <div className="product-page">
          <div className="product-page-image-box">
            <img src={product.image} alt={product.name} className="product-page-image" />
          </div>

          <div className="product-page-info">
            <p className="product-category">{product.category}</p>
            <h1>{product.name}</h1>

            <p className="product-price">R$ {Number(product.price).toFixed(2)}</p>
            <p className="product-stock">
              {product.stock > 0 ? `Estoque disponível: ${product.stock}` : "Indisponível"}
            </p>

            <div className="product-variants">
              {(product.variants || []).map((variant, index) => (
                <span key={index} className="variant-badge">
                  {variant}
                </span>
              ))}
            </div>

            <div className="qty-box">
              <button onClick={() => setQty(qty > 1 ? qty - 1 : 1)}>-</button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)}>+</button>
            </div>

            <div className="product-page-actions">
              <button className="buy-btn" onClick={() => addToCart(product, qty)}>
                Adicionar ao carrinho
              </button>

              <a
                href={`https://wa.me/5592994877241?text=${encodeURIComponent(
                  `Olá, quero orçamento do produto: ${product.name} | Quantidade: ${qty}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="hero-primary-btn"
              >
                Pedir orçamento
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}