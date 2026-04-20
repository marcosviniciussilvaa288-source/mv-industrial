import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <div className="product-card-image">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="product-card-body">
        <span className="product-category">{product.category}</span>

        <h3>{product.name}</h3>

        <p className="product-price">R$ {Number(product.price).toFixed(2)}</p>

        <p className="product-stock">
          {product.stock > 0 ? `Estoque: ${product.stock}` : "Indisponível"}
        </p>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link to={`/produto/${product.slug}`} className="product-btn">
            Ver produto
          </Link>

          <button
            className="buy-btn"
            onClick={() => addToCart(product, 1)}
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
} 