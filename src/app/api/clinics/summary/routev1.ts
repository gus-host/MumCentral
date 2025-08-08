// app/api/clinics/summary/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!; // server-only

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// Helper: reverse geocode using Nominatim (OpenStreetMap)
async function reverseGeocodeNominatim(lat: number, lng: number) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
    lat
  )}&lon=${encodeURIComponent(lng)}&accept-language=en`;
  const res = await fetch(url, {
    headers: {
      // Nominatim asks for contact info for heavier usage; include Referer
      Referer:
        typeof process !== "undefined"
          ? process.env.NOMINATIM_REFERER || ""
          : "",
    },
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Reverse geocode failed: ${res.status} ${txt}`);
  }
  const json = await res.json();
  // Nominatim returns json.address.state for many countries; fallback to county/region
  const addr = json?.address || {};
  return {
    display_name: json?.display_name || null,
    state:
      addr.state || addr.region || addr.county || addr.state_district || null,
    raw: json,
  };
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const latParam = url.searchParams.get("lat");
    const lngParam = url.searchParams.get("lng");

    if (!latParam || !lngParam) {
      return NextResponse.json(
        { error: "Missing lat and lng query parameters" },
        { status: 400 }
      );
    }

    const lat = Number(latParam);
    const lng = Number(lngParam);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return NextResponse.json(
        { error: "Invalid lat or lng" },
        { status: 400 }
      );
    }

    // 1) Reverse-geocode to get state name
    let geocodeResult = {
      display_name: null as string | null,
      state: null as string | null,
      raw: null as unknown,
    };
    try {
      geocodeResult = await reverseGeocodeNominatim(lat, lng);
    } catch (err: unknown) {
      // don't fail hard if reverse geocode fails - return partial result later
      console.warn(
        "Reverse geocode failed:",
        (err as { message: string })?.message || err
      );
    }

    const stateName = geocodeResult.state
      ? String(geocodeResult.state).trim()
      : null;

    // 2) Query Supabase: total clinics (count)
    // Use HEAD with count option to only receive count (fast).
    const totalResp = await supabase
      .from("clinics")
      .select("id", { head: true, count: "exact" });
    if (totalResp.error) throw totalResp.error;
    const totalClinics = totalResp.count ?? 0;

    // 3) Get clinics count in the same state:
    // Strategy:
    //   - If there is a 'state' column, try to count using exact match on that column.
    //   - If that yields zero (or no such column), fall back to searching the 'address' column with ILIKE '%stateName%'.
    let stateClinicCount = 0;
    let usedStrategy = "none";

    if (stateName) {
      // Attempt 1: exact match on 'state' column
      const attempt1 = await supabase
        .from("clinics")
        .select("id", { head: true, count: "exact" })
        .eq("state", stateName);

      if (
        !attempt1.error &&
        typeof attempt1.count === "number" &&
        attempt1.count > 0
      ) {
        stateClinicCount = attempt1.count;
        usedStrategy = "state_column_exact_match";
      } else {
        // Attempt 2: case-insensitive search in `state` column (some records may have 'Enugu State' vs 'Enugu')
        const attempt2 = await supabase
          .from("clinics")
          .select("id", { head: true, count: "exact" })
          .ilike("state", `%${stateName}%`);
        if (
          !attempt2.error &&
          typeof attempt2.count === "number" &&
          attempt2.count > 0
        ) {
          stateClinicCount = attempt2.count;
          usedStrategy = "state_column_ilike";
        } else {
          // Attempt 3: fall back to address ILIKE '%stateName%'
          const attempt3 = await supabase
            .from("clinics")
            .select("id", { head: true, count: "exact" })
            .ilike("address", `%${stateName}%`);
          if (!attempt3.error && typeof attempt3.count === "number") {
            stateClinicCount = attempt3.count;
            usedStrategy = "address_ilike";
          } else {
            // If everything fails, leave 0 and note the failure
            usedStrategy = "fallback_failed_or_no_state_found";
          }
        }
      }
    } else {
      usedStrategy = "no_state_from_geocode";
    }

    // 4) Also count clinics that have lat & lng non-null for that state (optional)
    // If desired: count clinics with non-null lat & lng and address/state matching above.
    // We'll query the same filters but add .not('lat', 'is', null).not('lng', 'is', null)
    let stateClinicWithLatLngCount = 0;
    try {
      if (
        stateName &&
        (usedStrategy === "state_column_exact_match" ||
          usedStrategy === "state_column_ilike")
      ) {
        // use the state column filter
        const q =
          usedStrategy === "state_column_exact_match"
            ? supabase
                .from("clinics")
                .select("id", { head: true, count: "exact" })
                .eq("state", stateName)
            : supabase
                .from("clinics")
                .select("id", { head: true, count: "exact" })
                .ilike("state", `%${stateName}%`);

        const filtered = await q.not("lat", "is", null).not("lng", "is", null);
        if (!filtered.error && typeof filtered.count === "number")
          stateClinicWithLatLngCount = filtered.count;
      } else if (stateName && usedStrategy === "address_ilike") {
        const filtered = await supabase
          .from("clinics")
          .select("id", { head: true, count: "exact" })
          .ilike("address", `%${stateName}%`)
          .not("lat", "is", null)
          .not("lng", "is", null);
        if (!filtered.error && typeof filtered.count === "number")
          stateClinicWithLatLngCount = filtered.count;
      } else {
        // If no stateName or fallback fail, just count ALL clinics with lat/lng (not state-scoped)
        const allWithCoords = await supabase
          .from("clinics")
          .select("id", { head: true, count: "exact" })
          .not("lat", "is", null)
          .not("lng", "is", null);
        if (!allWithCoords.error && typeof allWithCoords.count === "number") {
          stateClinicWithLatLngCount = 0; // leave zero because we couldn't determine state
        }
      }
    } catch (err) {
      console.warn("Counting clinics with lat/lng failed:", err);
    }

    // Build response
    const payload = {
      total_clinics: totalClinics,
      state_lookup: {
        input_lat: lat,
        input_lng: lng,
        state: stateName,
        display_name: geocodeResult.display_name,
        used_strategy: usedStrategy,
      },
      state_clinic_count: stateClinicCount,
      state_clinic_with_latlng_count: stateClinicWithLatLngCount,
    };

    return NextResponse.json(payload, { status: 200 });
  } catch (err: unknown) {
    console.error("API error", err);
    return NextResponse.json(
      {
        error: (err as { message: string })?.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
