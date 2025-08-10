export interface clinicData {
  clinics: { icon: string; name: string }[];
}

export interface latLng {
  lat: number;
  lng: number;
}

export interface facilityData {
  totals: { total_clinics: number; clinics_in_state_count: number };
}

// export interface OpenstreetData {
//   state: string
//   region: string
//   data?.address?.state_district;
// }
