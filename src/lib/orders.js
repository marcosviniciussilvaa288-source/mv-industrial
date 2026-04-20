import { supabase } from "./supabase";

export async function createOrder(userId, cartItems, total) {
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert([
      {
        user_id: userId,
        total,
        status: "pendente",
      },
    ])
    .select()
    .single();

  if (orderError) {
    return { error: orderError };
  }

  const items = cartItems.map((item) => ({
    order_id: order.id,
    product_slug: item.slug,
    product_name: item.name,
    price: Number(item.price || 0),
    quantity: item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(items);

  if (itemsError) {
    return { error: itemsError };
  }

  return { data: order };
}