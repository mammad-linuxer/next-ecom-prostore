"use client";
import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const ProductImage = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);
  return (
    <div className="space-y-4">
      <Image
        src={images![current]}
        className="min-h-75 object-cover object-center"
        width={1000}
        height={1000}
        alt="product main image"
      />
      <div className="flex">
        {images.map((image, index) => (
          <Image
            key={index}
            className={cn(
              "border mr-2 cursor-pointer hover:border-orange-600",
              current === index && "border-orange-500",
            )}
            src={image}
            width={100}
            height={100}
            alt="product other images"
            onClick={() => {
              setCurrent(index);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductImage;
