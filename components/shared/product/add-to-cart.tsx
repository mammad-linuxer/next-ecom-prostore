"use client";
import { CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { addItemToCart } from "@/lib/actions/cart.actions";

const AddToCart = ({ item }: { item: Omit<CartItem, "cartId"> }) => {
  const router = useRouter();

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

  return (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      <Plus /> Add To Cart
    </Button>
  );
};

export default AddToCart;
