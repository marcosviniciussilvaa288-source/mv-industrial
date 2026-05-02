import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
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

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("q") || "";
  const categorySlug = searchParams.get("categoria") || "todos";

  const categories = useMemo(() => {
    const unique = [...new Set(products.map((item) => item.category))];
    return [
      { name: "Todos", slug: "todos" },
      ...unique.map((name) => ({ name, slug: slugifyCategory(name) })),
    ];
  }, []);

  const selectedCategory =
    categories.find((item) => item.slug === categorySlug) || categories[0];

  const updateCatalogParams = (updates) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "todos") {
        nextParams.delete(key);
      } else {
        nextParams.set(key, value);
      }
    });

    setSearchParams(nextParams);
  };

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();

    return products.filter((item) => {
      const matchesCategory =
        categorySlug === "todos" || slugifyCategory(item.category) === categorySlug;

      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.variants || []).some((v) => v.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [search, categorySlug]);

  return (
    <section className="page">
      <div className="container">
        <h1>Catálogo</h1>

        <div className="catalog-controls">
          <input
            type="text"
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => updateCatalogParams({ q: e.target.value.trimStart() })}
            className="catalog-search"
          />

          <div className="catalog-chips">
            {categories.map((item) => (
              <button
                key={item.slug}
                className={`catalog-chip ${
                  selectedCategory.slug === item.slug ? "catalog-chip-active" : ""
                }`}
                onClick={() => updateCatalogParams({ categoria: item.slug })}
              >
                {item.name}
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
