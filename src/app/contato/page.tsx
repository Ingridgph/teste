"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const contactSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  phone: z.string().min(10, "Telefone invalido").max(15),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContatoPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onChange",
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".anim-up", { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.1,
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const onSubmit = (data: ContactFormData) => {
    const message = `Contato via site:\n\nNome: ${data.name}\nTelefone: ${data.phone}`;
    const link = `https://wa.me/5500000000000?text=${encodeURIComponent(message)}`;
    window.open(link, "_blank");
    reset();
  };

  const inputStyle = (hasError: boolean) => ({
    backgroundColor: "var(--surface)",
    border: `1px solid ${hasError ? "rgba(239,68,68,0.5)" : "var(--card-border)"}`,
    color: "var(--foreground)",
  });

  return (
    <>
      <Navbar />
      <div ref={pageRef} className="min-h-screen pt-16" style={{ backgroundColor: "var(--background)" }}>
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          {/* Header */}
          <div className="anim-up mb-12 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl" style={{ color: "var(--foreground)" }}>
              Fale com a{" "}
              <span style={{ color: "var(--accent)" }}>Noleto iPhones</span>
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-base" style={{ color: "var(--muted)" }}>
              Conheca nossa historia e entre em contato direto pelo WhatsApp
            </p>
          </div>

          {/* Top row: Bio + Info side by side */}
          <div className="anim-up mb-8 grid gap-6 md:grid-cols-2">
            {/* Photo + Bio */}
            <div className="overflow-hidden rounded-2xl" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
              <div className="flex flex-col items-center gap-5 p-6 sm:flex-row sm:items-start">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl" style={{ background: "linear-gradient(135deg, var(--accent-soft), rgba(37,150,190,0.18))", border: "2px solid var(--card-border)" }}>
                  <svg className="h-10 w-10" style={{ color: "var(--accent)", opacity: 0.5 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>Noleto</h2>
                  <p className="mt-0.5 text-sm font-medium" style={{ color: "var(--accent)" }}>Fundador - Noleto iPhones</p>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Apaixonado por tecnologia Apple desde sempre. Comecei vendendo iPhones para amigos e familiares, e vi a oportunidade de levar produtos premium com precos justos e atendimento humanizado.
                  </p>
                </div>
              </div>
            </div>

            {/* Info card */}
            <div className="space-y-4 rounded-2xl p-6" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
              <h3 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>Informacoes</h3>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: "var(--accent-soft)" }}>
                  <svg className="h-4 w-4" style={{ color: "var(--accent)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Endereco</p>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>Rua Exemplo, 123 - Centro<br />Cidade - Estado, CEP 00000-000</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(34,197,94,0.1)" }}>
                  <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>WhatsApp</p>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>(00) 00000-0000</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: "var(--accent-soft)" }}>
                  <svg className="h-4 w-4" style={{ color: "var(--accent)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Horario</p>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>Seg a Sex: 9h - 18h / Sab: 9h - 13h</p>
                </div>
              </div>
            </div>
          </div>

          {/* History */}
          <div className="anim-up mb-8 rounded-2xl p-6" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
            <h3 className="mb-3 text-lg font-bold" style={{ color: "var(--foreground)" }}>Nossa Historia</h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              A Noleto iPhones nasceu da paixao por oferecer o melhor da tecnologia Apple de forma acessivel e confiavel. O que comecou como um projeto pessoal rapidamente se transformou em uma loja reconhecida pela curadoria rigorosa de produtos e pelo atendimento proximo ao cliente. Cada iPhone, AirPods e acessorio que oferecemos passa por verificacao de autenticidade e testes de qualidade. Acreditamos que tecnologia premium nao precisa ser inacessivel — e essa e a missao que nos move todos os dias.
            </p>
          </div>

          {/* Form - compact, full width */}
          <div className="anim-up rounded-2xl p-6" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
            <h3 className="mb-5 text-lg font-bold" style={{ color: "var(--foreground)" }}>Fale conosco pelo WhatsApp</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-3">
              <div className="flex-1">
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Nome</label>
                <input
                  {...register("name")}
                  placeholder="Seu nome"
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:opacity-40"
                  style={inputStyle(!!errors.name)}
                />
                {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
              </div>
              <div className="flex-1">
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Telefone</label>
                <input
                  {...register("phone")}
                  type="tel"
                  placeholder="(00) 00000-0000"
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:opacity-40"
                  style={inputStyle(!!errors.phone)}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>}
              </div>
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="shrink-0 rounded-xl px-8 py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
                style={{ backgroundColor: "var(--accent)", boxShadow: "0 4px 20px var(--accent-glow)" }}
              >
                Enviar via WhatsApp
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
