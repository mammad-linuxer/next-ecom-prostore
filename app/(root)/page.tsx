import React from "react";
import ProductList from "@/components/shared/product/product-list";
// import sampleData from "@/db/sample-data";
import { getLatestProducts } from "@/lib/actions/product.actions";
// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const Homepage = async () => {
  // await delay(2000);
  const latestProducts = await getLatestProducts();
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold ">Lian Kala</h1>
      <h2 className="h2-bold">Latest Products</h2>
      <ProductList
        //data={sampleData.products}
        data={latestProducts}
        title="Special Offers"
        limit={10}
      />
    </div>
  );
};

export default Homepage;
