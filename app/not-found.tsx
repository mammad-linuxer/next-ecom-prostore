"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Image
        priority={true}
        src={"/images/logo.svg"}
        width={45}
        height={45}
        alt={`${APP_NAME} Logo`}
      />

      <div className="p-6 rounded-lg shadow-md md:w-1/3 w-1/2 text-center">
        <h1 className="md:text-xl text-2xl font-bold mb-4">Page Not Found</h1>
        <p className="text-destructive mb-3">
          Coud Not Find Requested Resource
        </p>
        <Button
          variant={"outline"}
          onClick={() => (window.location.href = "/")}
        >
          Homepage
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
