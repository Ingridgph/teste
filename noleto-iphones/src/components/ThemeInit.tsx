"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";

export default function ThemeInit() {
  const initTheme = useStore((s) => s.initTheme);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return null;
}
