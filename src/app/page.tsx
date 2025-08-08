import { roboto } from "./_partials/fontFamilies";
import { BiSolidClinic } from "react-icons/bi";
import { MdRecommend } from "react-icons/md";
import { FaArrowCircleUp } from "react-icons/fa";
import MapBox from "./_partials/MapBox";
import FacilityListing from "./_partials/FacilityListing";
import { getCurrentPositionPromise } from "@/helper/geo";

export default function Home() {
  let coords, state;

  async function getGeo() {
    try {
      const pos = await getCurrentPositionPromise({
        enableHighAccuracy: true,
        timeout: 15000,
      });
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      coords = { lat, lng };

      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=en`;
      const res = await fetch(url, {
        headers: {
          // Nominatim policy expects an identifiable Referer / User-Agent for heavy usage.
          Referer: window.location.origin,
        },
      });
      if (!res.ok) throw new Error("Reverse geocode failed");
      const data = await res.json(); // includes display_name and address object
      state =
        data?.address?.state ||
        data?.address?.region ||
        data?.address?.state_district;

      console.log("Position object", pos);
    } catch (err) {
      // err?.message || "Failed to get location"
    }
  }
  return (
    <div className="">
      <h1 className={`text-[18px] font-bold ${roboto.className} mb-2`}>
        Facilities
      </h1>
      <p className="text-[14px]">
        Check out healthcare facilities around you and see their time
        availability
      </p>

      <div className="mt-8 bg-white rounded-md px-2 py-3 flex items-center justify-between max-[860px]:flex-col max-[860px]:gap-4 max-[860px]:items-start">
        <ul className="flex items-center gap-8 ">
          <li className="flex items-center gap-1.5 ">
            <div className="bg-[#dae0fb] p-1 rounded max-[420px]:hidden">
              <BiSolidClinic size={30} className="text-[#4464ec]" />
            </div>

            <div className="flex flex-col text-[14px]">
              <strong>4000</strong>
              <span>Total Facilities</span>
            </div>
          </li>

          <li className="flex items-center gap-1.5 ">
            <div className="bg-[#bae4cc] p-1 rounded max-[420px]:hidden">
              <MdRecommend size={30} className="text-[#22a659]" />
            </div>

            <div className="flex flex-col text-[14px]">
              <strong>100</strong>
              <span>facilities in your area</span>
            </div>
          </li>
        </ul>
        <div className="min-[550px]:min-w-[400px] relative max-[550px]:w-full">
          <input
            className="w-full h-[35px] border-2 border-gray-200 rounded-full py-3 pl-3 pr-10 text-[14px] placeholder:text-[14px] focus-visible:border-[#4464ec] focus:outline-0"
            placeholder="Change your location here"
            type="text"
          />
          <button className="bg-transparent border-none" type="submit">
            <FaArrowCircleUp size={20} className="right-3 top-[20%] absolute" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-6 mt-10 gap-x-8 max-[1024px]:gap-y-3">
        <div className="col-span-4 bg-white rounded-2xl max-[1024px]:col-span-6 max-[1024px]:row-start-2 max-[1024px]:row-end-3">
          <MapBox />
        </div>
        {/* Availability listing */}
        <div className="col-span-2 bg-white rounded-2xl px-2 py-4 max-[1024px]:col-span-6 max-[1024px]:row-start-1 max-[1024px]:row-end-2">
          <h2 className={`${roboto.className} text-[18px] font-bold mb-2`}>
            Check out availability of facilities.
          </h2>

          <FacilityListing />
        </div>
      </div>
    </div>
  );
}
