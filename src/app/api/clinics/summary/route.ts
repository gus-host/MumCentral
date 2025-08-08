// app/api/clinics/by-state/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * NOTE:
 * - This route uses server-side Supabase service role key. Ensure SUPABASE_SERVICE_ROLE_KEY is set in server env.
 * - The STATE_BOUNDS object contains approximate bounding boxes per Nigerian state:
 *   { minLat, minLng, maxLat, maxLng }.
 *
 * Bounding boxes were constructed as coarse state coverage boxes (good for filtering).
 * For production-grade accuracy use state polygons (PostGIS) and ST_Contains checks.
 */

// --- Supabase server client (server-only keys) ---
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables"
  );
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// --- Bounding boxes for Nigerian states (approximate) ---
// Format: minLat, minLng, maxLat, maxLng
// Derived from earlier bounding data (coarse per-state extents).
const STATE_BOUNDS: Record<
  string,
  { minLat: number; minLng: number; maxLat: number; maxLng: number }
> = {
  abia: { minLat: 4.8, maxLat: 5.49, minLng: 7.35, maxLng: 8.01 },
  adamawa: { minLat: 8.65, maxLat: 10.5, minLng: 11.01, maxLng: 13.9 },
  "akwa ibom": { minLat: 4.3, maxLat: 5.24, minLng: 7.43, maxLng: 8.75 },
  anambra: { minLat: 5.5, maxLat: 6.18, minLng: 6.2, maxLng: 7.18 },
  bauchi: { minLat: 9.3, maxLat: 11.0, minLng: 8.2, maxLng: 10.0 },
  bayelsa: { minLat: 4.0, maxLat: 5.0, minLng: 6.0, maxLng: 7.0 },
  benue: { minLat: 6.5, maxLat: 8.5, minLng: 7.2, maxLng: 9.2 },
  borno: { minLat: 10.0, maxLat: 13.0, minLng: 11.5, maxLng: 14.5 },
  "cross river": { minLat: 4.5, maxLat: 6.2, minLng: 8.0, maxLng: 9.5 },
  delta: { minLat: 5.0, maxLat: 6.5, minLng: 5.0, maxLng: 6.5 },
  ebonyi: { minLat: 5.5, maxLat: 6.45, minLng: 7.25, maxLng: 8.1 },
  edo: { minLat: 5.0, maxLat: 6.7, minLng: 5.9, maxLng: 7.0 },
  ekiti: { minLat: 7.2, maxLat: 7.9, minLng: 4.5, maxLng: 5.2 },
  enugu: { minLat: 5.5, maxLat: 7.1, minLng: 6.5, maxLng: 7.9 },
  fct: { minLat: 8.8, maxLat: 9.1, minLng: 7.15, maxLng: 7.5 }, // roughly FCT
  gombe: { minLat: 9.0, maxLat: 11.0, minLng: 9.0, maxLng: 11.0 },
  imo: { minLat: 5.3, maxLat: 6.3, minLng: 6.8, maxLng: 7.6 },
  jigawa: { minLat: 10.3, maxLat: 12.0, minLng: 8.4, maxLng: 10.3 },
  kaduna: { minLat: 9.2, maxLat: 11.0, minLng: 6.0, maxLng: 8.5 },
  kano: { minLat: 11.0, maxLat: 12.5, minLng: 7.0, maxLng: 9.0 },
  katsina: { minLat: 11.0, maxLat: 13.0, minLng: 6.5, maxLng: 8.8 },
  kebbi: { minLat: 10.0, maxLat: 12.0, minLng: 3.3, maxLng: 6.0 },
  kogi: { minLat: 6.5, maxLat: 8.5, minLng: 5.5, maxLng: 7.5 },
  kwara: { minLat: 7.5, maxLat: 9.2, minLng: 3.8, maxLng: 5.3 },
  lagos: { minLat: 6.3, maxLat: 6.75, minLng: 2.7, maxLng: 4.0 },
  nasarawa: { minLat: 7.0, maxLat: 8.5, minLng: 7.0, maxLng: 8.5 },
  niger: { minLat: 8.5, maxLat: 11.5, minLng: 4.5, maxLng: 7.0 },
  ogun: { minLat: 6.0, maxLat: 7.5, minLng: 2.5, maxLng: 4.0 },
  ondo: { minLat: 5.0, maxLat: 7.5, minLng: 4.8, maxLng: 6.5 },
  osun: { minLat: 6.5, maxLat: 8.0, minLng: 4.0, maxLng: 5.7 },
  oyo: { minLat: 7.0, maxLat: 8.5, minLng: 2.5, maxLng: 4.5 },
  plateu: { minLat: 8.0, maxLat: 10.0, minLng: 7.0, maxLng: 9.0 }, // plateau spelled 'plateu' intentionally normalized later
  rivers: { minLat: 4.0, maxLat: 5.5, minLng: 6.0, maxLng: 7.5 },
  sokoto: { minLat: 11.5, maxLat: 13.5, minLng: 3.0, maxLng: 6.0 },
  taraba: { minLat: 6.5, maxLat: 8.5, minLng: 9.0, maxLng: 11.0 },
  yobe: { minLat: 11.0, maxLat: 13.5, minLng: 10.0, maxLng: 12.0 },
  zamfara: { minLat: 11.5, maxLat: 13.0, minLng: 5.5, maxLng: 7.5 },
};

