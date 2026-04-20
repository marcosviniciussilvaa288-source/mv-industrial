import { useMemo, useState } from "react";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";

export default function Catalog() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");

  const categories = useMemo(() => {
    const unique = [...new Set(products.map((item) => item.category))];
    return ["Todos", ...unique];
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesCategory =
        category === "Todos" || item.category === category;

      const q = search.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.variants || []).some((v) => v.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  return (
    <section className="page">
      <div className="container">
        <h1>Catálogo</h1>

        <div className="catalog-controls">
          <input
            type="text"
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="catalog-search"
          />

          <div className="catalog-chips">
            {categories.map((item) => (
              <button
                key={item}
                className={`catalog-chip ${category === item ? "catalog-chip-active" : ""}`}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="catalog-count">
          {filteredProducts.length} produto(s) encontrado(s)
        </div>

        <div className="home-products-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}