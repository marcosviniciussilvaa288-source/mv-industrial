import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await signIn(form.email, form.password);

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    navigate("/minha-conta");
  };

  return (
    <section className="page">
      <div className="container">
        <h1>Entrar</h1>

        <form
          onSubmit={handleSubmit}
          style={{ maxWidth: "420px", background: "#fff", padding: "24px", borderRadius: "16px" }}
        >
          <input
            type="email"
            name="email"
            placeholder="Seu e-mail"
            value={form.email}
            onChange={handleChange}
            style={{ width: "100%", height: "46px", marginBottom: "12px", padding: "0 12px" }}
          />

          <input
            type="password"
            name="password"
            placeholder="Sua senha"
            value={form.password}
            onChange={handleChange}
            style={{ width: "100%", height: "46px", marginBottom: "12px", padding: "0 12px" }}
          />

          {error && (
            <p style={{ color: "red", marginBottom: "12px" }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              height: "46px",
              background: "#0A3D62",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </section>
  );
}