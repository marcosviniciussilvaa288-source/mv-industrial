import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const productImage = product.image || product.images?.[0];
  const price = Number(product.price || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <article className="store-product-card">
      <Link
        to={`/produto/${product.slug}`}
        className="store-product-media"
        aria-label={`Ver produto ${product.name}`}
      >
        <span
          className="store-product-photo"
          style={{ backgroundImage: `url(${productImage})` }}
        />
      </Link>

      <div className="store-product-content">
        <div className="store-product-meta">
          <span>{product.category}</span>
          <small>{product.stock} em estoque</small>
        </div>

        <h3>
          <Link to={`/produto/${product.slug}`}>{product.name}</Link>
        </h3>

        <p className="store-product-price">{price}</p>

        <div className="store-product-actions">
          <Link
            to={`/produto/${product.slug}`}
            className="store-product-details"
          >
            Ver produto
          </Link>

          <button
            type="button"
            onClick={() => addToCart(product)}
            className="store-product-add"
          >
            Adicionar
          </button>
        </div>
      </div>
    </article>
  );
}
