"use client";

import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { gsap } from "gsap";
import { useStore } from "@/store/useStore";
import { products, categories } from "@/data/products";
import type { Product } from "@/store/useStore";

/* ─── Product Card ─── */
function ProductCard({ product }: { product: Product }) {
  const addToCart = useStore((s) => s.addToCart);
  const cart = useStore((s) => s.cart);
  const cardRef = useRef<HTMLDivElement>(null);
  const inCart = cart.find((item) => item.product.id === product.id);

  const handleAdd = () => {
    addToCart(product);
    if (cardRef.current) {
      gsap.fromTo(cardRef.current, { scale: 0.95 }, { scale: 1, duration: 0.3, ease: "back.out(1.7)" });
    }
  };

  return (
    <div
      ref={cardRef}
      className="group relative flex w-full shrink-0 flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-lg"
      style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
    >
      {product.badge && (
        <span className="absolute left-3 top-3 z-10 rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white" style={{ backgroundColor: "var(--accent)" }}>
          {product.badge}
        </span>
      )}

      <div className="relative flex aspect-square items-center justify-center p-5">
        <div
          className="flex h-24 w-24 items-center justify-center rounded-2xl border transition-transform duration-500 group-hover:scale-110 sm:h-28 sm:w-28"
          style={{ background: "linear-gradient(135deg, var(--accent-soft), rgba(37,150,190,0.15))", borderColor: "rgba(255,255,255,0.05)" }}
        >
          <span className="text-3xl font-bold sm:text-4xl" style={{ color: "var(--accent)", opacity: 0.4 }}>
            {product.name.charAt(0)}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 px-4 pb-4">
        <h3 className="truncate text-sm font-semibold" style={{ color: "var(--foreground)" }}>{product.name}</h3>
        <p className="truncate text-xs" style={{ color: "var(--muted)" }}>{product.description}</p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-sm font-bold sm:text-base" style={{ color: "var(--foreground)" }}>
            R${product.price.toLocaleString("pt-BR")}
          </span>
          <button
            onClick={handleAdd}
            className="flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200"
            style={
              inCart
                ? { backgroundColor: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }
                : { backgroundColor: "var(--accent)", color: "#fff" }
            }
          >
            {inCart ? (
              <>
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                {inCart.quantity}x
              </>
            ) : (
              <>
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Pedir
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Animated Carousel: shows 3 items, auto-rotates ─── */
function CategoryCarousel({ category, items }: { category: string; items: Product[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = items.length;
  const visibleCount = 3;

  // Get 3 visible items with wrapping
  const visibleItems = useMemo(() => {
    const result: Product[] = [];
    for (let i = 0; i < Math.min(visibleCount, total); i++) {
      result.push(items[(currentIndex + i) % total]);
    }
    return result;
  }, [currentIndex, items, total]);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Animate on index change
  useEffect(() => {
    if (!trackRef.current) return;
    const cards = trackRef.current.children;
    gsap.fromTo(
      cards,
      { opacity: 0, x: 40, scale: 0.95 },
      { opacity: 1, x: 0, scale: 1, stagger: 0.08, duration: 0.45, ease: "power2.out" }
    );
  }, [currentIndex]);

  // Auto-rotate every 4s
  useEffect(() => {
    if (total <= visibleCount) return;
    intervalRef.current = setInterval(goNext, 4000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [goNext, total]);

  // Pause on hover
  const pause = () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  const resume = () => {
    if (total <= visibleCount) return;
    intervalRef.current = setInterval(goNext, 4000);
  };

  // Dots
  const totalPages = total <= visibleCount ? 1 : total;

  return (
    <div className="relative" onMouseEnter={pause} onMouseLeave={resume}>
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold sm:text-xl" style={{ color: "var(--foreground)" }}>{category}</h3>
          <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>{total} produtos</span>
        </div>
        {total > visibleCount && (
          <div className="flex items-center gap-2">
            <button
              onClick={goPrev}
              className="flex h-9 w-9 items-center justify-center rounded-full transition-all hover:scale-110"
              style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--card-border)", color: "var(--foreground)" }}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
              onClick={goNext}
              className="flex h-9 w-9 items-center justify-center rounded-full transition-all hover:scale-110"
              style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--card-border)", color: "var(--foreground)" }}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        )}
      </div>

      {/* Cards grid - always 3 visible */}
      <div ref={trackRef} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleItems.map((product) => (
          <ProductCard key={`${currentIndex}-${product.id}`} product={product} />
        ))}
      </div>

      {/* Dot indicators */}
      {total > visibleCount && (
        <div className="mt-5 flex justify-center gap-1.5">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === currentIndex ? "24px" : "8px",
                backgroundColor: i === currentIndex ? "var(--accent)" : "var(--card-border)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Main Section ─── */
export default function ProductGrid() {
  const { searchQuery, setSearchQuery, activeCategory, setActiveCategory } = useStore();
  const tabsRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = activeCategory === "Todos" || p.category === activeCategory;
      const matchesSearch =
        searchQuery === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const grouped = useMemo(() => {
    if (activeCategory !== "Todos") {
      return [{ category: activeCategory, items: filteredProducts }];
    }
    const cats = categories.filter((c) => c !== "Todos");
    return cats
      .map((cat) => ({ category: cat, items: filteredProducts.filter((p) => p.category === cat) }))
      .filter((g) => g.items.length > 0);
  }, [activeCategory, filteredProducts]);

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
    <section id="vitrine" style={{ backgroundColor: "var(--background)", paddingBottom: "6rem" }}>
      <div className="mx-auto max-w-7xl px-4 pb-6 pt-20 sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight md:text-5xl" style={{ color: "var(--foreground)" }}>
          Nossos Produtos
        </h2>
        <p className="mt-2 text-lg" style={{ color: "var(--muted)" }}>Selecione e peca pelo WhatsApp</p>
      </div>

      <div id="tabs-sentinel" style={{ height: 0 }} />

      <div
        ref={tabsRef}
        className="sticky top-0 z-40 transition-all duration-300"
        style={{
          background: isSticky ? "color-mix(in srgb, var(--background) 85%, transparent)" : "var(--background)",
          backdropFilter: isSticky ? "blur(20px)" : "none",
          borderBottom: isSticky ? "1px solid var(--card-border)" : "1px solid transparent",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="scrollbar-hide flex gap-2 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200"
                  style={
                    activeCategory === cat
                      ? { backgroundColor: "var(--accent)", color: "#fff", boxShadow: "0 4px 12px var(--accent-glow)" }
                      : { backgroundColor: "var(--card-bg)", color: "var(--muted)" }
                  }
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:ml-auto sm:w-72">
              <svg className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--muted)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar produto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full py-2.5 pl-10 pr-10 text-sm outline-none transition-all"
                style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--card-border)", color: "var(--foreground)" }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }}>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-7xl space-y-14 px-4 sm:px-6">
        {grouped.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}>
              <svg className="h-8 w-8" style={{ color: "var(--muted)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-lg font-medium" style={{ color: "var(--foreground)" }}>Nenhum produto encontrado</p>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>Tente buscar por outro termo</p>
          </div>
        ) : (
          grouped.map((g) => (
            <CategoryCarousel key={g.category} category={g.category} items={g.items} />
          ))
        )}
      </div>
    </section>
  );
}
