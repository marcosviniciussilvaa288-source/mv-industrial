import { Link } from "react-router-dom";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const featuredProducts = products;

  const categories = [
  { name: "Computadores", slug: "computadores" },
  { name: "Monitores", slug: "monitores" },
  { name: "Periféricos", slug: "perifericos" },
  { name: "Hardware", slug: "hardware" },
  { name: "Acessórios", slug: "acessorios" },
  { name: "Ofertas", slug: "ofertas" },
];

  const brands = [
    "3M",
    "ESAB",
    "FAME",
    "GEDORE",
    "MAKITA",
    "BOSCH",
    "CORAL",
    "DOCOL",
  ];

  return (
    <>
      <section className="home-hero">
        <div className="container home-hero-grid">
          <div className="home-hero-text">
            <span className="hero-label">MV Industrial</span>
            <h1>Produtos industriais com atendimento rápido em Manaus</h1>
            <p>
              EPIs, ferramentas, embalagens, mangueiras e materiais industriais
              para empresas, obras e manutenção.
            </p>

            <div className="home-hero-actions">
              <a
                href="https://wa.me/5592994877241"
                target="_blank"
                rel="noreferrer"
                className="hero-primary-btn"
              >
                Solicitar orçamento
              </a>

              <Link to="/catalogo" className="hero-secondary-btn">
                Ver catálogo
              </Link>
            </div>
          </div>

          <div className="home-hero-cards">
            <div className="hero-mini-card">
              <img src="/products/capacete.webp" alt="Capacete" />
            </div>
            <div className="hero-mini-card">
              <img src="/products/Alicate universal.webp" alt="Alicate" />
            </div>
            <div className="hero-mini-card">
              <img src="/products/Filme stretch.webp" alt="Filme Stretch" />
            </div>
            <div className="hero-mini-card">
              <img src="/products/Lona preta.webp" alt="Lona Preta" />
            </div>
          </div>
        </div>
      </section>

      <section className="page">
        <div className="container">
          <div className="home-section-header">
            <h2>Categorias em destaque</h2>
          </div>

          <div className="home-categories-grid">
            {categories.map((category) => (
              <Link
                key={category.slug}
                to="/catalogo"
                className="home-category-card"
              >
                <span>{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="page home-light-section">
        <div className="container">
          <div className="home-section-header">
            <h2>Produtos em destaque</h2>
            <Link to="/catalogo" className="home-link-more">
              Ver todos
            </Link>
          </div>

          <div className="home-products-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="page">
        <div className="container">
          <div className="home-section-header">
            <h2>Marcas trabalhadas</h2>
          </div>

          <div className="home-brands-grid">
            {brands.map((brand) => (
              <div key={brand} className="home-brand-box">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page home-newsletter-section">
        <div className="container">
          <div className="home-newsletter-box">
            <div>
              <h3>Receba novidades da MV Industrial</h3>
              <p>Cadastre seu e-mail para receber lançamentos e promoções.</p>
            </div>

            <div className="home-newsletter-form">
              <input type="text" placeholder="Seu nome" />
              <input type="email" placeholder="Seu e-mail" />
              <button>Enviar</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}