import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

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

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);

    const { error } = await signInWithGoogle();

    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="container auth-layout">
        <div className="auth-copy">
          <h1>Digite seu e-mail e senha para iniciar sessão</h1>

          <a
            href="https://wa.me/5592994877241?text=Ol%C3%A1%2C%20estou%20com%20um%20problema%20de%20seguran%C3%A7a%20na%20minha%20conta."
            target="_blank"
            rel="noreferrer"
            className="auth-security-link"
          >
            <span className="auth-security-icon">!</span>
            Tenho um problema de segurança
            <span aria-hidden="true">›</span>
          </a>
        </div>

        <div className="auth-card">
          <form onSubmit={handleSubmit} className="auth-form">
            <label htmlFor="login-email">E-mail</label>
            <input
              id="login-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              autoFocus
            />

            <label htmlFor="login-password">Senha</label>
            <input
              id="login-password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" disabled={loading} className="auth-primary-button">
              {loading ? "Entrando..." : "Continuar"}
            </button>
          </form>

          <Link to="/cadastro" className="auth-create-link">
            Criar conta
          </Link>

          <div className="auth-divider">
            <span>ou</span>
          </div>

          <button
            type="button"
            className="auth-google-button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
          >
            <span className="google-mark">G</span>
            {googleLoading ? "Abrindo Google..." : "Fazer login com o Google"}
          </button>
        </div>
      </div>
    </section>
  );
}
