"use client";

import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useStore } from "@/store/useStore";
import { categories } from "@/data/products";
import Link from "next/link";
import type { Product } from "@/store/useStore";

gsap.registerPlugin(ScrollTrigger);

/* ─── Product Card ─── */
function ProductCard({
  product,
  isCenter,
  onInteract,
}: {
  product: Product;
  isCenter: boolean;
  onInteract: (paused: boolean) => void;
}) {
  const addToCart = useStore((s) => s.addToCart);
  const decrementFromCart = useStore((s) => s.decrementFromCart);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const cart = useStore((s) => s.cart);
  const cardRef = useRef<HTMLDivElement>(null);
  const inCart = cart.find((item) => item.product.id === product.id);

  const handleAdd = () => {
    addToCart(product);
    onInteract(true);
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { scale: 0.95 },
        { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" }
      );
    }
  };

  const handleDecrement = () => {
    decrementFromCart(product.id);
    const existing = cart.find((item) => item.product.id === product.id);
    if (existing && existing.quantity <= 1) onInteract(false);
  };

  const handleRemove = () => {
    removeFromCart(product.id);
    onInteract(false);
  };

  return (
    <div
      ref={cardRef}
      className="relative flex shrink-0 flex-col overflow-hidden rounded-2xl border transition-all duration-500"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: isCenter ? "var(--accent)" : "var(--card-border)",
        boxShadow: isCenter ? "0 8px 40px var(--accent-glow)" : "none",
        width: "280px",
      }}
    >
      {product.badge && (
        <span
          className="absolute left-3 top-3 z-10 rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white"
          style={{ backgroundColor: "var(--accent)" }}
        >
          {product.badge}
        </span>
      )}

      <div className="relative flex items-center justify-center px-5 py-8">
        <div
          className="flex h-24 w-24 items-center justify-center rounded-2xl border transition-transform duration-500"
          style={{
            background:
              "linear-gradient(135deg, var(--accent-soft), rgba(37,150,190,0.15))",
            borderColor: "rgba(255,255,255,0.05)",
            transform: isCenter ? "scale(1.1)" : "scale(1)",
          }}
        >
          <span
            className="text-3xl font-bold"
            style={{ color: "var(--accent)", opacity: 0.4 }}
          >
            {product.name.charAt(0)}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 px-5 pb-5">
        <h3
          className="truncate text-sm font-semibold"
          style={{ color: "var(--foreground)" }}
        >
          {product.name}
        </h3>
        <p className="truncate text-xs" style={{ color: "var(--muted)" }}>
          {product.description}
        </p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span
            className="text-base font-bold"
            style={{ color: "var(--foreground)" }}
          >
            R${product.price.toLocaleString("pt-BR")}
          </span>

          {inCart ? (
            <div className="flex items-center gap-1">
              <button
                onClick={handleDecrement}
                className="flex h-7 w-7 items-center justify-center rounded-lg transition-all hover:scale-110"
                style={{
                  backgroundColor: "rgba(239,68,68,0.1)",
                  color: "#ef4444",
                  border: "1px solid rgba(239,68,68,0.3)",
                }}
                aria-label="Diminuir quantidade"
              >
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20 12H4"
                  />
                </svg>
              </button>
              <span
                className="w-5 text-center text-xs font-bold"
                style={{ color: "var(--foreground)" }}
              >
                {inCart.quantity}
              </span>
              <button
                onClick={handleAdd}
                className="flex h-7 w-7 items-center justify-center rounded-lg transition-all hover:scale-110"
                style={{
                  backgroundColor: "rgba(34,197,94,0.1)",
                  color: "#22c55e",
                  border: "1px solid rgba(34,197,94,0.3)",
                }}
                aria-label="Aumentar quantidade"
              >
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
              <button
                onClick={handleRemove}
                className="ml-1 flex h-7 w-7 items-center justify-center rounded-lg transition-all hover:scale-110"
                style={{
                  backgroundColor: "rgba(239,68,68,0.1)",
                  color: "#ef4444",
                  border: "1px solid rgba(239,68,68,0.3)",
                }}
                aria-label="Remover do carrinho"
              >
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className="flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 hover:scale-105"
              style={{ backgroundColor: "var(--accent)", color: "#fff" }}
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Pedir
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Single Figma-style Carousel ─── */
function SingleCarousel({ items }: { items: Product[] }) {
  const [centerIndex, setCenterIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = items.length;
  const cart = useStore((s) => s.cart);

  const hasCartItem = useMemo(
    () => items.some((item) => cart.some((c) => c.product.id === item.id)),
    [items, cart]
  );

  const goNext = useCallback(
    () => setCenterIndex((prev) => (prev + 1) % total),
    [total]
  );
  const goPrev = useCallback(
    () => setCenterIndex((prev) => (prev - 1 + total) % total),
    [total]
  );

  // Reset center when items change (filter)
  useEffect(() => {
    setCenterIndex(0);
  }, [items]);

  // Auto-rotate
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (paused || hovered || hasCartItem || total <= 1) return;
    intervalRef.current = setInterval(goNext, 4000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [goNext, total, paused, hovered, hasCartItem]);

  const displayItems = useMemo(() => {
    if (total === 0) return [];
    const result: { product: Product; offset: number }[] = [];
    const half = Math.floor(Math.min(total, 7) / 2);
    for (let i = -half; i <= half; i++) {
      const idx = ((centerIndex + i) % total + total) % total;
      result.push({ product: items[idx], offset: i });
    }
    return result;
  }, [centerIndex, items, total]);

  // Animate track on index change
  useEffect(() => {
    if (!trackRef.current) return;
    gsap.fromTo(
      trackRef.current.children,
      { opacity: 0.5 },
      { opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" }
    );
  }, [centerIndex]);

  if (total === 0) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Carousel wrapper — overflow visible so box-shadow is not clipped */}
      <div className="relative" style={{ padding: "2rem 0" }}>
        {/* Track */}
        <div
          ref={trackRef}
          className="flex items-center justify-center gap-5 transition-all duration-500"
          style={{ minHeight: "340px" }}
        >
          {displayItems.map(({ product, offset }) => {
            const absOffset = Math.abs(offset);
            const scale =
              absOffset === 0 ? 1 : absOffset === 1 ? 0.88 : 0.75;
            const opacity =
              absOffset === 0 ? 1 : absOffset === 1 ? 0.7 : 0.4;
            const zIndex = 10 - absOffset;

            return (
              <div
                key={`${centerIndex}-${product.id}-${offset}`}
                className="shrink-0 transition-all duration-500 ease-out"
                style={{
                  transform: `scale(${scale})`,
                  opacity,
                  zIndex,
                  filter: absOffset > 1 ? "blur(2px)" : "none",
                  cursor: offset !== 0 ? "pointer" : "default",
                }}
                onClick={() => {
                  if (offset !== 0)
                    setCenterIndex(
                      ((centerIndex + offset) % total + total) % total
                    );
                }}
              >
                <ProductCard
                  product={product}
                  isCenter={offset === 0}
                  onInteract={setPaused}
                />
              </div>
            );
          })}
        </div>

        {/* Fade edges — pointer-events-none overlays on top of track */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-20"
          style={{
            width: "120px",
            background:
              "linear-gradient(to right, var(--background) 30%, transparent)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-20"
          style={{
            width: "120px",
            background:
              "linear-gradient(to left, var(--background) 30%, transparent)",
          }}
        />

        {/* Embedded arrow — Left */}
        {total > 1 && (
          <button
            onClick={goPrev}
            className="absolute left-2 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-200 hover:scale-110"
            style={{
              backgroundColor: "color-mix(in srgb, var(--card-bg) 60%, transparent)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid color-mix(in srgb, var(--card-border) 60%, transparent)",
              color: "var(--foreground)",
            }}
            aria-label="Anterior"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        {/* Embedded arrow — Right */}
        {total > 1 && (
          <button
            onClick={goNext}
            className="absolute right-2 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-200 hover:scale-110"
            style={{
              backgroundColor: "color-mix(in srgb, var(--card-bg) 60%, transparent)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid color-mix(in srgb, var(--card-border) 60%, transparent)",
              color: "var(--foreground)",
            }}
            aria-label="Proximo"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Progress dots */}
      {total > 1 && (
        <div className="mt-2 flex justify-center gap-1">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCenterIndex(i)}
              className="h-1 rounded-full transition-all duration-500"
              style={{
                width: i === centerIndex ? "32px" : "8px",
                backgroundColor:
                  i === centerIndex ? "var(--accent)" : "var(--card-border)",
              }}
            />
          ))}
        </div>
      )}

      {/* Counter */}
      {total > 1 && (
        <p
          className="mt-3 text-center text-xs tabular-nums"
          style={{ color: "var(--muted)" }}
        >
          {centerIndex + 1} / {total}
        </p>
      )}
    </div>
  );
}

/* ─── Main Section ─── */
export default function ProductGrid() {
  const { searchQuery, setSearchQuery, activeCategory, setActiveCategory } =
    useStore();
  const storeProducts = useStore((s) => s.products);
  const tabsRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isSticky, setIsSticky] = useState(false);

  // Section entrance animations
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".vitrine-title",
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".vitrine-title",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
      gsap.fromTo(
        ".vitrine-subtitle",
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.15,
          scrollTrigger: {
            trigger: ".vitrine-title",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
      gsap.fromTo(
        ".vitrine-tab",
        { opacity: 0, y: 20, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.06,
          duration: 0.5,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: ".vitrine-tabs",
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
      gsap.fromTo(
        ".vitrine-search",
        { opacity: 0, width: 0 },
        {
          opacity: 1,
          width: "auto",
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".vitrine-tabs",
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const filteredProducts = useMemo(() => {
    return storeProducts.filter((p) => {
      const matchesCategory =
        activeCategory === "Todos" || p.category === activeCategory;
      const matchesSearch =
        searchQuery === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, storeProducts]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsSticky(!entry.isIntersecting),
      { threshold: 1, rootMargin: "-1px 0px 0px 0px" }
    );
    const sentinel = document.getElementById("tabs-sentinel");
    if (sentinel) observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="vitrine"
      style={{ backgroundColor: "var(--background)", paddingBottom: "6rem" }}
    >
      <div className="mx-auto max-w-7xl px-4 pb-6 pt-20 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2
              className="vitrine-title text-3xl font-bold tracking-tight md:text-5xl"
              style={{ color: "var(--foreground)" }}
            >
              Nossos Produtos
            </h2>
            <p
              className="vitrine-subtitle mt-2 text-lg"
              style={{ color: "var(--muted)" }}
            >
              Selecione e peca pelo WhatsApp
            </p>
          </div>
          <Link
            href="/produtos"
            className="shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              color: "var(--foreground)",
            }}
          >
            Ver todos os produtos →
          </Link>
        </div>
      </div>

      <div id="tabs-sentinel" style={{ height: 0 }} />

      <div
        ref={tabsRef}
        className="sticky top-0 z-40 transition-all duration-300"
        style={{
          background: isSticky
            ? "color-mix(in srgb, var(--background) 85%, transparent)"
            : "var(--background)",
          backdropFilter: isSticky ? "blur(20px)" : "none",
          borderBottom: isSticky
            ? "1px solid var(--card-border)"
            : "1px solid transparent",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="vitrine-tabs scrollbar-hide flex gap-2 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="vitrine-tab shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200"
                  style={
                    activeCategory === cat
                      ? {
                          backgroundColor: "var(--accent)",
                          color: "#fff",
                          boxShadow: "0 4px 12px var(--accent-glow)",
                        }
                      : {
                          backgroundColor: "var(--card-bg)",
                          color: "var(--muted)",
                        }
                  }
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="vitrine-search relative w-full sm:ml-auto sm:w-72">
              <svg
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
                style={{ color: "var(--muted)" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Buscar produto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full py-2.5 pl-10 pr-10 text-sm outline-none transition-all"
                style={{
                  backgroundColor: "var(--card-bg)",
                  border: "1px solid var(--card-border)",
                  color: "var(--foreground)",
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--muted)" }}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-6 px-8 sm:px-12 lg:px-16">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div
              className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--card-border)",
              }}
            >
              <svg
                className="h-8 w-8"
                style={{ color: "var(--muted)" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <p
              className="text-lg font-medium"
              style={{ color: "var(--foreground)" }}
            >
              Nenhum produto encontrado
            </p>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
              Tente buscar por outro termo
            </p>
          </div>
        ) : (
          <SingleCarousel items={filteredProducts} />
        )}
      </div>
    </section>
  );
}
