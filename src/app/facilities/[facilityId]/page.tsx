import { AvailabilityCalendar } from "@/app/_partials/AvailabilityCalendar";
import { roboto } from "@/app/_partials/fontFamilies";
import Link from "next/link";
import React from "react";
import { BiClinic } from "react-icons/bi";
import { CgWebsite } from "react-icons/cg";
import { FaRegAddressBook } from "react-icons/fa";
import { IoIosPhonePortrait } from "react-icons/io";
import { FiExternalLink } from "react-icons/fi";
import FacilityListing from "@/app/_partials/FacilityListing";
import ModalBtn from "@/app/_partials/ModalBtn";

export default function page() {
  const availability = [
    "Monday: 8:00 AM – 5:00 PM",
    "Tuesday: 8:00 AM – 5:00 PM",
    "Wednesday: 8:00 AM – 5:00 PM",
    "Thursday: 8:00 AM – 5:00 PM",
    "Friday: 8:00 AM – 5:00 PM",
    "Saturday: 8:00 AM – 5:00 PM",
    "Sunday: Closed",
  ];

  // Parent component

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-bold text-[20px]">Facility Availability</h2>
        <ModalBtn />
      </div>
      <div className="grid grid-cols-7 gap-x-5 gap-y-4">
        <div className="h-[500px] overflow-y-auto hide-scrollbar col-span-5 bg-white rounded-lg px-2 py-4 max-[1024px]:col-span-7">
          <AvailabilityCalendar availability={availability} />
        </div>
        <div className="col-span-2 max-[1024px]:col-span-7">
          <div className=" bg-white px-2 py-4 rounded-lg self-start mb-3">
            <h2 className={`${roboto.className} text-[18px] font-bold mb-2`}>
              Facility details
            </h2>

            <ul className="flex flex-col gap-3">
              <li className="text-[12px] text-gray-700 flex items-center gap-2">
                <BiClinic className="text-[#4464ec]" size={20} />
                <span>Primary Health Care Birnin Yari</span>
              </li>
              <li className="text-[12px] text-gray-700 flex items-center gap-2">
                <FaRegAddressBook className="text-[#4464ec]" size={20} />
                <span>
                  No 7 Agoanago street, Ojo, Lagos 102101, Lagos, Nigeria
                </span>
              </li>
              <li className="text-[12px] text-gray-700 flex items-center gap-2">
                <IoIosPhonePortrait className="text-[#4464ec]" size={20} />
                <span>0700 063 2873</span>
              </li>
              <li className="text-[12px] text-gray-700 flex items-center gap-2">
                <CgWebsite className="text-[#4464ec]" size={20} />
                <Link
                  href={"http://www.portharcourt.com/"}
                  className="flex gap-1 items-center font-semibold underline"
                >
                  View website <FiExternalLink />
                </Link>
              </li>
            </ul>
          </div>
          <div className="bg-white px-2 py-4 rounded-lg h-[700px]">
            <h2 className={`${roboto.className} text-[18px] font-bold mb-2`}>
              Other facilities in your area
              <FacilityListing />
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
