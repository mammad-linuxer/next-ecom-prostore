import { getOrderById } from "@/lib/actions/order.actions";
import { notFound } from "next/navigation";
import { ShippingAddress } from "@/types";
import { Metadata } from "next";
import OrderDetailsTable from "./order-details-table";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Order Details",
};
const OrderDetailsPage = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;

  const { id } = params;

  const order = await getOrderById(id);

  if (!order) notFound();

  const session = await auth();
  return (
    <>
      <OrderDetailsTable
        order={{
          ...order,
          shippingAddress: order.shippingAddress as ShippingAddress,
        }}
        isAdmin={session?.user.role === "admin" || false}
      />
    </>
  );
};

export default OrderDetailsPage;
