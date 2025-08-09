"use client";

import { BiSolidClinic } from "react-icons/bi";
import { MdRecommend } from "react-icons/md";
import MapBox from "./MapBox";
import { roboto } from "./fontFamilies";
import FacilityListing from "./FacilityListing";
import { useEffect, useState } from "react";
import StateSearch, { StateItem } from "./StateSearch";
import { Skeleton } from "@mui/material";
import { useFacility } from "@/contexts/useFacilities";
import { latLng } from "@/types/clinicData";
import toast from "react-hot-toast";
import { PiWarningCircleLight } from "react-icons/pi";

export default function MapClient() {
  const {
    getGeo,
    loading,
    state: geoState,
    facilityData,
    loadingFacilitData,
  } = useFacility();
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [value, setValue] = useState<StateItem | null>(() => {
    return null;
  });

  console.log(facilityData);

  useEffect(() => {
    if (!loading) return;
    const timeoutId = window.setTimeout(() => {
      setCenter({ lat: 6.5244, lng: 3.3792 }); // Lagos (approx)
      displayToast();
    }, 5000); // 3000 ms = 3 seconds

    return () => {
      clearTimeout(timeoutId); // cleanup on unmount
    };
  }, [loading]); // run once on mount

  useEffect(() => {
    getGeo(center as latLng);
  }, [getGeo, center]);

  function valueValidate(found: StateItem | null) {
    setValue(found);
  }

  function inValidateValue() {
    setValue(null);
  }

  function displayToast() {
    return toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <PiWarningCircleLight className="text-yellow-400" size={24} />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">Warning</p>
                <p className="mt-1 text-sm text-gray-500">
                  We had issues getting your location, so we default to lagos
                  state. You can change this by searching your state in Nigerian
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Close
            </button>
          </div>
        </div>
      ),
      { position: "bottom-right" }
    );
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
              {loading || loadingFacilitData ? (
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
              {loading || loadingFacilitData ? (
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
          <MapBox center={center} isLoading={loading} geoState={geoState} />
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
