import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import ProductPrice from "./product-price";
import { Product } from "@/types";
const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="p-0 items-center">
        <Link
          href={`/products/${product.slug}`}
          className="flex justify-center"
        >
          <Image
            priority={true}
            src={product.images[0]}
            alt={product.description}
            className="aspect-square object-cover rounded items-center"
            width={300}
            height={300}
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 grid gap-4">
        <div className="text-xs">{product.brand}</div>
        <Link href={`/product/${product.slug}`}>
          <h2 className="text-sm font-medium">{product.name}</h2>
        </Link>
        <div className="flex-between px-0.5 gap-4">
          <p>{product.rating} ⭐</p>
          {product.stock > 0 ? (
            <ProductPrice value={product.price} className="text-blue-900" />
          ) : (
            <p className="text-amber-900 text-xl">Out Of Stock</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
