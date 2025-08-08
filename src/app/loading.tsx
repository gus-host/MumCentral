import Image from "next/image";
import React from "react";

export default function Loading() {
  return (
    <div className="h-dvh w-dvw flex items-center justify-center bg-[#f9f9f9] fixed top-0 left-0">
      <div className="flex items-center gap-2">
        <Image
          src={"/mumCentralLogo.png"}
          alt="Mum central logo"
          width={39}
          height={80}
        />
        <h1 className="text-[#4464ec] font-bold text-[20px]">MumCentral</h1>
      </div>
    </div>
  );
}
