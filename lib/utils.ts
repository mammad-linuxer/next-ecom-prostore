import { ProductType } from "@/components/shared/product/product-type";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// convert to js plain object

export function convertToPlainObject<T>(value: T): ProductType[] {
  const output = JSON.parse(JSON.stringify(value));
  const mappedOutput = output.map((product: ProductType) => ({
    ...product,
    price: Number(product.price),
    rating: Number(product.rating),
  }));
  return mappedOutput;
}
