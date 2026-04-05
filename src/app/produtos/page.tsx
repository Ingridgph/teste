"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useStore } from "@/store/useStore";
import type { Product } from "@/store/useStore";

gsap.registerPlugin(ScrollTrigger);

/* --- Product Card (vertical, grid) --- */
function ProductCardGrid({ product }: { product: Product }) {
  const addToCart = useStore((s) => s.addToCart);
  const decrementFromCart = useStore((s) => s.decrementFromCart);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const generateWhatsAppLink = useStore((s) => s.generateWhatsAppLink);
  const cart = useStore((s) => s.cart);
  const cardRef = useRef<HTMLDivElement>(null);
  const inCart = cart.find((item) => item.product.id === product.id);

  const handleAdd = () => {
    addToCart(product);
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { scale: 0.97 },
        { scale: 1, duration: 0.35, ease: "elastic.out(1, 0.5)" }
      );
    }
  };

  const handleDecrement = () => {
    decrementFromCart(product.id);
  };

  const handleRemove = () => {
    removeFromCart(product.id);
  };

  const handleOrder = () => {
    addToCart(product);
    const link = generateWhatsAppLink();
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      ref={cardRef}
      className="produto-card relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--card-border)",
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

      {/* Image / Placeholder */}
      <div
        className="flex items-center justify-center px-6 py-10"
        style={{
          background:
            "linear-gradient(135deg, var(--accent-soft), rgba(37,150,190,0.08))",
        }}
      >
        <div
          className="flex h-28 w-28 items-center justify-center rounded-2xl border"
          style={{
            background:
              "linear-gradient(135deg, var(--accent-soft), rgba(37,150,190,0.15))",
            borderColor: "rgba(255,255,255,0.05)",
          }}
        >
          <span
            className="text-4xl font-bold"
            style={{ color: "var(--accent)", opacity: 0.4 }}
          >
            {product.name.charAt(0)}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1.5 px-5 pb-5 pt-4">
        <span className="text-xs font-medium" style={{ color: "var(--accent)" }}>
          {product.category}
        </span>
        <h3
          className="text-sm font-semibold leading-snug"
          style={{ color: "var(--foreground)" }}
        >
          {product.name}
        </h3>
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          {product.description}
        </p>

        <div className="mt-auto pt-4">
          <span
            className="block text-xl font-bold"
            style={{ color: "var(--foreground)" }}
          >
            R${product.price.toLocaleString("pt-BR")}
          </span>

          <div className="mt-3 flex flex-col gap-2">
            {inCart ? (
              <>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleDecrement}
                    className="flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:scale-110"
                    style={{
                      backgroundColor: "rgba(239,68,68,0.1)",
                      color: "#ef4444",
                      border: "1px solid rgba(239,68,68,0.3)",
                    }}
                    aria-label="Diminuir"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                    </svg>
                  </button>
                  <span
                    className="w-6 text-center text-sm font-bold"
                    style={{ color: "var(--foreground)" }}
                  >
                    {inCart.quantity}
                  </span>
                  <button
                    onClick={handleAdd}
                    className="flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:scale-110"
                    style={{
                      backgroundColor: "rgba(34,197,94,0.1)",
                      color: "#22c55e",
                      border: "1px solid rgba(34,197,94,0.3)",
                    }}
                    aria-label="Aumentar"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  <button
                    onClick={handleRemove}
                    className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:scale-110"
                    style={{
                      backgroundColor: "rgba(239,68,68,0.1)",
                      color: "#ef4444",
                      border: "1px solid rgba(239,68,68,0.3)",
                    }}
                    aria-label="Remover"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <button
                  onClick={handleOrder}
                  className="w-full rounded-full py-2 text-xs font-semibold transition-all duration-200 hover:scale-105"
                  style={{ backgroundColor: "var(--accent)", color: "#fff" }}
                >
                  Pedir pelo WhatsApp
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-xs font-semibold transition-all duration-200 hover:scale-105"
                  style={{ backgroundColor: "var(--accent)", color: "#fff" }}
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Pedir
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- Page --- */
export default function ProdutosPage() {
  const storeProducts = useStore((s) => s.products);
  const storeCategories = useStore((s) => s.categories);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const pageRef = useRef<HTMLDivElement>(null);

  const activeCategories = useMemo(() => {
    const active = storeCategories.filter((c) => c.active).map((c) => c.name);
    return ["Todos", ...active];
  }, [storeCategories]);

  const filteredProducts = useMemo(() => {
    return storeProducts.filter((p) => {
      if (!p.active) return false;
      const matchesCategory =
        activeCategory === "Todos" || p.category === activeCategory;
      const matchesSearch =
        searchQuery === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, storeProducts]);

  const activeProductCount = useMemo(
    () => storeProducts.filter((p) => p.active).length,
    [storeProducts]
  );

  useEffect(() => {
    if (!pageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".page-title",
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
      gsap.fromTo(
        ".produto-card",
        { opacity: 0, y: 40, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.06,
          duration: 0.5,
          ease: "power3.out",
          delay: 0.2,
        }
      );
    }, pageRef);
    return () => ctx.revert();
  }, [filteredProducts]);

  return (
    <>
      <Navbar />
      <main
        ref={pageRef}
        style={{ backgroundColor: "var(--background)", minHeight: "100vh" }}
      >
        {/* Hero */}
        <div
          className="pt-28 pb-10"
          style={{ backgroundColor: "var(--surface)" }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-col gap-1">
              <a
                href="/"
                className="text-xs transition-opacity hover:opacity-70"
                style={{ color: "var(--muted)" }}
              >
                Voltar para o inicio
              </a>
              <h1
                className="page-title text-3xl font-bold tracking-tight md:text-4xl"
                style={{ color: "var(--foreground)" }}
              >
                Todos os Produtos
              </h1>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                {activeProductCount} produto{activeProductCount !== 1 ? "s" : ""} disponivel{activeProductCount !== 1 ? "is" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div
          className="sticky top-0 z-40"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--background) 88%, transparent)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid var(--card-border)",
          }}
        >
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              {/* Category tabs */}
              <div className="scrollbar-hide flex gap-2 overflow-x-auto">
                {activeCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200"
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
              {/* Search */}
              <div className="relative w-full sm:ml-auto sm:w-72">
                <svg
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
                  style={{ color: "var(--muted)" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Buscar produto..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full py-2.5 pl-10 pr-10 text-sm outline-none"
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
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-lg font-medium" style={{ color: "var(--foreground)" }}>
                Nenhum produto encontrado
              </p>
              <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                Tente buscar por outro termo ou categoria
              </p>
            </div>
          ) : (
            <>
              <p className="mb-6 text-sm" style={{ color: "var(--muted)" }}>
                Exibindo{" "}
                <strong style={{ color: "var(--foreground)" }}>{filteredProducts.length}</strong>{" "}
                produto{filteredProducts.length !== 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCardGrid key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
