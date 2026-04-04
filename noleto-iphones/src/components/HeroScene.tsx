"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function IPhoneCSSModel() {
  const phoneRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse-driven 3D interaction
  useEffect(() => {
    const container = containerRef.current;
    const phone = phoneRef.current;
    if (!container || !phone) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 20;
      const rotateX = ((centerY - e.clientY) / (rect.height / 2)) * 15;

      gsap.to(phone, {
        rotateY,
        rotateX,
        duration: 0.6,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(phone, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Entrance animation
  useEffect(() => {
    if (!phoneRef.current) return;
    gsap.fromTo(
      phoneRef.current,
      { opacity: 0, scale: 0.7, y: 60 },
      { opacity: 1, scale: 1, y: 0, duration: 1.4, ease: "power3.out", delay: 0.5 }
    );
  }, []);

  // Scroll parallax
  useEffect(() => {
    if (!phoneRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(phoneRef.current, {
        y: -60,
        scrollTrigger: {
          trigger: "#hero-section",
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center"
      style={{ perspective: "1200px" }}
    >
      <div
        ref={phoneRef}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Phone body */}
        <div
          className="relative overflow-hidden rounded-[3rem] shadow-2xl"
          style={{
            width: "260px",
            height: "530px",
            background: "linear-gradient(145deg, #1a1a2e 0%, #0d0d1a 50%, #16213e 100%)",
            border: "3px solid rgba(255,255,255,0.08)",
            boxShadow: "0 30px 80px rgba(59,130,246,0.15), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          {/* Dynamic Island */}
          <div
            className="absolute left-1/2 top-3 z-10 flex -translate-x-1/2 items-center justify-center gap-2 rounded-full bg-black"
            style={{ width: "100px", height: "32px" }}
          >
            <div className="h-3 w-3 rounded-full border border-zinc-700 bg-zinc-800" />
            <div className="h-2 w-2 rounded-full bg-zinc-700" />
          </div>

          {/* Screen */}
          <div className="absolute inset-[6px] overflow-hidden rounded-[2.6rem]">
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 25%, #1e3a5f 50%, #0f172a 75%, #1e1b4b 100%)",
                backgroundSize: "400% 400%",
                animation: "heroScreenGlow 8s ease-in-out infinite",
              }}
            />

            {/* Reflection sweep */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.12) 45%, transparent 55%)",
                animation: "heroScreenShine 5s ease-in-out infinite",
              }}
            />

            {/* Screen UI elements */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
              <div className="h-12 w-12 animate-pulse rounded-2xl border border-blue-400/20 bg-blue-500/20" />
              <div className="h-2.5 w-24 rounded-full bg-white/10" />
              <div className="h-2 w-18 rounded-full bg-white/5" />
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-xl border border-white/5 bg-white/5"
                    style={{
                      animation: `pulse 2s ease-in-out ${i * 0.15}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Side buttons */}
          <div className="absolute right-[-3px] top-[120px] h-[55px] w-[3px] rounded-r-sm bg-zinc-600" />
          <div className="absolute left-[-3px] top-[95px] h-[32px] w-[3px] rounded-l-sm bg-zinc-600" />
          <div className="absolute left-[-3px] top-[140px] h-[55px] w-[3px] rounded-l-sm bg-zinc-600" />
        </div>

        {/* Glow under phone */}
        <div
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-full blur-3xl"
          style={{
            width: "200px",
            height: "60px",
            background: "radial-gradient(ellipse, rgba(59,130,246,0.2) 0%, transparent 70%)",
          }}
        />
      </div>
    </div>
  );
}

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo("#hero-brand", { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 1.2, ease: "power3.out", delay: 0.2 });
      gsap.fromTo("#hero-tagline", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.5 });
      gsap.fromTo("#hero-cta-btn", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.8 });
      gsap.fromTo("#hero-socials", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 1 });

      // Fade out the entire hero content on scroll
      gsap.to("#hero-content", {
        opacity: 0,
        y: -80,
        scale: 0.95,
        scrollTrigger: {
          trigger: "#hero-section",
          start: "5% top",
          end: "25% top",
          scrub: 1,
        },
      });

      textRefs.current.forEach((el) => {
        if (!el) return;
        gsap.fromTo(el, { opacity: 0, y: 60 }, {
          opacity: 1, y: 0,
          scrollTrigger: { trigger: el, start: "top 85%", end: "top 40%", scrub: 1 },
        });
        gsap.to(el, {
          opacity: 0, y: -40,
          scrollTrigger: { trigger: el, start: "top 30%", end: "top 0%", scrub: 1 },
        });
      });

      gsap.fromTo("#hero-cta-bottom", { opacity: 0, y: 40 }, {
        opacity: 1, y: 0,
        scrollTrigger: { trigger: "#hero-cta-bottom", start: "top 90%", end: "top 70%", scrub: 1 },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const features = [
    { title: "Qualidade Certificada", desc: "Todos os produtos passam por verificacao rigorosa de autenticidade e funcionamento." },
    { title: "Melhor Preco", desc: "Negociamos diretamente para oferecer os precos mais competitivos do mercado." },
    { title: "Garantia Total", desc: "Protecao completa em todos os produtos com suporte direto e humanizado." },
  ];

  return (
    <section id="hero-section" ref={containerRef} className="relative min-h-[300vh]" style={{ backgroundColor: "var(--background)" }}>
      {/* Sticky hero */}
      <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute left-0 top-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[150px]" />
          <div className="absolute bottom-1/4 right-0 h-[400px] w-[400px] rounded-full bg-purple-600/8 blur-[120px]" />
        </div>

        {/* Content: Split layout */}
        <div id="hero-content" className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-12 px-6 pt-16 lg:flex-row lg:gap-16 lg:pt-0">
          {/* Left: Text */}
          <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
            <div id="hero-brand" className="opacity-0">
              <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl" style={{ color: "var(--foreground)" }}>
                Noleto
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
                >
                  iPhones
                </span>
              </h1>
            </div>

            <p
              id="hero-tagline"
              className="mt-6 max-w-md text-lg opacity-0 sm:text-xl"
              style={{ color: "var(--muted)" }}
            >
              Tecnologia premium ao seu alcance. Os melhores iPhones e acessorios Apple com garantia e procedencia.
            </p>

            <div id="hero-cta-btn" className="mt-8 flex flex-wrap items-center gap-4 opacity-0">
              <a
                href="#vitrine"
                className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: "var(--accent)",
                  boxShadow: "0 0 30px rgba(59,130,246,0.3)",
                }}
              >
                Ver Produtos
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="/contato"
                className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-medium transition-all duration-300 hover:scale-105"
                style={{
                  border: "1px solid var(--card-border)",
                  color: "var(--foreground)",
                }}
              >
                Fale Conosco
              </a>
            </div>

            {/* Social icons */}
            <div id="hero-socials" className="mt-8 flex items-center gap-4 opacity-0">
              {/* Instagram */}
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 hover:scale-110"
                style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--card-border)" }}
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" style={{ color: "var(--foreground)" }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              {/* WhatsApp */}
              <a
                href="https://wa.me/5500000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 hover:scale-110"
                style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--card-border)" }}
                aria-label="WhatsApp"
              >
                <svg className="h-5 w-5" style={{ color: "var(--foreground)" }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              {/* TikTok */}
              <a
                href="https://tiktok.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 hover:scale-110"
                style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--card-border)" }}
                aria-label="TikTok"
              >
                <svg className="h-5 w-5" style={{ color: "var(--foreground)" }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.17v-3.48a4.85 4.85 0 01-5.58-2.17V6.69h5.58z" />
                </svg>
              </a>
              {/* Facebook */}
              <a
                href="https://facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 hover:scale-110"
                style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--card-border)" }}
                aria-label="Facebook"
              >
                <svg className="h-5 w-5" style={{ color: "var(--foreground)" }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right: Phone */}
          <div className="flex flex-1 items-center justify-center">
            <IPhoneCSSModel />
          </div>
        </div>
      </div>

      {/* Scroll-synced feature texts */}
      <div className="relative z-30 mt-[-50vh]">
        {features.map((feature, i) => (
          <div
            key={i}
            ref={(el) => { textRefs.current[i] = el; }}
            className="flex min-h-[60vh] items-center justify-center px-6"
          >
            <div className="max-w-2xl text-center">
              <h2
                className="text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl"
                style={{ color: "var(--foreground)" }}
              >
                {feature.title}
              </h2>
              <p className="mt-6 text-xl leading-relaxed md:text-2xl" style={{ color: "var(--muted)" }}>
                {feature.desc}
              </p>
            </div>
          </div>
        ))}

        <div id="hero-cta-bottom" className="flex min-h-[40vh] items-center justify-center opacity-0">
          <a
            href="#vitrine"
            className="group relative inline-flex items-center gap-3 rounded-full px-10 py-5 text-lg font-semibold text-white transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: "var(--accent)", boxShadow: "0 0 40px rgba(59,130,246,0.3)" }}
          >
            Ver Produtos
            <svg className="h-5 w-5 transition-transform group-hover:translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
