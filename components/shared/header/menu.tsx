import { EllipsisVertical, ShoppingCart, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import Link from "next/link";
import ModeToggle from "./mode-toggle";

const Menu = () => {
  return (
    <>
      <div className="flex justify-end gap-3">
        <nav className="md:flex hidden w-full max-w-xs gap-1">
          <ModeToggle />
          <Button asChild variant={"outline"}>
            <Link href="/cart">
              <ShoppingCart />
              Cart
            </Link>
          </Button>
          <Button asChild variant={"ghost"}>
            <Link href="sign-in">
              Sign In
              <UserIcon />
            </Link>
          </Button>
        </nav>
        <nav className="md:hidden">
          <Sheet>
            <SheetTrigger className="align-middle">
              <EllipsisVertical />
            </SheetTrigger>
            <SheetContent className="flex flex-col items-start p-3">
              <SheetTitle>Menu</SheetTitle>
              <ModeToggle />
              <Button asChild variant={"outline"}>
                <Link href="/cart">
                  <ShoppingCart />
                  Cart
                </Link>
              </Button>
              <Button asChild variant={"ghost"}>
                <Link href="sign-in">
                  Sign In
                  <UserIcon />
                </Link>
              </Button>
              <SheetDescription>Menu Description</SheetDescription>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </>
  );
};

export default Menu;
