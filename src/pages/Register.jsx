import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
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
    setMessage("");
    setLoading(true);

    const { error } = await signUp(form.email, form.password);

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Cadastro realizado. Verifique seu e-mail para confirmar a conta, se necessário.");
    setTimeout(() => navigate("/login"), 2000);
  };

  return (
    <section className="page">
      <div className="container">
        <h1>Cadastro</h1>

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

          {message && (
            <p style={{ color: "green", marginBottom: "12px" }}>{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              height: "46px",
              background: "#00A859",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            {loading ? "Criando conta..." : "Criar conta"}
          </button>
        </form>
      </div>
    </section>
  );
}