import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";

export default function Product() {
  const { slug } = useParams();
  const { addToCart } = useCart();

  const product = products.find((item) => item.slug === slug);

  const [selectedImage, setSelectedImage] = useState("");
  const [reviews, setReviews] = useState([]);
  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  useEffect(() => {
    if (product) {
      const productImages = product.images || [product.image];
      setSelectedImage(productImages[0]);

      const savedReviews = localStorage.getItem(`reviews-${product.slug}`);
      setReviews(savedReviews ? JSON.parse(savedReviews) : []);
    }
  }, [product]);

  if (!product) {
    return (
      <section className="page">
        <div className="container">
          <h1>Produto não encontrado</h1>
        </div>
      </section>
    );
  }

  const productImages = product.images || [product.image];

  const handleBuyNow = async () => {
    try {
      const response = await fetch("http://localhost:3001/create_preference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [
            {
              title: product.name,
              unit_price: product.price,
              quantity: 1,
            },
          ],
        }),
      });

      const data = await response.json();

      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert("Erro ao iniciar pagamento");
      }
    } catch (error) {
      alert("Erro ao conectar com pagamento");
    }
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();

    if (!reviewName.trim() || !reviewText.trim()) {
      alert("Preencha seu nome e sua opinião.");
      return;
    }

    const newReview = {
      id: Date.now(),
      name: reviewName,
      text: reviewText,
      rating: reviewRating,
      date: new Date().toLocaleDateString("pt-BR"),
    };

    const updatedReviews = [newReview, ...reviews];

    setReviews(updatedReviews);
    localStorage.setItem(
      `reviews-${product.slug}`,
      JSON.stringify(updatedReviews)
    );

    setReviewName("");
    setReviewText("");
    setReviewRating(5);
  };

  return (
    <section className="page">
      <div className="container">
        <div className="product-page">
          <div className="product-page-image-box">
            <img
              src={selectedImage}
              alt={product.name}
              className="product-page-image"
            />

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "15px",
                flexWrap: "wrap",
              }}
            >
              {productImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.name} ${index + 1}`}
                  onClick={() => setSelectedImage(img)}
                  style={{
                    width: "70px",
                    height: "70px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    cursor: "pointer",
                    border:
                      selectedImage === img
                        ? "3px solid #00A859"
                        : "1px solid #ddd",
                    padding: "4px",
                    background: "#fff",
                  }}
                />
              ))}
            </div>
          </div>

          <div className="product-page-info">
            <p className="product-category">{product.category}</p>

            <h1>{product.name}</h1>

            <p className="product-price">
              R$ {Number(product.price).toFixed(2)}
            </p>

            <p className="product-stock">Estoque: {product.stock}</p>

            {product.variants && product.variants.length > 0 && (
              <div className="product-variants">
                <strong>Variações:</strong>

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                    marginTop: "8px",
                  }}
                >
                  {product.variants.map((variant, index) => (
                    <span key={index} className="variant-badge">
                      {variant}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.description && product.description.length > 0 && (
              <div
                style={{
                  marginTop: "22px",
                  padding: "16px",
                  background: "#fff",
                  borderRadius: "12px",
                  border: "1px solid #ddd",
                }}
              >
                <h3 style={{ marginBottom: "10px" }}>Características</h3>

                <ul style={{ paddingLeft: "20px", margin: 0 }}>
                  {product.description.map((item, index) => (
                    <li key={index} style={{ marginBottom: "8px" }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div
              className="product-page-actions"
              style={{
                marginTop: "20px",
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <button className="buy-btn" onClick={() => addToCart(product)}>
                Adicionar ao carrinho
              </button>

              <button
                className="hero-primary-btn"
                style={{ background: "#ff6600" }}
                onClick={handleBuyNow}
              >
                Comprar agora
              </button>

              <a
                href={`https://wa.me/5592994877241?text=${encodeURIComponent(
                  `Olá, tenho interesse no produto: ${product.name}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="hero-primary-btn"
              >
                Pedir no WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "30px",
            background: "#fff",
            padding: "24px",
            borderRadius: "16px",
            border: "1px solid #ddd",
          }}
        >
          <h2>Opiniões sobre o produto</h2>

          <form onSubmit={handleSubmitReview} style={{ marginTop: "16px" }}>
            <input
              type="text"
              value={reviewName}
              onChange={(e) => setReviewName(e.target.value)}
              placeholder="Seu nome"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginBottom: "10px",
              }}
            />

            <select
              value={reviewRating}
              onChange={(e) => setReviewRating(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginBottom: "10px",
              }}
            >
              <option value={5}>5 estrelas</option>
              <option value={4}>4 estrelas</option>
              <option value={3}>3 estrelas</option>
              <option value={2}>2 estrelas</option>
              <option value={1}>1 estrela</option>
            </select>

            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Escreva sua opinião sobre o produto"
              rows="4"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginBottom: "10px",
                resize: "vertical",
              }}
            />

            <button
              type="submit"
              className="hero-primary-btn"
              style={{
                border: "none",
                cursor: "pointer",
              }}
            >
              Enviar opinião
            </button>
          </form>

          <div style={{ marginTop: "24px" }}>
            {reviews.length === 0 ? (
              <p>Ainda não há opiniões para este produto.</p>
            ) : (
              reviews.map((review) => (
                <div
                  key={review.id}
                  style={{
                    borderTop: "1px solid #ddd",
                    paddingTop: "14px",
                    marginTop: "14px",
                  }}
                >
                  <strong>{review.name}</strong>
                  <p style={{ margin: "4px 0" }}>
                    {"⭐".repeat(review.rating)}
                  </p>
                  <p>{review.text}</p>
                  <small>{review.date}</small>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}