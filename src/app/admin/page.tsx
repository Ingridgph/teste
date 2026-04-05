"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useStore } from "@/store/useStore";
import { categories } from "@/data/products";
import type { Product } from "@/store/useStore";

/* ─── Constants ─── */
const ADMIN_TOKEN =
  "A1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6Q7r8S9t0U1v2W3x4Y5z6A7b8C9d0";
const SESSION_KEY = "admin_token";

/* ─── Zod schema ─── */
const productSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  price: z
    .number({ error: "Preço inválido" })
    .positive("Preço deve ser positivo"),
  category: z.string().min(1, "Selecione uma categoria"),
  description: z.string().min(3, "Descrição muito curta"),
  image: z.string().min(1, "Informe o caminho da imagem"),
  badge: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

/* ─── Confirm dialog ─── */
function ConfirmModal({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        onClick={onCancel}
      />
      <div
        className="relative w-full max-w-sm rounded-2xl p-6 shadow-2xl"
        style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--card-border)" }}
      >
        <p className="mb-6 text-sm" style={{ color: "var(--foreground)" }}>
          {message}
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-full px-5 py-2 text-sm font-medium transition-all hover:opacity-70"
            style={{ backgroundColor: "var(--surface)", color: "var(--muted)" }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="rounded-full px-5 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: "#ef4444" }}
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Product Form Modal ─── */
function ProductFormModal({
  initial,
  onSave,
  onClose,
}: {
  initial?: Product;
  onSave: (data: ProductFormData, id?: string) => void;
  onClose: () => void;
}) {
  const productCategories = categories.filter((c) => c !== "Todos");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initial
      ? {
          name: initial.name,
          price: initial.price,
          category: initial.category,
          description: initial.description,
          image: initial.image,
          badge: initial.badge ?? "",
        }
      : {
          category: productCategories[0],
          image: "/products/",
          badge: "",
        },
  });

  const onSubmit = (data: ProductFormData) => {
    onSave(data, initial?.id);
  };

  const inputStyle = {
    backgroundColor: "var(--surface)",
    border: "1px solid var(--card-border)",
    color: "var(--foreground)",
    borderRadius: "10px",
    padding: "10px 14px",
    fontSize: "14px",
    width: "100%",
    outline: "none",
  };

  const labelStyle = {
    fontSize: "12px",
    fontWeight: 500,
    color: "var(--muted)",
    display: "block",
    marginBottom: "6px",
  };

  const errorStyle = {
    fontSize: "11px",
    color: "#ef4444",
    marginTop: "4px",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 py-10">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-lg rounded-2xl p-6 shadow-2xl"
        style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--card-border)" }}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
            {initial ? "Editar Produto" : "Adicionar Produto"}
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-all hover:opacity-70"
            style={{ color: "var(--muted)" }}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Name */}
          <div>
            <label style={labelStyle}>Nome *</label>
            <input {...register("name")} placeholder="Ex: iPhone 16 Pro" style={inputStyle} />
            {errors.name && <p style={errorStyle}>{errors.name.message}</p>}
          </div>

          {/* Price */}
          <div>
            <label style={labelStyle}>Preço (R$) *</label>
            <input
              inputMode="numeric"
              placeholder="Ex: 9499"
              style={inputStyle}
              {...register("price", { valueAsNumber: true })}
              onInput={(e) => {
                const val = (e.target as HTMLInputElement).value.replace(/[^0-9]/g, "");
                (e.target as HTMLInputElement).value = val;
                setValue("price", val === "" ? 0 : Number(val), { shouldValidate: true });
              }}
            />
            {errors.price && <p style={errorStyle}>{errors.price.message}</p>}
          </div>

          {/* Category */}
          <div>
            <label style={labelStyle}>Categoria *</label>
            <select {...register("category")} style={inputStyle}>
              {productCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && <p style={errorStyle}>{errors.category.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Descrição *</label>
            <input {...register("description")} placeholder="Ex: 256GB - Titânio Natural" style={inputStyle} />
            {errors.description && <p style={errorStyle}>{errors.description.message}</p>}
          </div>

          {/* Image */}
          <div>
            <label style={labelStyle}>Imagem (caminho) *</label>
            <input {...register("image")} placeholder="/products/nome-do-produto.webp" style={inputStyle} />
            {errors.image && <p style={errorStyle}>{errors.image.message}</p>}
          </div>

          {/* Badge */}
          <div>
            <label style={labelStyle}>Badge (opcional)</label>
            <input {...register("badge")} placeholder="Ex: Novo, Popular, Destaque" style={inputStyle} />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-5 py-2 text-sm font-medium transition-all hover:opacity-70"
              style={{ backgroundColor: "var(--surface)", color: "var(--muted)" }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-full px-6 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: "var(--accent)" }}
            >
              {initial ? "Salvar alterações" : "Adicionar produto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Login Screen ─── */
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [showToken, setShowToken] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token === ADMIN_TOKEN) {
      sessionStorage.setItem(SESSION_KEY, token);
      onLogin();
    } else {
      setError("Token inválido. Tente novamente.");
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8 shadow-2xl"
        style={{
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--card-border)",
        }}
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
            Admin Panel
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            Noleto iPhones
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              className="mb-2 block text-xs font-medium"
              style={{ color: "var(--muted)" }}
            >
              Token de acesso
            </label>
            <div className="relative">
              <input
                type={showToken ? "text" : "password"}
                value={token}
                onChange={(e) => {
                  setToken(e.target.value);
                  setError("");
                }}
                placeholder="Insira o token de 60 caracteres"
                className="w-full rounded-xl py-3 pl-4 pr-11 text-sm outline-none"
                style={{
                  backgroundColor: "var(--surface)",
                  border: error
                    ? "1px solid #ef4444"
                    : "1px solid var(--card-border)",
                  color: "var(--foreground)",
                }}
                maxLength={60}
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowToken((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
                style={{ color: "var(--muted)" }}
              >
                {showToken ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {error && (
              <p className="mt-1.5 text-xs" style={{ color: "#ef4444" }}>
                {error}
              </p>
            )}
            <p className="mt-1.5 text-right text-xs tabular-nums" style={{ color: "var(--muted)" }}>
              {token.length}/60 caracteres
            </p>
          </div>

          <button
            type="submit"
            className="w-full rounded-full py-3 text-sm font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.02]"
            style={{ backgroundColor: "var(--accent)" }}
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── Admin Dashboard ─── */
function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const products = useStore((s) => s.products);
  const addProduct = useStore((s) => s.addProduct);
  const updateProduct = useStore((s) => s.updateProduct);
  const deleteProduct = useStore((s) => s.deleteProduct);

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | undefined>(undefined);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCat, setFilterCat] = useState("Todos");

  const productCategories = categories.filter((c) => c !== "Todos");

  const filteredProducts = products.filter((p) => {
    const matchesCat = filterCat === "Todos" || p.category === filterCat;
    const matchesSearch =
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSave = useCallback(
    (data: ProductFormData, id?: string) => {
      const product: Product = {
        id: id ?? `product-${Date.now()}`,
        name: data.name,
        price: data.price,
        category: data.category,
        description: data.description,
        image: data.image,
        badge: data.badge || undefined,
      };
      if (id) {
        updateProduct(product);
      } else {
        addProduct(product);
      }
      setFormOpen(false);
      setEditTarget(undefined);
    },
    [addProduct, updateProduct]
  );

  const handleEdit = (product: Product) => {
    setEditTarget(product);
    setFormOpen(true);
  };

  const handleDeleteConfirm = (id: string) => {
    setConfirmDelete(id);
  };

  const confirmDeleteProduct = () => {
    if (confirmDelete) {
      deleteProduct(confirmDelete);
      setConfirmDelete(null);
    }
  };

  const inputStyle = {
    backgroundColor: "var(--surface)",
    border: "1px solid var(--card-border)",
    color: "var(--foreground)",
    borderRadius: "999px",
    padding: "8px 16px",
    fontSize: "13px",
    outline: "none",
  };

  return (
    <div style={{ backgroundColor: "var(--background)", minHeight: "100vh" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-40"
        style={{
          backgroundColor: "color-mix(in srgb, var(--background) 90%, transparent)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--card-border)",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ backgroundColor: "var(--accent)" }}
            >
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold" style={{ color: "var(--foreground)" }}>
                Admin Panel
              </h1>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                {products.length} produtos cadastrados
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditTarget(undefined);
                setFormOpen(true);
              }}
              className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 hover:scale-105"
              style={{ backgroundColor: "var(--accent)" }}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Adicionar produto
            </button>
            <button
              onClick={onLogout}
              className="rounded-full px-4 py-2.5 text-sm font-medium transition-all hover:opacity-70"
              style={{ backgroundColor: "var(--card-bg)", color: "var(--muted)", border: "1px solid var(--card-border)" }}
            >
              Sair
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="scrollbar-hide flex gap-2 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                className="shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200"
                style={
                  filterCat === cat
                    ? { backgroundColor: "var(--accent)", color: "#fff" }
                    : { backgroundColor: "var(--card-bg)", color: "var(--muted)", border: "1px solid var(--card-border)" }
                }
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative ml-auto">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
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
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ ...inputStyle, paddingLeft: "36px", paddingRight: "12px", width: "220px" }}
            />
          </div>
        </div>

        {/* Table */}
        <div
          className="overflow-hidden rounded-2xl"
          style={{ border: "1px solid var(--card-border)" }}
        >
          {/* Table header */}
          <div
            className="grid gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wider"
            style={{
              backgroundColor: "var(--surface)",
              color: "var(--muted)",
              gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
            }}
          >
            <span>Produto</span>
            <span>Preço</span>
            <span>Categoria</span>
            <span>Badge</span>
            <span className="text-right">Ações</span>
          </div>

          {/* Rows */}
          {filteredProducts.length === 0 ? (
            <div
              className="py-16 text-center text-sm"
              style={{ color: "var(--muted)", backgroundColor: "var(--card-bg)" }}
            >
              Nenhum produto encontrado.
            </div>
          ) : (
            filteredProducts.map((product, i) => (
              <div
                key={product.id}
                className="grid items-center gap-4 px-5 py-4 transition-colors hover:brightness-105"
                style={{
                  gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
                  backgroundColor: i % 2 === 0 ? "var(--card-bg)" : "var(--surface)",
                  borderTop: "1px solid var(--card-border)",
                }}
              >
                {/* Name + id */}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium" style={{ color: "var(--foreground)" }}>
                    {product.name}
                  </p>
                  <p className="truncate text-xs" style={{ color: "var(--muted)" }}>
                    {product.id}
                  </p>
                </div>

                {/* Price */}
                <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                  R${product.price.toLocaleString("pt-BR")}
                </span>

                {/* Category */}
                <span
                  className="w-fit rounded-full px-3 py-1 text-xs font-medium"
                  style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}
                >
                  {product.category}
                </span>

                {/* Badge */}
                <span className="text-xs" style={{ color: "var(--muted)" }}>
                  {product.badge ?? "—"}
                </span>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:scale-110"
                    style={{
                      backgroundColor: "var(--accent-soft)",
                      color: "var(--accent)",
                      border: "1px solid rgba(37,150,190,0.2)",
                    }}
                    aria-label="Editar"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteConfirm(product.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:scale-110"
                    style={{
                      backgroundColor: "rgba(239,68,68,0.1)",
                      color: "#ef4444",
                      border: "1px solid rgba(239,68,68,0.3)",
                    }}
                    aria-label="Excluir"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Form modal */}
      {formOpen && (
        <ProductFormModal
          initial={editTarget}
          onSave={handleSave}
          onClose={() => {
            setFormOpen(false);
            setEditTarget(undefined);
          }}
        />
      )}

      {/* Confirm delete */}
      {confirmDelete && (
        <ConfirmModal
          message={`Tem certeza que deseja excluir "${products.find((p) => p.id === confirmDelete)?.name}"? Esta ação não pode ser desfeita.`}
          onConfirm={confirmDeleteProduct}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

/* ─── Page ─── */
export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    setAuthenticated(stored === ADMIN_TOKEN);
  }, []);

  const handleLogin = () => setAuthenticated(true);

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthenticated(false);
  };

  // Loading state (avoids flash)
  if (authenticated === null) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: "var(--background)" }}
      >
        <div
          className="h-10 w-10 animate-spin rounded-full border-2 border-t-transparent"
          style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  if (!authenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <>
      <AdminDashboard onLogout={handleLogout} />
    </>
  );
}
