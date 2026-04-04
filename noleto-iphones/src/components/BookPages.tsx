"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── iPhone 3D mouse-tracking (hidden on <500px) ─── */
function IPhoneModel() {
  const phoneRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const phone = phoneRef.current;
    if (!wrap || !phone) return;

    const move = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      const rY = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 18;
      const rX = ((r.top + r.height / 2 - e.clientY) / (r.height / 2)) * 12;
      gsap.to(phone, { rotateY: rY, rotateX: rX, duration: 0.5, ease: "power2.out" });
    };
    const leave = () => {
      gsap.to(phone, { rotateY: 0, rotateX: 0, duration: 0.8, ease: "elastic.out(1,0.5)" });
    };

    window.addEventListener("mousemove", move);
    wrap.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      wrap.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div ref={wrapRef} className="flex items-center justify-center" style={{ perspective: "1200px" }}>
      <div ref={phoneRef} className="relative" style={{ transformStyle: "preserve-3d" }}>
        <div
          className="relative overflow-hidden rounded-[3rem]"
          style={{
            width: "220px",
            height: "460px",
            background: "linear-gradient(145deg,#1a1a2e,#0d0d1a 50%,#16213e)",
            border: "3px solid rgba(255,255,255,0.08)",
            boxShadow: "0 40px 100px var(--accent-glow), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          <div className="absolute left-1/2 top-3 z-10 flex h-8 w-[90px] -translate-x-1/2 items-center justify-center gap-2 rounded-full bg-black">
            <div className="h-3 w-3 rounded-full border border-zinc-700 bg-zinc-800" />
            <div className="h-2 w-2 rounded-full bg-zinc-700" />
          </div>
          <div className="absolute inset-[6px] overflow-hidden rounded-[2.6rem]">
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,#0c1929,#122a40 25%,#0f3651 50%,#0c1929 75%,#122a40)", backgroundSize: "400% 400%", animation: "heroScreenGlow 8s ease-in-out infinite" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(105deg,transparent 30%,rgba(255,255,255,0.12) 45%,transparent 55%)", animation: "heroScreenShine 5s ease-in-out infinite" }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
              <div className="h-11 w-11 animate-pulse rounded-2xl border border-[#2596be]/30 bg-[#2596be]/20" />
              <div className="h-2 w-20 rounded-full bg-white/10" />
              <div className="h-2 w-14 rounded-full bg-white/5" />
              <div className="mt-3 grid grid-cols-3 gap-2.5">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="h-9 w-9 rounded-xl border border-white/5 bg-white/5" />
                ))}
              </div>
            </div>
          </div>
          <div className="absolute right-[-3px] top-[110px] h-[50px] w-[3px] rounded-r-sm bg-zinc-600" />
          <div className="absolute left-[-3px] top-[90px] h-[28px] w-[3px] rounded-l-sm bg-zinc-600" />
          <div className="absolute left-[-3px] top-[130px] h-[50px] w-[3px] rounded-l-sm bg-zinc-600" />
        </div>
        <div className="absolute -bottom-6 left-1/2 h-14 w-44 -translate-x-1/2 rounded-full blur-3xl" style={{ backgroundColor: "var(--accent-glow)" }} />
      </div>
    </div>
  );
}

/* ─── Social icon ─── */
function SocialIcon({ href, label, d }: { href: string; label: string; d: string }) {
  return (
    <a
      href={href} target="_blank" rel="noopener noreferrer"
      className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 hover:scale-110"
      style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--card-border)" }}
      aria-label={label}
    >
      <svg className="h-[18px] w-[18px]" style={{ color: "var(--foreground)" }} fill="currentColor" viewBox="0 0 24 24"><path d={d} /></svg>
    </a>
  );
}

