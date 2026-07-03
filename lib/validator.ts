import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";

//Schema for inserting a product

const currency = z
  .string()
  .refine((value) =>
    /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
  );

export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 chars."),
  slug: z.string().min(3, "Slug must be at least 3 chars."),
  category: z.string().min(3, "Category must be at least 3 chars."),
  brand: z.string().min(3, "Brand must be at least 3 chars."),
  description: z.string().min(3, "Description must be at least 3 chars."),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, "Product must have at least one image"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
});
