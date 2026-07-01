import { ProductType } from "./product-type";
import ProductCard from "./product-card";
const ProductList = ({
  data,
  title,
  limit,
}: {
  data: ProductType[];
  title?: string;
  limit?: number;
}) => {
  const limitedData = limit ? data.slice(0, limit) : data;
  return (
    <div>
      <h1 className="mb-2">{title}</h1>
      {limitedData.length > 0 ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 
        lg:grid-cols-4 gap-4"
        >
          {limitedData.map((product, id: number) => (
            <ProductCard key={id} data={product} />
          ))}
        </div>
      ) : (
        <div>
          <p>No Products Found</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
