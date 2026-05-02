import { Link, useNavigate, useSearchParams } from "react-router-dom";
import logo from "../assets/mv-logo.png";
import { useCart } from "../context/CartContext";
import { useAuth } from "../auth/AuthContext";

export default function Header() {
  const { cartCount } = useCart();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const query = String(formData.get("q") || "").trim();
    const target = query ? `/catalogo?q=${encodeURIComponent(query)}` : "/catalogo";

    navigate(target);
  };

  return (
    <header className="site-header">
      <div className="container header-layout">
        <Link to="/" className="header-brand">
          <img src={logo} alt="MV Industrial" />
        </Link>

        <form
          action="/catalogo"
          role="search"
          onSubmit={handleSearchSubmit}
          className="header-search"
        >
          <input
            key={searchParams.get("q") || ""}
            type="search"
            name="q"
            defaultValue={searchParams.get("q") || ""}
            placeholder="Buscar produtos..."
            aria-label="Buscar produtos"
            className="header-search-input"
          />
          <button type="submit" className="header-search-button">
            Buscar
          </button>
        </form>

        <nav className="header-nav">
          <Link to="/catalogo">Catálogo</Link>
          <Link to="/admin">Admin</Link>

          <span className="header-account-actions">
            {user ? (
              <>
                <Link to="/minha-conta">Minha conta</Link>
                <button type="button" onClick={signOut}>
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link to="/cadastro">Crie a sua conta</Link>
                <Link to="/login">Entre</Link>
              </>
            )}

            <Link to="/carrinho" className="header-purchases-link">
              Compras
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="20" r="1.7" />
                <circle cx="18" cy="20" r="1.7" />
                <path d="M3 4h2l2.3 11.2a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 2-1.6L21.5 8H7" />
              </svg>
              <span>{cartCount}</span>
            </Link>
          </span>
        </nav>
      </div>
    </header>
  );
}
