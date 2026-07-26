"use client";
import { Cart, CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, Minus } from "lucide-react";
import { useRouter } from "next/navigation";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";

const AddToCart = ({
  cart,
  item,
}: {
  cart?: Cart;
  item: Omit<CartItem, "cartId">;
}) => {
  const router = useRouter();

  // Add item to cart
  const handleAddToCart = async () => {
    // Execute the addItemToCart action
    const res = await addItemToCart(item);

    //Display right toast message based on the result
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    toast.success(res.message /* `${item.name} added to the cart` */, {
      action: {
        label: "Go To Cart",
        onClick: () => router.push("/cart"),
      },
    });
  };

  // Remove Item from cart
  const handleRemoveFromCart = async () => {
    const res = await removeItemFromCart(item.productId);
    if (res.success) {
      toast.success(res.message, {
        action: { label: "Go to cart", onClick: () => router.push("/cart") },
      });
    } else {
      toast.error(res.message);
    }
  };

  const existItem =
    cart && cart.items.find((x) => (x.productId === item.productId));
  return existItem ? (
    <div>
      <Button variant={"outline"} onClick={handleRemoveFromCart}>
        <Minus className="w-4 h-4" />
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button type="button" variant={"outline"} onClick={handleAddToCart}>
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  ) : (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      <Plus /> Add To Cart
    </Button>
  );
};

export default AddToCart;
