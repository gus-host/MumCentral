"use client";

import { BiSolidClinic } from "react-icons/bi";
import { MdRecommend } from "react-icons/md";
import MapBox from "./MapBox";
import { roboto } from "./fontFamilies";
import FacilityListing from "./FacilityListing";
import { useEffect, useState } from "react";
import StateSearch, { StateItem } from "./StateSearch";
import { Skeleton } from "@mui/material";
import { useGetGeolocation } from "@/services/getGeocode";

export default function MapClient() {
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [value, setValue] = useState<StateItem | null>(() => {
    return null;
  });

  const {
    getGeo,
    isLoading,
    state: geoState,
    facilityData,
  } = useGetGeolocation(center as { lat: number; lng: number });

  console.log(facilityData);

  useEffect(() => {
    getGeo();
  }, []);

  function valueValidate(found: StateItem | null) {
    setValue(found);
  }

  function inValidateValue() {
    setValue(null);
  }

  return (
    <>
      <div className="mt-8 bg-white rounded-md px-2 py-3 flex items-center justify-between max-[860px]:flex-col max-[860px]:gap-4 max-[860px]:items-start">
        <ul className="flex items-center gap-8 ">
          <li className="flex items-center gap-1.5 ">
            <div className="bg-[#dae0fb] p-1 rounded max-[420px]:hidden">
              <BiSolidClinic size={30} className="text-[#4464ec]" />
            </div>

            <div className="flex flex-col text-[14px]">
              {isLoading ? (
                <Skeleton height={20} width={50} />
              ) : (
                <strong>
                  {
                    (facilityData as { totals: { total_clinics: number } })
                      ?.totals?.total_clinics
                  }
                </strong>
              )}
              <span>Total Facilities</span>
            </div>
          </li>

          <li className="flex items-center gap-1.5 ">
            <div className="bg-[#bae4cc] p-1 rounded max-[420px]:hidden">
              <MdRecommend size={30} className="text-[#22a659]" />
            </div>

            <div className="flex flex-col text-[14px]">
              {isLoading ? (
                <Skeleton height={20} width={50} />
              ) : (
                <strong>
                  {
                    (
                      facilityData as {
                        totals: { clinics_in_state_count: number };
                      }
                    )?.totals?.clinics_in_state_count
                  }
                </strong>
              )}

              <span>facilities in your area</span>
            </div>
          </li>
        </ul>
        <div className="min-[550px]:min-w-[400px] relative max-[550px]:w-full">
          <StateSearch
            onSelect={(s) => setCenter({ lat: s.lat, lng: s.lng })}
            valueValidate={valueValidate}
            inValidateValue={inValidateValue}
            value={value}
          />
        </div>
      </div>
      <div className="grid grid-cols-6 mt-10 gap-x-8 max-[1024px]:gap-y-3">
        <div className="col-span-4 bg-white rounded-2xl max-[1024px]:col-span-6 max-[1024px]:row-start-2 max-[1024px]:row-end-3">
          <MapBox center={center} isLoading={isLoading} geoState={geoState} />
        </div>
        {/* Availability listing */}
        <div className="col-span-2 bg-white rounded-2xl px-2 py-4 max-[1024px]:col-span-6 max-[1024px]:row-start-1 max-[1024px]:row-end-2">
          <h2 className={`${roboto.className} text-[18px] font-bold mb-2`}>
            Check out availability of facilities.
          </h2>

          <FacilityListing />
        </div>
      </div>
    </>
  );
}
