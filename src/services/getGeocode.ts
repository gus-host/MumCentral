"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useGeolocation } from "react-use";
import { useGetClinicData } from "./getSummary";

export function useGetGeolocation(center: { lat: number; lng: number }) {
  const [coords, setCoords] = useState({});
  const [state, setState] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const location = useGeolocation();
  const { getSummary, facilityData } = useGetClinicData();

  async function getStateByCenterLatLng() {
    try {
      setIsloading(true);
      if (!center) return;

      const lat = center?.lat;
      const lng = center?.lng;
      console.log(lat, lng);
      setCoords({ lat, lng });

      if (!lng || !lat) return;

      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=en`;
      const res = await fetch(url, {
        headers: {
          // Nominatim policy expects an identifiable Referer / User-Agent for heavy usage.
          Referer: window.location.origin,
        },
      });
      if (!res.ok) throw new Error("Reverse geocode failed");
      const data = await res.json(); // includes display_name and address object
      setState(
        data?.address?.state ||
          data?.address?.region ||
          data?.address?.state_district
      );

      async function summaryGetter() {
        const stateStr =
          data?.address?.state ||
          data?.address?.region ||
          data?.address?.state_district;

        await getSummary(stateStr.toLocaleLowerCase().replace("state", ""));
      }
      summaryGetter();

      console.log("Position object", data);
    } catch (err) {
      toast.error("failed to get your location, using default: Lagos state");
      setCoords({ lat: 6.5243793, lng: 3.3792057 });
      console.log(err);
      // err?.message || "Failed to get location"
    } finally {
      setIsloading(false);
    }
  }

  async function getGeo() {
    try {
      setIsloading(true);
      if (!location) return;

      const lat = center?.lat || location?.latitude;
      const lng = center?.lng || location?.longitude;
      console.log(lat, lng);
      setCoords({ lat, lng });

      if (!lng || !lat) return;

      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=en`;
      const res = await fetch(url, {
        headers: {
          // Nominatim policy expects an identifiable Referer / User-Agent for heavy usage.
          Referer: window.location.origin,
        },
      });
      if (!res.ok) throw new Error("Reverse geocode failed");
      const data = await res.json(); // includes display_name and address object
      setState(
        data?.address?.state ||
          data?.address?.region ||
          data?.address?.state_district
      );
      async function summaryGetter() {
        const stateStr =
          data?.address?.state ||
          data?.address?.region ||
          data?.address?.state_district;

        await getSummary(stateStr.toLocaleLowerCase().replace("state", ""));
      }
      summaryGetter();
    } catch (err) {
      toast.error("failed to get you location, using default: Lagos state");
      setCoords({ lat: 6.5243793, lng: 3.3792057 });
      console.log(err);
      // err?.message || "Failed to get location"
    } finally {
      setIsloading(false);
    }
  }

  useEffect(() => {
    if (state) return;
    getGeo();
  }, [location]);
  useEffect(() => {
    getStateByCenterLatLng();
  }, [center]);

  return { state, coords, getGeo, isLoading, facilityData };
}
