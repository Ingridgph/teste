"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import ProductGrid from "@/components/ProductGrid";
import WhatsAppButton from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";

const BookPages = dynamic(() => import("@/components/BookPages"), {
  ssr: false,
  loading: () => (
    <section className="flex h-screen items-center justify-center" style={{ backgroundColor: "var(--background)" }}>
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
      </div>
    </section>
  ),
});

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <BookPages />
        <ProductGrid />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
