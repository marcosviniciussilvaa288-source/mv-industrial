import { Link } from "react-router-dom";
import logo from "../assets/mv-logo.png";
import { useCart } from "../context/CartContext";
import { useAuth } from "../auth/AuthContext";

export default function Header() {
  const { cartCount } = useCart();
  const { user, signOut } = useAuth();

  return (
    <header style={{ background: "#0A3D62", color: "#fff", borderBottom: "4px solid #00A859" }}>
      <div
        className="container"
        style={{
          display: "grid",
          gridTemplateColumns: "180px 1fr auto",
          gap: "20px",
          alignItems: "center",
          padding: "12px 24px",
        }}
      >
        <Link to="/">
          <img src={logo} alt="MV Industrial" style={{ width: "150px", display: "block" }} />
        </Link>

        <input
          type="text"
          placeholder="Buscar produtos..."
          style={{
            height: "46px",
            borderRadius: "8px",
            border: "none",
            padding: "0 14px",
            width: "100%",
          }}
        />

        <nav style={{ display: "flex", gap: "16px", fontWeight: "700", alignItems: "center", flexWrap: "wrap" }}>
          <Link to="/catalogo">Catálogo</Link>
          <Link to="/carrinho">Carrinho ({cartCount})</Link>
          <Link to="/admin">Admin</Link>

          {user ? (
            <>
              <Link to="/minha-conta">Minha conta</Link>
              <button
                onClick={signOut}
                style={{
                  background: "#00A859",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  cursor: "pointer",
                  fontWeight: "700",
                }}
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Entrar</Link>
              <Link to="/cadastro">Cadastro</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}