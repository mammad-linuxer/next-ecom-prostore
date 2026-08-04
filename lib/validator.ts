import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";
import { PAYMENT_METHODS } from "./constants";

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

// Schema for signing in a user
export const signInFormSchema = z.object({
  email: z
    .email("Invalid Email Address")
    .min(3, "Email must be al least 3 characters."),
  password: z.string().min(3, "Password must be at least 3 characters."),
});

// Schema for signing up user
export const signUpFromSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.email().min(3, "Email must be at least 3 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Cart
export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  qty: z.number().int().nonnegative("Quantity must be a non-negative number"),
  image: z.string().min(1, "Image is required"),
  price: z
    .number()
    .refine((value) =>
      /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    ),
});

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, "Session cart is required"),
  userId: z.string().optional().nullable(),
});

// Shipping Address Schema
export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Name must have at least 3 chars."),
  streetAddress: z.string().min(3, "streetAddress must have at least 3 charsC"),
  city: z.string().min(3, "City must have at least 3 chars."),
  PostalCode: z.string().min(3, "Postal Code must have at least 3 chars."),
  country: z.string().min(3, "Country must have at least 3 chars."),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

// Payment Schema
export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, "Payment method is required"),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ["type"],
    message: "Invalid Payment Method",
  });
