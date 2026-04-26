import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const productImage = product.image || product.images?.[0];

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "12px",
        height: "330px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
        border: "1px solid #ddd",
      }}
    >
      <Link to={`/produto/${product.slug}`}>
        <img
          src={productImage}
          alt={product.name}
          style={{
            width: "100%",
            height: "140px",
            objectFit: "contain",
            background: "#fff",
            display: "block",
          }}
        />
      </Link>

      <div>
        <p
          style={{
            color: "#00a859",
            fontWeight: "bold",
            fontSize: "12px",
            textTransform: "uppercase",
            marginTop: "8px",
          }}
        >
          {product.category}
        </p>

        <h3
          style={{
            fontSize: "15px",
            lineHeight: "1.2",
            margin: "6px 0",
            minHeight: "36px",
          }}
        >
          {product.name}
        </h3>

        <p
          style={{
            color: "#0b4770",
            fontWeight: "bold",
            fontSize: "20px",
            margin: "6px 0",
          }}
        >
          R$ {Number(product.price).toFixed(2)}
        </p>

        <p style={{ fontSize: "12px", marginBottom: "8px" }}>
          Estoque: {product.stock}
        </p>

        <div style={{ display: "flex", gap: "8px" }}>
          <Link
            to={`/produto/${product.slug}`}
            style={{
              flex: 1,
              background: "#0b4770",
              color: "#fff",
              padding: "8px",
              borderRadius: "7px",
              textAlign: "center",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            Ver produto
          </Link>

          <button
            onClick={() => addToCart(product)}
            style={{
              flex: 1,
              background: "#00a859",
              color: "#fff",
              padding: "8px",
              borderRadius: "7px",
              border: "none",
              fontSize: "12px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}