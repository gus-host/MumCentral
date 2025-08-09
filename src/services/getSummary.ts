"use client";
import { facilityData } from "@/types/clinicData";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";

export function useGetClinicData() {
  const [facilityData, setFacilityData] = useState<facilityData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getSummary = useCallback(async function (state: string) {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/clinics/summary?state=${state}`);
      const data = await response.json();
      setFacilityData(data);
    } catch (err) {
      toast.error("Failed to load facilities");
      throw new Error(
        (err as { message: string }).message || "An error occured: "
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { getSummary, isLoading, facilityData };
}
