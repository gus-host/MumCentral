"use client";

import { useEffect, useState } from "react";
import { useWindowSize } from "react-use";

export default function useResponsiveSizes() {
  const { height, width } = useWindowSize();
  const [clientHeight, setClientHeight] = useState<number | null>(null);
  const [clientWidth, setClientWidth] = useState<number | null>(null);

  // Set height only after mounting to avoid hydration errors
  useEffect(() => {
    setClientHeight(height);
    setClientWidth(width);
  }, [height, width]);
  return { clientHeight, clientWidth };
}
