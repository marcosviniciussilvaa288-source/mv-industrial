import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../auth/AuthContext";

export default function Admin() {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            product_name,
            quantity,
            price
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
        return;
      }

      setOrders(data || []);
    }

    fetchOrders();
  }, []);

  if (loading) {
    return <h1>Carregando...</h1>;
  }

  if (!user) {
    return <h1>Você precisa estar logado</h1>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin - Pedidos</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {orders.length === 0 ? (
        <p>Nenhum pedido encontrado.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "10px",
              background: "#fff",
            }}
          >
            <p><strong>Pedido:</strong> {order.id}</p>
            <p><strong>Usuário:</strong> {order.user_id}</p>
            <p><strong>Total:</strong> R$ {Number(order.total).toFixed(2)}</p>

            {/* STATUS COM COR */}
            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color:
                    order.status === "pago"
                      ? "green"
                      : order.status === "pendente"
                      ? "orange"
                      : order.status === "enviado"
                      ? "blue"
                      : "black",
                  fontWeight: "bold"
                }}
              >
                {order.status}
              </span>
            </p>

            <p>
              <strong>Data:</strong>{" "}
              {new Date(order.created_at).toLocaleString("pt-BR")}
            </p>

            {/* ITENS DO PEDIDO */}
            <div style={{ marginTop: "10px" }}>
              <strong>Itens:</strong>

              {order.order_items?.map((item, index) => (
                <p key={index}>
                  - {item.product_name} | Qtd: {item.quantity} | R$ {Number(item.price).toFixed(2)}
                </p>
              ))}
            </div>

            {/* SELECT DE STATUS */}
            <select
              value={order.status}
              onChange={async (e) => {
                const newStatus = e.target.value;

                await supabase
                  .from("orders")
                  .update({ status: newStatus })
                  .eq("id", order.id);

                window.location.reload();
              }}
              style={{
                marginTop: "10px",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                cursor: "pointer"
              }}
            >
              <option value="pendente">Pendente</option>
              <option value="pago">Pago</option>
              <option value="enviado">Enviado</option>
              <option value="entregue">Entregue</option>
            </select>

          </div>
        ))
      )}
    </div>
  );
}