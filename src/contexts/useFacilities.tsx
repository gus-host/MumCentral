"use client";

import { NIGERIA_STATES } from "@/app/_partials/StateSearch";
// auth-context.tsx
import { useGetClinicData } from "@/services/getSummary";
import { facilityData, latLng } from "@/types/clinicData";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import toast from "react-hot-toast";
import { useGeolocation } from "react-use";

interface FacilityContextValue {
  coords: latLng | null;
  loading: boolean;
  state: string;
  facilityData: facilityData | null;
  loadingFacilitData: boolean;
  loadingState: boolean;
  getGeo: (center: latLng) => Promise<void>;
}

// Create context with undefined to force consumer checks
const FacilityContext = createContext<FacilityContextValue | undefined>(
  undefined
);

export const FacilityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [coords, setCoords] = useState<latLng | null>(null);
  const [state, setState] = useState("");
  const location = useGeolocation();
  const {
    getSummary,
    facilityData,
    isLoading: loadingFacilitData,
  } = useGetClinicData();
  const loading = location.loading && !facilityData;
  const [loadingState, setLoadingState] = useState(false);
  const hasGottenGeoLoc = useRef<boolean | null>(null);
  const summaryGetter = useCallback(
    async function summaryGetter(str: string) {
      await getSummary(
        str?.toLocaleLowerCase().replace("state", "").replaceAll("%20", " ")
      );
    },
    [getSummary]
  );

  useEffect(() => {
    if (!state) return;
    summaryGetter(state);
  }, [state, summaryGetter]);

  const getGeo = useCallback(
    async function getGeo(center: latLng) {
      try {
        if (location.loading && !center) return;
        console.log(location);

        const lat = center?.lat || location?.latitude;
        const lng = center?.lng || location?.longitude;
        console.log(lat, lng);
        setCoords({ lat: lat as number, lng: lng as number });

        if (!lng || !lat) return;

        if (!center?.lat && !center?.lng && !hasGottenGeoLoc.current) {
          const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=en`;
          setLoadingState(true);
          const res = await fetch(url, {
            headers: {
              // Nominatim policy expects an identifiable Referer / User-Agent for heavy usage.
              Referer: window.location.origin,
            },
          });
          if (!res.ok) throw new Error("Reverse geocode failed");
          const data = await res.json(); // includes display_name and address object
          console.log(data);
          setState(
            data?.address?.state ||
              data?.address?.region ||
              data?.address?.state_district
          );
          setLoadingState(false);
        } else {
          const state = NIGERIA_STATES.find(
            (ns) => ns.lat === lat || ns.lng === lng
          )?.name;
          setState(state as string);
        }
        hasGottenGeoLoc.current = true;
      } catch (err) {
        toast.error("failed to get you location, using default: Lagos state");
        setCoords({ lat: 6.5243793, lng: 3.3792057 });
        console.log(err);
        // err?.message || "Failed to get location"
      } finally {
        setLoadingState(false);
      }
    },
    [location]
  );

  return (
    <FacilityContext.Provider
      value={{
        coords,
        state,
        facilityData,
        loadingState,
        loadingFacilitData,
        loading,
        getGeo,
      }}
    >
      {children}
    </FacilityContext.Provider>
  );
};

// custom hook that throws if used outside provider
export function useFacility(): FacilityContextValue {
  const ctx = useContext(FacilityContext);
  if (!ctx)
    throw new Error("useFacility must be used within a FacilityProvider");
  return ctx;
}