const socials = [
  { href: "https://instagram.com/", label: "Instagram", d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
  { href: "https://wa.me/5500000000000", label: "WhatsApp", d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" },
  { href: "https://tiktok.com/", label: "TikTok", d: "M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.17v-3.48a4.85 4.85 0 01-5.58-2.17V6.69h5.58z" },
  { href: "https://facebook.com/", label: "Facebook", d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
];

const featureIcons = [
  "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
  "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  "M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z",
];

/* ─── Main component ─── */
export default function BookPages() {
  const [isMobile, setIsMobile] = useState(false);
  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 500);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Simple entrance animations (no pin, no overlap)
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Page 1 entrance
      if (page1Ref.current) {
        const els = page1Ref.current.querySelectorAll(".anim");
        gsap.fromTo(els, { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.9, ease: "power3.out", delay: 0.2 });
      }

      // Page 2 scroll-triggered entrance
      if (page2Ref.current) {
        const els = page2Ref.current.querySelectorAll(".anim");
        gsap.fromTo(els, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: page2Ref.current, start: "top 75%", toggleActions: "play none none none" },
        });
      }
    });
    return () => ctx.revert();
  }, []);

  const features = [
    { title: "Qualidade Certificada", desc: "Verificacao rigorosa de autenticidade e funcionamento em cada produto." },
    { title: "Melhor Preco", desc: "Negociacao direta para garantir os precos mais competitivos do mercado." },
    { title: "Garantia Total", desc: "Protecao completa com suporte direto e humanizado." },
  ];

  return (
    <div id="hero-section">
      {/* ═══ PAGE 1: Hero ═══ */}
      <section
        ref={page1Ref}
        className="relative flex min-h-screen items-center overflow-hidden"
        style={{ backgroundColor: "var(--background)" }}
      >
        {/* BG */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-10%] top-[15%] h-[400px] w-[400px] rounded-full blur-[150px]" style={{ backgroundColor: "var(--accent-soft)" }} />
          <div className="absolute bottom-[10%] right-[-5%] h-[350px] w-[350px] rounded-full opacity-50 blur-[120px]" style={{ backgroundColor: "var(--accent-soft)" }} />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-10 px-6 py-28 lg:flex-row lg:gap-20 lg:py-0">
          {/* Left: Text */}
          <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
            <h1 className="anim text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl" style={{ color: "var(--foreground)" }}>
              Noleto
              <br />
              <span style={{ color: "var(--accent)" }}>iPhones</span>
            </h1>

            <p className="anim mt-6 max-w-md text-base leading-relaxed sm:text-lg" style={{ color: "var(--muted)" }}>
              Tecnologia premium ao seu alcance. Os melhores iPhones e acessorios Apple com garantia e procedencia.
            </p>

            <div className="anim mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#vitrine"
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 sm:px-8 sm:py-4 sm:text-base"
                style={{ backgroundColor: "var(--accent)", boxShadow: "0 0 30px var(--accent-glow)" }}
              >
                Ver Produtos
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="/contato"
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium transition-all duration-300 hover:scale-105 sm:px-8 sm:py-4 sm:text-base"
                style={{ border: "1px solid var(--card-border)", color: "var(--foreground)" }}
              >
                Fale Conosco
              </a>
            </div>

            <div className="anim mt-6 flex items-center gap-3">
              {socials.map((s) => <SocialIcon key={s.label} {...s} />)}
            </div>
          </div>

          {/* Right: Phone (hidden on mobile < 500px) */}
          {!isMobile && (
            <div className="anim flex flex-1 items-center justify-center">
              <IPhoneModel />
            </div>
          )}
        </div>
      </section>

      {/* ═══ PAGE 2: Features ═══ */}
      <section
        ref={page2Ref}
        className="relative flex min-h-screen items-center overflow-hidden"
        style={{ backgroundColor: "var(--background)" }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-[5%] top-[20%] h-[350px] w-[350px] rounded-full opacity-50 blur-[140px]" style={{ backgroundColor: "var(--accent-soft)" }} />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-20">
          <h2 className="anim text-center text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl" style={{ color: "var(--foreground)" }}>
            Por que escolher a{" "}
            <span style={{ color: "var(--accent)" }}>Noleto iPhones</span>?
          </h2>

          <div className="anim mt-12 grid gap-5 sm:mt-14 sm:grid-cols-3 sm:gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-4 rounded-2xl p-6 text-center transition-all duration-300 hover:scale-[1.03] sm:p-8"
                style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--card-border)" }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl sm:h-14 sm:w-14" style={{ backgroundColor: "var(--accent-soft)" }}>
                  <svg className="h-6 w-6 sm:h-7 sm:w-7" style={{ color: "var(--accent)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={featureIcons[i]} />
                  </svg>
                </div>
                <h3 className="text-base font-bold sm:text-lg" style={{ color: "var(--foreground)" }}>{f.title}</h3>
                <p className="text-xs leading-relaxed sm:text-sm" style={{ color: "var(--muted)" }}>{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="anim mt-10 flex justify-center sm:mt-12">
            <a
              href="#vitrine"
              className="group inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 sm:text-base"
              style={{ backgroundColor: "var(--accent)", boxShadow: "0 0 30px var(--accent-glow)" }}
            >
              Explorar Produtos
              <svg className="h-5 w-5 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
