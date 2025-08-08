import { roboto } from "./_partials/fontFamilies";
import MapClient from "./_partials/MapClient";

export default function Home() {
  return (
    <div className="">
      <h1 className={`text-[18px] font-bold ${roboto.className} mb-2`}>
        Facilities
      </h1>
      <p className="text-[14px]">
        Check out healthcare facilities around you and see their time
        availability
      </p>

      <MapClient />
    </div>
  );
}
