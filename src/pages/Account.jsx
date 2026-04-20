import { useAuth } from "../auth/AuthContext";

export default function Account() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <section className="page">
        <div className="container">
          <h1>Carregando...</h1>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="page">
        <div className="container">
          <h1>Minha conta</h1>
          <p>Você precisa estar logado para acessar esta página.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="container">
        <h1>Minha conta</h1>

        <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", maxWidth: "500px" }}>
          <p><strong>E-mail:</strong> {user.email}</p>
          <p><strong>ID do usuário:</strong> {user.id}</p>
        </div>
      </div>
    </section>
  );
}