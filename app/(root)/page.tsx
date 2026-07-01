import { Button } from "@/components/ui/button";
import React from "react";

// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const Homepage = /*async*/ () => {
  // await delay(2000);
  return (
    <>
      <h1>Lian Kala</h1>
      <Button>Start Shopping</Button>
    </>
  );
};

export default Homepage;