// helper to normalize state key
function normalizeStateKey(s: string) {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^a-z ]/g, "");
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const stateParam = url.searchParams.get("state");
    const limitParam = url.searchParams.get("limit") ?? "1000";
    const offsetParam = url.searchParams.get("offset") ?? "0";

    if (!stateParam) {
      return NextResponse.json(
        { error: 'Missing "state" query parameter. Example: ?state=Enugu' },
        { status: 400 }
      );
    }

    const normalized = normalizeStateKey(stateParam);
    // try some common normalizations (plateau vs plateu, akwa ibom vs akwaibom)
    const altKey = normalized.replace(/\s+/g, " ");

    // Find matching bounds key (case-insensitive & space-insensitive)
    let bounds:
      | { minLat: number; minLng: number; maxLat: number; maxLng: number }
      | undefined;
    let matchedKey: string | undefined;
    for (const k of Object.keys(STATE_BOUNDS)) {
      if (k === normalized || k === altKey) {
        bounds = STATE_BOUNDS[k];
        matchedKey = k;
        break;
      }
    }
    // fallback: search keys that include the normalized word (e.g. "cross river" check)
    if (!bounds) {
      for (const k of Object.keys(STATE_BOUNDS)) {
        if (k.replace(/\s+/g, " ").includes(normalized)) {
          bounds = STATE_BOUNDS[k];
          matchedKey = k;
          break;
        }
      }
    }

    if (!bounds) {
      return NextResponse.json(
        {
          error: `State "${stateParam}" not recognized. Try a standard state name (e.g. Enugu, Lagos, Rivers)`,
          recognized_states: Object.keys(STATE_BOUNDS),
        },
        { status: 400 }
      );
    }

    const limit = Math.min(Math.max(parseInt(limitParam, 10) || 1000, 1), 5000); // cap
    const offset = Math.max(parseInt(offsetParam, 10) || 0, 0);

    // 1) total clinics
    const totalResp = await supabase
      .from("clinics")
      .select("id", { head: true, count: "exact" });
    if (totalResp.error) {
      console.error("Supabase error (total count):", totalResp.error);
      throw totalResp.error;
    }
    const totalClinics = totalResp.count ?? 0;

    // 2) clinics inside bounding box (lat between minLat/maxLat AND lng between minLng/maxLng)
    // Ensure lat/lng non-null
    const { minLat, maxLat, minLng, maxLng } = bounds;
    // Use Supabase PostgREST filters
    const q = supabase
      .from("clinics")
      .select("*", { count: "exact" })
      .gte("lat", minLat)
      .lte("lat", maxLat)
      .gte("lng", minLng)
      .lte("lng", maxLng)
      .not("lat", "is", null)
      .not("lng", "is", null)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    const inStateResp = await q;
    if (inStateResp.error) {
      console.error("Supabase error (in-state):", inStateResp.error);
      throw inStateResp.error;
    }

    const clinicsInState = inStateResp.data ?? [];
    const clinicsCount = (inStateResp.count as number) ?? clinicsInState.length;

    // Build response
    const payload = {
      query: {
        requested_state: stateParam,
        matched_state_key: matchedKey,
        bounds: { minLat, minLng, maxLat, maxLng },
        limit,
        offset,
      },
      totals: {
        total_clinics: totalClinics,
        clinics_in_state_count: clinicsCount,
      },
      clinics: clinicsInState,
    };

    return NextResponse.json(payload, { status: 200 });
  } catch (err: unknown) {
    console.error("API error in /api/clinics/by-state:", err);
    return NextResponse.json(
      {
        error: (err as { message: string })?.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
