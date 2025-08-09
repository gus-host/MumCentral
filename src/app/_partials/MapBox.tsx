"use client";

import dynamic from "next/dynamic";
import React from "react";
import { roboto } from "./fontFamilies";
import { MdLocationOn } from "react-icons/md";
import Spinner from "@/components/Spinner";
import { Skeleton } from "@mui/material";
import { useFacility } from "@/contexts/useFacilities";
const Map = dynamic(() => import("./MapV1"), {
  ssr: false, // never server-render
});

export default function MapBox({
  center,
  isLoading,
  geoState,
}: {
  center: { lat: number; lng: number } | null;
  isLoading: boolean;
  geoState: string;
}) {
  const { coords, loadingState } = useFacility();

  return (
    <div className="px-2 py-5">
      <div className="mb-2 flex justify-between items-center max-[460px]:flex-col max-[460px]:gap-2">
        <h2 className={`${roboto.className} text-[18px] font-bold `}>
          Health facilities around you.
        </h2>
        <div className="flex gap-2 items-center">
          <MdLocationOn size={16} color="#3046a5" />
          {loadingState ? (
            <Skeleton height={20} width={100} />
          ) : (
            <p className="text-[14px] text-gray-600">{geoState}</p>
          )}
        </div>
      </div>
      {isLoading ? (
        <div className="h-[500px] w-full flex items-center justify-center">
          <Spinner size={20} strokeWidth={2} />
        </div>
      ) : (
        <Map
          latLng={
            center || {
              lat: coords?.lat as number,
              lng: coords?.lng as number,
            }
          }
        />
      )}
    </div>
  );
}
