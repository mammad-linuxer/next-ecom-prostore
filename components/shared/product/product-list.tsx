import React from "react";

const ProductList = ({
  data,
  title,
  limit,
}: {
  data: dataType[];
  title?: string;
  limit?: number;
}) => {
  const limitedData = limit ? data.slice(0, limit) : data;
  return (
    <div>
      <h1 className="mb-2">{title}</h1>
      {limitedData.length > 0 ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols3 
        lg:grid-cols4 gap-4"
        >
          {limitedData.map((product, id: number) => (
            <div key={id}>{product.name}</div>
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

type dataType =
  | {
      name: string;
      slug: string;
      category: string;
      description: string;
      images: string[];
      price: number;
      brand: string;
      rating: number;
      numReviews: number;
      stock: number;
      isFeatured: boolean;
      banner: string;
    }
  | {
      name: string;
      slug: string;
      category: string;
      description: string;
      images: string[];
      price: number;
      brand: string;
      rating: number;
      numReviews: number;
      stock: number;
      isFeatured: boolean;
      banner: null;
    };
