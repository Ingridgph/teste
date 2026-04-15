"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import ProductGrid from "@/components/ProductGrid";
import WhatsAppButton from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";

const BookPages = dynamic(() => import("@/components/BookPages"), {
  ssr: false,
  loading: () => (
    <div style={{ backgroundColor: "var(--background)", minHeight: "100vh" }} />
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
