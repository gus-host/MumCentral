// utils/geo.ts
export function getCurrentPositionPromise(options?: PositionOptions) {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}
