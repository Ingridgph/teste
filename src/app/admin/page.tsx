"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useStore } from "@/store/useStore";
import type { Product, Category, Comment } from "@/store/useStore";

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */
const ADMIN_TOKEN =
  "A1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6Q7r8S9t0U1v2W3x4Y5z6A7b8C9d0";
const SESSION_KEY = "admin_token";

/* Timing-safe string comparison (client-side best-effort) */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Still iterate to avoid timing leak on length
    let diff = 0;
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
    }
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/* ------------------------------------------------------------------ */
/* Zod schemas                                                         */
/* ------------------------------------------------------------------ */
const productSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no maximo 100 caracteres"),
  price: z
    .number({ message: "Preco invalido" })
    .positive("Preco deve ser positivo")
    .max(999999, "Preco muito alto")
    .refine((v) => Number.isFinite(v) && !Number.isNaN(v), "Preco invalido"),
  category: z.string().min(1, "Selecione uma categoria"),
  description: z
    .string()
    .min(3, "Descricao muito curta")
    .max(500, "Descricao deve ter no maximo 500 caracteres"),
  badge: z
    .string()
    .max(20, "Badge deve ter no maximo 20 caracteres")
    .optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(50, "Nome deve ter no maximo 50 caracteres"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

const commentSchema = z.object({
  author: z
    .string()
    .min(2, "Autor deve ter pelo menos 2 caracteres")
    .max(100, "Autor deve ter no maximo 100 caracteres"),
  text: z
    .string()
    .min(3, "Comentario muito curto")
    .max(500, "Comentario deve ter no maximo 500 caracteres"),
});

type CommentFormData = z.infer<typeof commentSchema>;

/* ------------------------------------------------------------------ */
/* Shared styles                                                        */
/* ------------------------------------------------------------------ */
const inputStyle: React.CSSProperties = {
  backgroundColor: "var(--surface)",
  border: "1px solid var(--card-border)",
  color: "var(--foreground)",
  borderRadius: "10px",
  padding: "10px 14px",
  fontSize: "14px",
  width: "100%",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: 500,
  color: "var(--muted)",
  display: "block",
  marginBottom: "6px",
};

const errorStyle: React.CSSProperties = {
  fontSize: "11px",
  color: "#ef4444",
  marginTop: "4px",
};

/* ------------------------------------------------------------------ */
/* Confirm modal                                                        */
/* ------------------------------------------------------------------ */
function ConfirmModal({
  message,
  confirmLabel = "Confirmar",
  confirmColor = "#ef4444",
  onConfirm,
  onCancel,
}: {
  message: string;
  confirmLabel?: string;
  confirmColor?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
        onClick={onCancel}
      />
      <div
        className="relative w-full max-w-sm rounded-2xl p-6 shadow-2xl"
        style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--card-border)" }}
      >
        <p className="mb-6 text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
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
            style={{ backgroundColor: confirmColor }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Product Form Modal                                                   */
/* ------------------------------------------------------------------ */
function ProductFormModal({
  initial,
  activeCategories,
  onSave,
  onClose,
}: {
  initial?: Product;
  activeCategories: Category[];
  onSave: (data: ProductFormData, id?: string, images?: string[]) => void;
  onClose: () => void;
}) {
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [imageInput, setImageInput] = useState("");
  const [imageError, setImageError] = useState("");

  const categoryOptions = activeCategories.map((c) => c.name);

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
          badge: initial.badge ?? "",
        }
      : {
          category: categoryOptions[0] ?? "",
          badge: "",
        },
  });

  const onSubmit = (data: ProductFormData) => {
    onSave(data, initial?.id, images);
  };

  const handleAddImage = () => {
    const url = imageInput.trim();
    if (!url) {
      setImageError("Informe uma URL valida.");
      return;
    }
    if (images.includes(url)) {
      setImageError("Esta URL ja foi adicionada.");
      return;
    }
    setImages((prev) => [...prev, url]);
    setImageInput("");
    setImageError("");
  };

  const handleRemoveImage = (url: string) => {
    setImages((prev) => prev.filter((u) => u !== url));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 py-10">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-lg rounded-2xl p-6 shadow-2xl"
        style={{
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--card-border)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
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
            <input
              {...register("name")}
              placeholder="Ex: iPhone 16 Pro"
              style={inputStyle}
              autoComplete="off"
            />
            {errors.name && <p style={errorStyle}>{errors.name.message}</p>}
          </div>

          {/* Price */}
          <div>
            <label style={labelStyle}>Preco (R$) *</label>
            <input
              inputMode="numeric"
              placeholder="Ex: 9499"
              style={inputStyle}
              {...register("price", { valueAsNumber: true })}
              onInput={(e) => {
                const raw = (e.target as HTMLInputElement).value.replace(/[^0-9]/g, "");
                (e.target as HTMLInputElement).value = raw;
                const num = raw === "" ? 0 : Number(raw);
                setValue("price", num, { shouldValidate: true });
              }}
            />
            {errors.price && <p style={errorStyle}>{errors.price.message}</p>}
          </div>

          {/* Category */}
          <div>
            <label style={labelStyle}>Categoria *</label>
            <select {...register("category")} style={inputStyle}>
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && <p style={errorStyle}>{errors.category.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Descricao *</label>
            <textarea
              {...register("description")}
              placeholder="Ex: 256GB - Titanio Natural"
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
            />
            {errors.description && <p style={errorStyle}>{errors.description.message}</p>}
          </div>

          {/* Badge */}
          <div>
            <label style={labelStyle}>Badge (opcional)</label>
            <input
              {...register("badge")}
              placeholder="Ex: Novo, Popular, Destaque"
              style={inputStyle}
            />
            {errors.badge && <p style={errorStyle}>{errors.badge.message}</p>}
          </div>

          {/* Images */}
          <div>
            <label style={labelStyle}>Fotos (URLs)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={imageInput}
                onChange={(e) => {
                  setImageInput(e.target.value);
                  setImageError("");
                }}
                placeholder="https://exemplo.com/foto.webp"
                style={{ ...inputStyle, flex: 1 }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddImage();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="shrink-0 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: "var(--accent)" }}
              >
                Adicionar
              </button>
            </div>
            {imageError && <p style={errorStyle}>{imageError}</p>}
            {images.length > 0 && (
              <ul className="mt-3 flex flex-col gap-2">
                {images.map((url, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-xs"
                    style={{
                      backgroundColor: "var(--surface)",
                      border: "1px solid var(--card-border)",
                      color: "var(--muted)",
                    }}
                  >
                    <span className="truncate flex-1">{url}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(url)}
                      className="shrink-0 transition-opacity hover:opacity-70"
                      style={{ color: "#ef4444" }}
                      aria-label="Remover foto"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
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
              {initial ? "Salvar alteracoes" : "Adicionar produto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Comments Modal                                                       */
/* ------------------------------------------------------------------ */
function CommentsModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const addComment = useStore((s) => s.addComment);
  const deleteComment = useStore((s) => s.deleteComment);
  const products = useStore((s) => s.products);

  // Keep comments reactive via store
  const currentProduct = products.find((p) => p.id === product.id) ?? product;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  const onSubmit = (data: CommentFormData) => {
    addComment(product.id, { author: data.author, text: data.text });
    reset();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 py-10">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-lg rounded-2xl p-6 shadow-2xl"
        style={{
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--card-border)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
              Comentarios
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
              {currentProduct.name}
            </p>
          </div>
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

        {/* Comment list */}
        <div className="mb-6 flex flex-col gap-3">
          {currentProduct.comments.length === 0 ? (
            <p className="py-6 text-center text-sm" style={{ color: "var(--muted)" }}>
              Nenhum comentario ainda.
            </p>
          ) : (
            currentProduct.comments.map((comment: Comment) => (
              <div
                key={comment.id}
                className="rounded-xl p-4"
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--card-border)",
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                      {comment.author}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                      {comment.text}
                    </p>
                    <p className="mt-2 text-xs tabular-nums" style={{ color: "var(--muted)", opacity: 0.6 }}>
                      {new Date(comment.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteComment(product.id, comment.id)}
                    className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg transition-all hover:scale-110"
                    style={{
                      backgroundColor: "rgba(239,68,68,0.1)",
                      color: "#ef4444",
                      border: "1px solid rgba(239,68,68,0.3)",
                    }}
                    aria-label="Remover comentario"
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

        {/* Add comment form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
            Adicionar comentario
          </p>
          <div>
            <label style={labelStyle}>Autor *</label>
            <input
              {...register("author")}
              placeholder="Nome do autor"
              style={inputStyle}
              autoComplete="off"
            />
            {errors.author && <p style={errorStyle}>{errors.author.message}</p>}
          </div>
          <div>
            <label style={labelStyle}>Comentario *</label>
            <textarea
              {...register("text")}
              placeholder="Texto do comentario..."
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
            />
            {errors.text && <p style={errorStyle}>{errors.text.message}</p>}
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-5 py-2 text-sm font-medium transition-all hover:opacity-70"
              style={{ backgroundColor: "var(--surface)", color: "var(--muted)" }}
            >
              Fechar
            </button>
            <button
              type="submit"
              className="rounded-full px-6 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: "var(--accent)" }}
            >
              Publicar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Login Screen                                                         */
/* ------------------------------------------------------------------ */
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [showToken, setShowToken] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (timingSafeEqual(token, ADMIN_TOKEN)) {
      sessionStorage.setItem(SESSION_KEY, token);
      onLogin();
    } else {
      setError("Token invalido. Tente novamente.");
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
            Acesso restrito
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-2 block text-xs font-medium" style={{ color: "var(--muted)" }}>
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

/* ------------------------------------------------------------------ */
/* Products Tab                                                         */
/* ------------------------------------------------------------------ */
function ProductsTab({
  activeCategories,
}: {
  activeCategories: Category[];
}) {
  const products = useStore((s) => s.products);
  const addProduct = useStore((s) => s.addProduct);
  const updateProduct = useStore((s) => s.updateProduct);
  const deleteProduct = useStore((s) => s.deleteProduct);

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | undefined>(undefined);
  const [confirmDeactivate, setConfirmDeactivate] = useState<string | null>(null);
  const [commentsTarget, setCommentsTarget] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCat, setFilterCat] = useState("Todos");
  const [filterStatus, setFilterStatus] = useState<"todos" | "ativos" | "inativos">("todos");

  const categoryFilterOptions = useMemo(
    () => ["Todos", ...activeCategories.map((c) => c.name)],
    [activeCategories]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = filterCat === "Todos" || p.category === filterCat;
      const matchesSearch =
        searchQuery === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        filterStatus === "todos" ||
        (filterStatus === "ativos" && p.active) ||
        (filterStatus === "inativos" && !p.active);
      return matchesCat && matchesSearch && matchesStatus;
    });
  }, [products, filterCat, searchQuery, filterStatus]);

  const handleSave = useCallback(
    (data: ProductFormData, id?: string, images?: string[]) => {
      const imgList = images ?? [];
      const primaryImage = imgList.length > 0 ? imgList[0] : "";

      if (id) {
        const existing = products.find((p) => p.id === id);
        if (!existing) return;
        const updated: Product = {
          ...existing,
          name: data.name,
          price: data.price,
          category: data.category,
          description: data.description,
          badge: data.badge || undefined,
          images: imgList,
          image: primaryImage || existing.image,
        };
        updateProduct(updated);
      } else {
        addProduct({
          name: data.name,
          price: data.price,
          category: data.category,
          description: data.description,
          badge: data.badge || undefined,
          images: imgList,
          image: primaryImage,
        });
      }
      setFormOpen(false);
      setEditTarget(undefined);
    },
    [addProduct, updateProduct, products]
  );

  const handleEdit = (product: Product) => {
    setEditTarget(product);
    setFormOpen(true);
  };

  const handleToggleActive = (product: Product) => {
    if (product.active) {
      setConfirmDeactivate(product.id);
    } else {
      // Reactivate directly without confirmation
      updateProduct({ ...product, active: true });
    }
  };

  const confirmDeactivateProduct = () => {
    if (confirmDeactivate) {
      deleteProduct(confirmDeactivate);
      setConfirmDeactivate(null);
    }
  };

  const smallBtnBase: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "32px",
    width: "32px",
    borderRadius: "8px",
    transition: "all 0.15s",
    cursor: "pointer",
    border: "none",
    background: "none",
    padding: 0,
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {/* Category filter */}
        <div className="scrollbar-hide flex gap-2 overflow-x-auto">
          {categoryFilterOptions.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className="shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200"
              style={
                filterCat === cat
                  ? { backgroundColor: "var(--accent)", color: "#fff" }
                  : {
                      backgroundColor: "var(--card-bg)",
                      color: "var(--muted)",
                      border: "1px solid var(--card-border)",
                    }
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex gap-1 rounded-full p-1" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--card-border)" }}>
          {(["todos", "ativos", "inativos"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className="rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-all duration-200"
              style={
                filterStatus === s
                  ? { backgroundColor: "var(--accent)", color: "#fff" }
                  : { color: "var(--muted)" }
              }
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Search + Add button */}
        <div className="ml-auto flex items-center gap-3">
          <div className="relative">
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
              className="rounded-full py-2 pl-9 pr-4 text-sm outline-none"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--card-border)",
                color: "var(--foreground)",
                width: "200px",
              }}
            />
          </div>
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
        </div>
      </div>

      {/* Table */}
      <div
        className="overflow-hidden rounded-2xl"
        style={{ border: "1px solid var(--card-border)" }}
      >
        {/* Header */}
        <div
          className="hidden items-center gap-3 px-5 py-3 text-xs font-semibold uppercase tracking-wider md:grid"
          style={{
            backgroundColor: "var(--surface)",
            color: "var(--muted)",
            gridTemplateColumns: "48px 2fr 1fr 1fr 1fr 80px auto",
          }}
        >
          <span>Img</span>
          <span>Produto</span>
          <span>Preco</span>
          <span>Categoria</span>
          <span>Badge</span>
          <span>Status</span>
          <span className="text-right">Acoes</span>
        </div>

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
              className="flex flex-col gap-3 px-5 py-4 transition-colors hover:brightness-105 md:grid md:items-center md:gap-3"
              style={{
                gridTemplateColumns: "48px 2fr 1fr 1fr 1fr 80px auto",
                backgroundColor: i % 2 === 0 ? "var(--card-bg)" : "var(--surface)",
                borderTop: "1px solid var(--card-border)",
                opacity: product.active ? 1 : 0.55,
              }}
            >
              {/* Thumbnail */}
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold"
                style={{
                  backgroundColor: "var(--accent-soft)",
                  color: "var(--accent)",
                }}
              >
                {product.name.charAt(0)}
              </div>

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

              {/* Status */}
              <span
                className="w-fit rounded-full px-3 py-1 text-xs font-semibold"
                style={
                  product.active
                    ? { backgroundColor: "rgba(34,197,94,0.15)", color: "#22c55e" }
                    : { backgroundColor: "rgba(239,68,68,0.12)", color: "#ef4444" }
                }
              >
                {product.active ? "Ativo" : "Inativo"}
              </span>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2">
                {/* Edit */}
                <button
                  onClick={() => handleEdit(product)}
                  style={{
                    ...smallBtnBase,
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

                {/* Toggle active */}
                <button
                  onClick={() => handleToggleActive(product)}
                  style={
                    product.active
                      ? {
                          ...smallBtnBase,
                          backgroundColor: "rgba(239,68,68,0.1)",
                          color: "#ef4444",
                          border: "1px solid rgba(239,68,68,0.3)",
                        }
                      : {
                          ...smallBtnBase,
                          backgroundColor: "rgba(34,197,94,0.1)",
                          color: "#22c55e",
                          border: "1px solid rgba(34,197,94,0.3)",
                        }
                  }
                  aria-label={product.active ? "Desativar" : "Reativar"}
                >
                  {product.active ? (
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  ) : (
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </button>

                {/* Comments */}
                <button
                  onClick={() => setCommentsTarget(product)}
                  style={{
                    ...smallBtnBase,
                    backgroundColor: "var(--surface)",
                    color: "var(--muted)",
                    border: "1px solid var(--card-border)",
                    position: "relative",
                  }}
                  aria-label="Ver comentarios"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {product.comments.length > 0 && (
                    <span
                      className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white"
                      style={{ backgroundColor: "var(--accent)" }}
                    >
                      {product.comments.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      {formOpen && (
        <ProductFormModal
          initial={editTarget}
          activeCategories={activeCategories}
          onSave={handleSave}
          onClose={() => {
            setFormOpen(false);
            setEditTarget(undefined);
          }}
        />
      )}

      {confirmDeactivate && (
        <ConfirmModal
          message={`Tem certeza que deseja desativar "${products.find((p) => p.id === confirmDeactivate)?.name}"? O produto deixara de aparecer no site.`}
          confirmLabel="Desativar"
          confirmColor="#ef4444"
          onConfirm={confirmDeactivateProduct}
          onCancel={() => setConfirmDeactivate(null)}
        />
      )}

      {commentsTarget && (
        <CommentsModal
          product={commentsTarget}
          onClose={() => setCommentsTarget(null)}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Categories Tab                                                       */
/* ------------------------------------------------------------------ */
function CategoriesTab() {
  const categories = useStore((s) => s.categories);
  const products = useStore((s) => s.products);
  const addCategory = useStore((s) => s.addCategory);
  const updateCategory = useStore((s) => s.updateCategory);
  const deleteCategory = useStore((s) => s.deleteCategory);
  const reactivateCategory = useStore((s) => s.reactivateCategory);

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [confirmDeactivate, setConfirmDeactivate] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const openAdd = () => {
    setEditTarget(null);
    reset({ name: "" });
    setFormOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditTarget(cat);
    setValue("name", cat.name);
    setFormOpen(true);
  };

  const onSubmit = (data: CategoryFormData) => {
    const trimmed = data.name.trim();
    // Duplicate check (case insensitive), excluding current if editing
    const duplicate = categories.some(
      (c) =>
        c.name.toLowerCase() === trimmed.toLowerCase() &&
        c.id !== editTarget?.id
    );
    if (duplicate) {
      return; // Form-level: show error via setError if desired — handled below
    }
    if (editTarget) {
      updateCategory(editTarget.id, trimmed);
    } else {
      addCategory(trimmed);
    }
    setFormOpen(false);
    setEditTarget(null);
    reset({ name: "" });
  };

  // Count active products per category
  const productCount = useCallback(
    (catName: string) => products.filter((p) => p.category === catName).length,
    [products]
  );

  // Duplicate name check for inline error feedback
  const [dupError, setDupError] = useState("");

  const handleFormSubmit = (data: CategoryFormData) => {
    const trimmed = data.name.trim();
    const duplicate = categories.some(
      (c) =>
        c.name.toLowerCase() === trimmed.toLowerCase() &&
        c.id !== editTarget?.id
    );
    if (duplicate) {
      setDupError("Ja existe uma categoria com este nome.");
      return;
    }
    setDupError("");
    onSubmit(data);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          {categories.filter((c) => c.active).length} categoria{categories.filter((c) => c.active).length !== 1 ? "s" : ""} ativa{categories.filter((c) => c.active).length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 hover:scale-105"
          style={{ backgroundColor: "var(--accent)" }}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Adicionar categoria
        </button>
      </div>

      {/* Table */}
      <div
        className="overflow-hidden rounded-2xl"
        style={{ border: "1px solid var(--card-border)" }}
      >
        <div
          className="grid items-center gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wider"
          style={{
            backgroundColor: "var(--surface)",
            color: "var(--muted)",
            gridTemplateColumns: "2fr 80px 100px auto",
          }}
        >
          <span>Nome</span>
          <span>Produtos</span>
          <span>Status</span>
          <span className="text-right">Acoes</span>
        </div>

        {categories.length === 0 ? (
          <div
            className="py-16 text-center text-sm"
            style={{ color: "var(--muted)", backgroundColor: "var(--card-bg)" }}
          >
            Nenhuma categoria cadastrada.
          </div>
        ) : (
          categories.map((cat, i) => (
            <div
              key={cat.id}
              className="grid items-center gap-4 px-5 py-4 transition-colors hover:brightness-105"
              style={{
                gridTemplateColumns: "2fr 80px 100px auto",
                backgroundColor: i % 2 === 0 ? "var(--card-bg)" : "var(--surface)",
                borderTop: "1px solid var(--card-border)",
                opacity: cat.active ? 1 : 0.55,
              }}
            >
              <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                {cat.name}
              </span>

              <span className="text-sm tabular-nums" style={{ color: "var(--muted)" }}>
                {productCount(cat.name)}
              </span>

              <span
                className="w-fit rounded-full px-3 py-1 text-xs font-semibold"
                style={
                  cat.active
                    ? { backgroundColor: "rgba(34,197,94,0.15)", color: "#22c55e" }
                    : { backgroundColor: "rgba(239,68,68,0.12)", color: "#ef4444" }
                }
              >
                {cat.active ? "Ativa" : "Inativa"}
              </span>

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => openEdit(cat)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:scale-110"
                  style={{
                    backgroundColor: "var(--accent-soft)",
                    color: "var(--accent)",
                    border: "1px solid rgba(37,150,190,0.2)",
                  }}
                  aria-label="Editar categoria"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>

                {cat.active ? (
                  <button
                    onClick={() => setConfirmDeactivate(cat.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:scale-110"
                    style={{
                      backgroundColor: "rgba(239,68,68,0.1)",
                      color: "#ef4444",
                      border: "1px solid rgba(239,68,68,0.3)",
                    }}
                    aria-label="Desativar categoria"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={() => reactivateCategory(cat.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:scale-110"
                    style={{
                      backgroundColor: "rgba(34,197,94,0.1)",
                      color: "#22c55e",
                      border: "1px solid rgba(34,197,94,0.3)",
                    }}
                    aria-label="Reativar categoria"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit form modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
            onClick={() => {
              setFormOpen(false);
              setEditTarget(null);
              setDupError("");
              reset({ name: "" });
            }}
          />
          <div
            className="relative w-full max-w-sm rounded-2xl p-6 shadow-2xl"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
                {editTarget ? "Editar Categoria" : "Nova Categoria"}
              </h2>
              <button
                onClick={() => {
                  setFormOpen(false);
                  setEditTarget(null);
                  setDupError("");
                  reset({ name: "" });
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full transition-all hover:opacity-70"
                style={{ color: "var(--muted)" }}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
              <div>
                <label style={labelStyle}>Nome da categoria *</label>
                <input
                  {...register("name")}
                  placeholder="Ex: Acessorios"
                  style={inputStyle}
                  autoComplete="off"
                  onChange={() => setDupError("")}
                />
                {errors.name && <p style={errorStyle}>{errors.name.message}</p>}
                {dupError && <p style={errorStyle}>{dupError}</p>}
              </div>

              <div className="flex justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setFormOpen(false);
                    setEditTarget(null);
                    setDupError("");
                    reset({ name: "" });
                  }}
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
                  {editTarget ? "Salvar" : "Adicionar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDeactivate && (
        <ConfirmModal
          message={`Tem certeza que deseja desativar a categoria "${categories.find((c) => c.id === confirmDeactivate)?.name}"? Os produtos dessa categoria nao serao afetados.`}
          confirmLabel="Desativar"
          confirmColor="#ef4444"
          onConfirm={() => {
            deleteCategory(confirmDeactivate);
            setConfirmDeactivate(null);
          }}
          onCancel={() => setConfirmDeactivate(null)}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Admin Dashboard                                                      */
/* ------------------------------------------------------------------ */
function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<"produtos" | "categorias">("produtos");
  const products = useStore((s) => s.products);
  const storeCategories = useStore((s) => s.categories);

  const activeCategories = useMemo(
    () => storeCategories.filter((c) => c.active),
    [storeCategories]
  );

  const activeProductCount = products.filter((p) => p.active).length;
  const inactiveProductCount = products.filter((p) => !p.active).length;

  const tabStyle = (tab: "produtos" | "categorias"): React.CSSProperties =>
    activeTab === tab
      ? {
          backgroundColor: "var(--accent)",
          color: "#fff",
          borderRadius: "999px",
          padding: "8px 22px",
          fontSize: "14px",
          fontWeight: 600,
          transition: "all 0.2s",
          cursor: "pointer",
          border: "none",
        }
      : {
          backgroundColor: "transparent",
          color: "var(--muted)",
          borderRadius: "999px",
          padding: "8px 22px",
          fontSize: "14px",
          fontWeight: 500,
          transition: "all 0.2s",
          cursor: "pointer",
          border: "none",
        };

  return (
    <div style={{ backgroundColor: "var(--background)", minHeight: "100vh" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-40"
        style={{
          backgroundColor: "color-mix(in srgb, var(--background) 90%, transparent)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
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
                {activeProductCount} ativo{activeProductCount !== 1 ? "s" : ""} / {inactiveProductCount} inativo{inactiveProductCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="rounded-full px-4 py-2.5 text-sm font-medium transition-all hover:opacity-70"
            style={{
              backgroundColor: "var(--card-bg)",
              color: "var(--muted)",
              border: "1px solid var(--card-border)",
            }}
          >
            Sair
          </button>
        </div>

        {/* Tabs */}
        <div className="mx-auto max-w-7xl px-4 pb-3 sm:px-6">
          <div
            className="inline-flex gap-1 rounded-full p-1"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--card-border)" }}
          >
            <button style={tabStyle("produtos")} onClick={() => setActiveTab("produtos")}>
              Produtos
            </button>
            <button style={tabStyle("categorias")} onClick={() => setActiveTab("categorias")}>
              Categorias
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {activeTab === "produtos" && (
          <ProductsTab activeCategories={activeCategories} />
        )}
        {activeTab === "categorias" && <CategoriesTab />}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */
export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY) ?? "";
    setAuthenticated(timingSafeEqual(stored, ADMIN_TOKEN));
  }, []);

  const handleLogin = () => setAuthenticated(true);

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthenticated(false);
  };

  if (authenticated === null) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: "var(--background)" }}
      >
        <div
          className="h-10 w-10 animate-spin rounded-full border-2"
          style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  if (!authenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}
