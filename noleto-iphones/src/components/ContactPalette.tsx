"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { gsap } from "gsap";
import { useStore } from "@/store/useStore";

const contactSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  email: z.string().email("E-mail invalido"),
  phone: z.string().min(10, "Telefone invalido").max(15),
  message: z.string().min(5, "Mensagem muito curta").max(500),
});

type ContactForm = z.infer<typeof contactSchema>;

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        className="text-xs font-medium uppercase tracking-wider"
        style={{ color: "var(--muted)" }}
      >
        {label}
      </label>
      <div className="relative">
        {children}
        {error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 group">
            <svg className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 3a9 9 0 100 18 9 9 0 000-18z" />
            </svg>
            <span className="absolute -top-8 right-0 hidden whitespace-nowrap rounded bg-red-500 px-2 py-1 text-xs text-white group-hover:block">
              {error}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ContactPalette() {
  const { contactOpen, setContactOpen } = useStore();
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    mode: "onChange",
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setContactOpen(!contactOpen);
      }
      if (e.key === "Escape" && contactOpen) {
        setContactOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [contactOpen, setContactOpen]);

  useEffect(() => {
    if (contactOpen) {
      document.body.style.overflow = "hidden";
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power2.out" });
      gsap.fromTo(panelRef.current, { opacity: 0, y: -20, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(1.4)" });
    } else {
      document.body.style.overflow = "";
    }
  }, [contactOpen]);

  const onSubmit = (data: ContactForm) => {
    const message = `Contato via site:\n\nNome: ${data.name}\nE-mail: ${data.email}\nTelefone: ${data.phone}\nMensagem: ${data.message}`;
    const link = `https://wa.me/5500000000000?text=${encodeURIComponent(message)}`;
    window.open(link, "_blank");
    reset();
    setContactOpen(false);
  };

  const inputStyle = (hasError: boolean) => ({
    backgroundColor: "var(--surface)",
    border: `1px solid ${hasError ? "rgba(239,68,68,0.5)" : "var(--card-border)"}`,
    color: "var(--foreground)",
  });

  if (!contactOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[15vh]">
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(20px)" }}
        onClick={() => setContactOpen(false)}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl"
        style={{
          backgroundColor: "color-mix(in srgb, var(--card-bg) 95%, transparent)",
          backdropFilter: "blur(40px)",
          border: "1px solid var(--card-border)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid var(--card-border)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ backgroundColor: "rgba(59,130,246,0.15)" }}
            >
              <svg className="h-4 w-4" style={{ color: "var(--accent)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
              Contato
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <kbd
              className="hidden rounded px-2 py-0.5 font-mono text-xs sm:inline-flex"
              style={{
                color: "var(--muted)",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--card-border)",
              }}
            >
              Esc
            </kbd>
            <button
              onClick={() => setContactOpen(false)}
              className="p-1 transition-colors"
              style={{ color: "var(--muted)" }}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
          <FormField label="Nome" error={errors.name?.message}>
            <input
              {...register("name")}
              placeholder="Seu nome completo"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:opacity-40"
              style={inputStyle(!!errors.name)}
            />
          </FormField>

          <FormField label="E-mail" error={errors.email?.message}>
            <input
              {...register("email")}
              type="email"
              placeholder="voce@exemplo.com"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:opacity-40"
              style={inputStyle(!!errors.email)}
            />
          </FormField>

          <FormField label="Telefone" error={errors.phone?.message}>
            <input
              {...register("phone")}
              type="tel"
              placeholder="(00) 00000-0000"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:opacity-40"
              style={inputStyle(!!errors.phone)}
            />
          </FormField>

          <FormField label="Mensagem" error={errors.message?.message}>
            <textarea
              {...register("message")}
              rows={3}
              placeholder="Como podemos ajudar?"
              className="w-full resize-none rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:opacity-40"
              style={inputStyle(!!errors.message)}
            />
          </FormField>

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="w-full rounded-xl py-3.5 text-sm font-semibold text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40"
            style={{ backgroundColor: "var(--accent)" }}
          >
            Enviar via WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
}
