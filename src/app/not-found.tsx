import React from "react";
import { LuConstruction } from "react-icons/lu";

export default function NotFound() {
  return (
    <div className="h-[80dvh] w-full flex items-center justify-center px-5">
      <div className="flex flex-col items-center">
        <h2 className="text-[20px] text-gray-700 font-bold mb-4">Not Found</h2>
        <LuConstruction size={40} className="mb-7" />
        <p className="text-center">
          This page was not found. It may be under construction. Do check back
          later!
        </p>
      </div>
    </div>
  );
}
