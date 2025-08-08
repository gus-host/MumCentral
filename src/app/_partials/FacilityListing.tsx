import Image from "next/image";
import React from "react";
import { FaArrowRight } from "react-icons/fa";

export default function FacilityListing() {
  return (
    <ul>
      <li className="px-1 py-2 border-l-2 border-l-yellow-400 overflow-hidden shadow-sm rounded-lg relative">
        <div className="flex gap-2 mb-1">
          <div>
            <Image
              src={
                "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/hospital-71.png"
              }
              width={71 * 0.5}
              height={71 * 0.5}
              alt="Me Cure Healthcare Limited icon"
            />
          </div>

          <div>
            <h3 className="font-medium text-[14px]">
              Me Cure Healthcare Limited
            </h3>
            <p className="text-[10px] text-gray-500">
              19 Folarin St, Mushin, Lagos 102215, Lagos, Nigeria
            </p>
          </div>
        </div>
        <span className="inline-block px-2 py2 border-1 border-yellow-500 rounded-full text-[10px] absolute top-1 right-1">
          clinic
        </span>
        <div className="flex justify-end">
          <button className="bg-[#4464ec] border-none px-2 py-1 rounded-sm text-white text-[10px] cursor-pointer hover:bg-[#3046a5] flex gap-1 items-center">
            <span>View Slots</span>
            <FaArrowRight className={"text-[#fff"} size={10} />
          </button>
        </div>
      </li>
    </ul>
  );
}
