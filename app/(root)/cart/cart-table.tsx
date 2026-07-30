"use client";
import { useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Loader, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { Cart } from "@/types";

const CartTable = ({ cart }: { cart?: Cart }) => {
  return (
    <>
      <h1 className="py-4 h2-bold">CartTable</h1>
      {!cart || cart.items.length === 0 ? (
        <div>
          Cart is Empty <Link href={"/"}>Go Shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className=" overflow-x-auto md:col-span-3 ">Cart is Empty</div>
        </div>
      )}
    </>
  );
};

export default CartTable;
