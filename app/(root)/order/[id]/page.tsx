import { getOrderById } from "@/lib/actions/order.actions";
import { notFound } from "next/navigation";
import { ShippingAddress } from "@/types";
import { Metadata } from "next";
export const metadata: Metadata = {
  description: "Order Details",
};
const OrderDetailsPage = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;

  const { id } = params;

  const order = await getOrderById(id);

  if (!order) notFound();
  
  return <div>OrderDetailsPage</div>;
};

export default OrderDetailsPage;
