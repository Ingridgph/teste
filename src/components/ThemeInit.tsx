"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useStore } from "@/store/useStore";

gsap.registerPlugin(ScrollTrigger);

export default function ThemeInit() {
  const initTheme = useStore((s) => s.initTheme);

  // Inicializa o tema salvo antes da primeira pintura
  useEffect(() => {
    initTheme();
  }, [initTheme]);

  // Inicializa o scroll suave com Lenis + sincroniza com GSAP ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const ticker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    const timeout = setTimeout(() => ScrollTrigger.refresh(), 300);

    return () => {
      clearTimeout(timeout);
      lenis.destroy();
      gsap.ticker.remove(ticker);
    };
  }, []);

  return null;
}
