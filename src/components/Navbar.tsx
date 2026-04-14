"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useStore } from "@/store/useStore";

export default function Navbar() {
  const { theme, toggleTheme } = useStore();
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  // Entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(navRef.current, { y: -80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.1 });
      if (logoRef.current) {
        gsap.fromTo(logoRef.current, { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.4 });
      }
      if (linksRef.current) {
        gsap.fromTo(linksRef.current.children, { y: -15, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: "power3.out", delay: 0.5 });
      }
      if (actionsRef.current) {
        gsap.fromTo(actionsRef.current, { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.6 });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed left-0 right-0 top-0 z-50"
      style={{
        backgroundColor: "color-mix(in srgb, var(--background) 70%, transparent)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid color-mix(in srgb, var(--card-border) 50%, transparent)",
      }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <a ref={logoRef} href="/" className="flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg transition-transform duration-300 hover:scale-110 hover:rotate-6"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <span className="text-sm font-bold text-white">N</span>
          </div>
          <span className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
            Noleto{" "}
            <span style={{ color: "var(--accent)" }}>iPhones</span>
          </span>
        </a>

        {/* Nav Links - Desktop */}
        <div ref={linksRef} className="hidden items-center gap-8 md:flex">
          <a href="/#hero-section" className="text-sm transition-all duration-200 hover:opacity-70 hover:translate-y-[-1px]" style={{ color: "var(--muted)" }}>
            Inicio
          </a>
          <a href="/#vitrine" className="text-sm transition-all duration-200 hover:opacity-70 hover:translate-y-[-1px]" style={{ color: "var(--muted)" }}>
            Produtos
          </a>
          <a href="/contato" className="text-sm transition-all duration-200 hover:opacity-70 hover:translate-y-[-1px]" style={{ color: "var(--muted)" }}>
            Contato
          </a>
        </div>

        {/* Actions */}
        <div ref={actionsRef} className="flex items-center gap-2">
          {/* Social icons - compact */}
          <div className="hidden items-center gap-1 sm:flex">
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 hover:opacity-70 hover:scale-110"
              style={{ color: "var(--muted)" }}
              aria-label="Instagram"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
            </a>
            <a
              href="https://wa.me/5500000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 hover:opacity-70 hover:scale-110"
              style={{ color: "var(--muted)" }}
              aria-label="WhatsApp"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            </a>
            <a
              href="https://tiktok.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 hover:opacity-70 hover:scale-110"
              style={{ color: "var(--muted)" }}
              aria-label="TikTok"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.17v-3.48a4.85 4.85 0 01-5.58-2.17V6.69h5.58z" /></svg>
            </a>
          </div>

          {/* Divider */}
          <div className="hidden h-6 w-px sm:block" style={{ backgroundColor: "var(--card-border)" }} />

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:opacity-70 hover:rotate-180"
            style={{ color: "var(--muted)" }}
            aria-label="Alternar tema"
          >
            {theme === "dark" ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Contact button */}
          <a
            href="/contato"
            className="flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{
              backgroundColor: "var(--accent)",
              color: "#ffffff",
              boxShadow: "0 2px 10px var(--accent-glow)",
            }}
          >
            Contato
          </a>
        </div>
      </div>
    </nav>
  );
}
