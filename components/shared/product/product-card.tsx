import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ProductType } from "./product-type";
import Image from "next/image";
import Link from "next/link";
const ProductCard = ({ data }: { data: ProductType }) => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="p-0 items-center">
        <Link href={`/products/${data.slug}`}>
          <Image
            priority={true}
            src={data.images[0]}
            alt={data.description}
            className="aspect-square object-cover rounded"
            width={300}
            height={300}
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 grid gap-4">
        <div className="text-xs">{data.brand}</div>
        <Link href={`/product/${data.slug}`}>
          <h2 className="text-sm font-medium">{data.name}</h2>
        </Link>
        <div className="flex-between px-0.5 gap-4">
          <p>{data.rating} ⭐</p>
          {data.stock > 0 ? <p>${data.price}</p> : <p>Out Of Stock</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
