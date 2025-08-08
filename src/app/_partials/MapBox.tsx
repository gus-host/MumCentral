"use client";

import dynamic from "next/dynamic";
import React from "react";
import { roboto } from "./fontFamilies";
import { MdLocationOn } from "react-icons/md";
const Map = dynamic(() => import("./MapV1"), {
  ssr: false, // never server-render
});

export default function MapBox() {
  return (
    <div className="px-2 py-5">
      <div className="mb-2 flex justify-between items-center max-[460px]:flex-col max-[460px]:gap-2">
        <h2 className={`${roboto.className} text-[18px] font-bold `}>
          Health facilities around you.
        </h2>
        <div className="flex gap-2 items-center">
          <MdLocationOn size={16} color="#3046a5" />
          <p className="text-[14px] text-gray-600">Nsukka, Enugu.</p>
        </div>
      </div>
      <Map />
    </div>
  );
}
