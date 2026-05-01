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

  const brands = ["3M", "ESAB", "FAME", "GEDORE", "MAKITA", "BOSCH", "CORAL", "DOCOL"];

  const heroImages = [
    "/products/pc-gamer-i7.webp",
    "/products/pc-gamer-i7-2.webp",
    "/products/pc-gamer-i7-3.webp",
    "/products/pc-gamer-i7-4.webp",
    "/products/pc-gamer-i7-5.webp",
    "/products/mouse-gamer.webp",
    "/products/teclado-gamer.webp",
    "/products/monitor-24.webp",
    "/products/ssd-480.webp",
    "/products/ram-16gb.webp",
  ];

  return (
    <>
      <section className="home-hero">
        <div className="container home-hero-grid">
          <div className="home-hero-text">
            <span className="hero-label">MV Industrial</span>

            <h1>Informática em Manaus com atendimento rápido</h1>

            <p>
              Computadores, periféricos, monitores, hardware e acessórios para
              empresas, gamers e uso profissional.
            </p>

            <div className="hero-actions">
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

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "nowrap",
              gap: "16px",
              overflowX: "auto",
              overflowY: "hidden",
              paddingBottom: "12px",
              width: "100%",
              maxWidth: "520px",
            }}
          >
            {heroImages.map((img, index) => (
              <div
                key={index}
                style={{
                  flex: "0 0 150px",
                  minWidth: "150px",
                  maxWidth: "150px",
                  height: "120px",
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  borderRadius: "12px",
                  padding: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={img}
                  alt="Produto em destaque"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    background: "#fff",
                    borderRadius: "8px",
                    display: "block",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="categories-section container">
        <h2>Categorias em destaque</h2>

        <div className="categories-grid">
          {categories.map((category) => (
            <Link
              to={`/catalogo?categoria=${category.slug}`}
              className="category-card"
              key={category.slug}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="products-section container">
        <div className="products-header">
          <h2>Produtos em destaque</h2>
          <Link to="/catalogo">Ver todos</Link>
        </div>

        <div className="home-products-grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="container" style={{ marginTop: "45px", marginBottom: "45px" }}>
        <h2 style={{ marginBottom: "18px" }}>Marcas trabalhadas</h2>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            gap: "16px",
            overflowX: "auto",
            overflowY: "hidden",
            paddingBottom: "12px",
            width: "100%",
          }}
        >
          {brands.map((brand) => (
            <div
              key={brand}
              style={{
                flex: "0 0 260px",
                minWidth: "260px",
                maxWidth: "260px",
                height: "75px",
                background: "#fff",
                border: "1px solid #ddd",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "800",
                color: "#003b63",
                fontSize: "18px",
              }}
            >
              {brand}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}