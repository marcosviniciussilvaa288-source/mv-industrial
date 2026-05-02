import { useRef } from "react";
import { Link } from "react-router-dom";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";

function slugifyCategory(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function Home() {
  const promoCarouselRef = useRef(null);
  const featuredProducts = products.slice(0, 12);
  const spotlightProduct = products.find((product) => product.slug === "pc-gamer-i7") || products[0];

  const categories = [...new Set(products.map((product) => product.category))].map(
    (name) => ({
      name,
      slug: slugifyCategory(name),
      count: products.filter((product) => product.category === name).length,
    })
  );

  const brands = [
    { name: "Intel", image: "/brands/intel.png" },
    { name: "Kingston", image: "/brands/kingston.png" },
    { name: "Corsair", image: "/brands/corsair.png" },
    { name: "LG", image: "/brands/lg.png" },
    { name: "Logitech", image: "/brands/logitech.png" },
  ];

  const promoBanners = [
    "/brands/1776948281.webp",
    "/brands/1777323222.webp",
    "/brands/1777550885.webp",
    "/brands/1777577425.webp",
    "/brands/1777588344.webp",
  ];

  const scrollPromoCarousel = (direction) => {
    const carousel = promoCarouselRef.current;

    if (!carousel) {
      return;
    }

    carousel.scrollBy({
      left: direction * Math.round(carousel.clientWidth * 0.85),
      behavior: "smooth",
    });
  };

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

          <div className="home-hero-showcase">
            <div className="hero-spotlight-card">
              <span className="hero-spotlight-tag">Mais procurado</span>
              <img src={spotlightProduct.image} alt={spotlightProduct.name} />
              <div>
                <strong>{spotlightProduct.name}</strong>
                <p>
                  {Number(spotlightProduct.price || 0).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="promo-section">
        <div className="container promo-container">
          <button
            type="button"
            className="promo-arrow promo-arrow-left"
            aria-label="Banner anterior"
            onClick={() => scrollPromoCarousel(-1)}
          >
            {"<"}
          </button>

          <div className="promo-carousel" ref={promoCarouselRef}>
            {promoBanners.map((banner, index) => (
              <Link to="/catalogo" className="promo-banner-card" key={banner}>
                <img src={banner} alt={`Promoção MV Industrial ${index + 1}`} />
              </Link>
            ))}
          </div>

          <button
            type="button"
            className="promo-arrow promo-arrow-right"
            aria-label="Próximo banner"
            onClick={() => scrollPromoCarousel(1)}
          >
            {">"}
          </button>
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
              <span>{category.name}</span>
              <small>{category.count} produtos</small>
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

      <section className="brands-section container">
        <h2>Marcas trabalhadas</h2>

        <div className="brands-grid">
          {brands.map((brand) => (
            <div key={brand.name} className="brand-card">
              <img src={brand.image} alt={brand.name} />
              <span>{brand.name}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
