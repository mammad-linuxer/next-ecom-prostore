import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// convert to js plain object
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// Format number with decimal places
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split("");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}

//Format Errors
//check if the error is ZodError
function isZodError(error: unknown): error is ZodError {
  return error instanceof ZodError;
}

// check if the error is PrismaError
function isPrismaClientKnownRequestError(
  error: unknown,
): error is PrismaClientKnownRequestError {
  return error instanceof PrismaClientKnownRequestError;
}

function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export function formatError(error: unknown) /* :string */ {
  if (isZodError(error) /*&& error.name === "ZodError"*/) {
    // Handle ZodError
    const errorObject = JSON.parse(error.message);
    console.log(errorObject);
    return errorObject[0].message;
  } else if (isPrismaClientKnownRequestError(error)) {
    // Handle Prisma Error
    const field =
      (
        error.meta as {
          driverAdapterError?: {
            cause?: {
              constraint?: {
                fields?: string[];
              };
            };
          };
        }
      )?.driverAdapterError?.cause?.constraint?.fields?.[0] ?? "Field";

    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
  } else {
    if (isError(error)) {
      // Handle other errors

      return typeof error.message === "string"
        ? error.message
        : JSON.stringify(error.message);
    }
  }
}

export function round2(value: number | string) {
  if (typeof value === "number") {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else if (typeof value === "string") {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error("input is neither a string nor a number");
  }
}
