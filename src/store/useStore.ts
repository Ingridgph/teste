import { create } from "zustand";
import { products as defaultProducts, categories as defaultCategoryNames } from "@/data/products";

export interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images: string[];
  category: string;
  description: string;
  badge?: string;
  comments: Comment[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  active: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

interface StoreState {
  cart: CartItem[];
  searchQuery: string;
  activeCategory: string;
  contactOpen: boolean;
  theme: "light" | "dark";
  products: Product[];
  categories: Category[];

  addToCart: (product: Product) => void;
  decrementFromCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  setSearchQuery: (query: string) => void;
  setActiveCategory: (category: string) => void;
  setContactOpen: (open: boolean) => void;
  toggleTheme: () => void;
  initTheme: () => void;
  cartCount: () => number;
  generateWhatsAppLink: () => string;

  addProduct: (product: Omit<Product, "id" | "comments" | "active" | "createdAt" | "updatedAt"> & { badge?: string }) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;

  addCategory: (name: string) => void;
  updateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
  reactivateCategory: (id: string) => void;

  addComment: (productId: string, comment: Omit<Comment, "id" | "createdAt">) => void;
  deleteComment: (productId: string, commentId: string) => void;
}

export const WHATSAPP_NUMBER = "5500000000000";
const THEME_STORAGE_KEY = "store-theme";

function getSavedTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "dark";
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(theme: "light" | "dark", animate = false) {
  if (typeof document === "undefined") return;
  if (animate) {
    document.documentElement.classList.add("theme-transition");
    document.documentElement.setAttribute("data-theme", theme);
    setTimeout(() => document.documentElement.classList.remove("theme-transition"), 600);
  } else {
    document.documentElement.setAttribute("data-theme", theme);
  }
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

const initialCategories: Category[] = defaultCategoryNames
  .filter((name) => name !== "Todos")
  .map((name) => ({
    id: generateId(),
    name,
    active: true,
  }));

export const useStore = create<StoreState>((set, get) => ({
  cart: [],
  searchQuery: "",
  activeCategory: "Todos",
  contactOpen: false,
  theme: "dark",
  products: defaultProducts,
  categories: initialCategories,

  initTheme: () => {
    const saved = getSavedTheme();
    applyTheme(saved);
    set({ theme: saved });
  },

  addToCart: (product) =>
    set((state) => {
      const existing = state.cart.find((item) => item.product.id === product.id);
      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return { cart: [...state.cart, { product, quantity: 1 }] };
    }),

  decrementFromCart: (productId) =>
    set((state) => {
      const existing = state.cart.find((item) => item.product.id === productId);
      if (!existing) return state;
      if (existing.quantity <= 1) {
        return { cart: state.cart.filter((item) => item.product.id !== productId) };
      }
      return {
        cart: state.cart.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ),
      };
    }),

  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.product.id !== productId),
    })),

  clearCart: () => set({ cart: [] }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setActiveCategory: (category) => set({ activeCategory: category }),

  setContactOpen: (open) => set({ contactOpen: open }),

  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "dark" ? "light" : "dark";
      applyTheme(newTheme, true);
      return { theme: newTheme };
    }),

  cartCount: () => get().cart.reduce((acc, item) => acc + item.quantity, 0),

  generateWhatsAppLink: () => {
    const { cart } = get();
    if (cart.length === 0) {
      return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        "Ol\u00e1! Gostaria de saber mais sobre os produtos."
      )}`;
    }
    const items = cart
      .map(
        (item) =>
          `${item.quantity}x ${item.product.name} - R$${item.product.price.toLocaleString("pt-BR")}`
      )
      .join("\n");
    const total = cart.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
    const message = `Ol\u00e1! Tenho interesse nestes itens que vi no site:\n\n${items}\n\nTotal: R$${total.toLocaleString("pt-BR")}\n\nPodemos negociar?`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  },

  addProduct: (productData) => {
    const now = new Date().toISOString();
    const images = productData.images ?? [];
    const image = productData.image || (images.length > 0 ? images[0] : "");
    const product: Product = {
      id: generateId(),
      name: productData.name.trim(),
      price: productData.price,
      image,
      images,
      category: productData.category.trim(),
      description: productData.description.trim(),
      badge: productData.badge ? productData.badge.trim() : undefined,
      comments: [],
      active: true,
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ products: [...state.products, product] }));
  },

  updateProduct: (product) => {
    const now = new Date().toISOString();
    const updated: Product = {
      ...product,
      name: product.name.trim(),
      description: product.description.trim(),
      category: product.category.trim(),
      badge: product.badge ? product.badge.trim() : undefined,
      updatedAt: now,
    };
    set((state) => ({
      products: state.products.map((p) => (p.id === updated.id ? updated : p)),
    }));
  },

  deleteProduct: (productId) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId ? { ...p, active: false, updatedAt: new Date().toISOString() } : p
      ),
    })),

  addCategory: (name) => {
    const trimmed = name.trim();
    const category: Category = {
      id: generateId(),
      name: trimmed,
      active: true,
    };
    set((state) => ({ categories: [...state.categories, category] }));
  },

  updateCategory: (id, name) => {
    const trimmed = name.trim();
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === id ? { ...c, name: trimmed } : c
      ),
    }));
  },

  deleteCategory: (id) =>
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === id ? { ...c, active: false } : c
      ),
    })),

  reactivateCategory: (id) =>
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === id ? { ...c, active: true } : c
      ),
    })),

  addComment: (productId, comment) => {
    const now = new Date().toISOString();
    const newComment: Comment = {
      id: generateId(),
      author: comment.author.trim(),
      text: comment.text.trim(),
      createdAt: now,
    };
    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId
          ? { ...p, comments: [...p.comments, newComment], updatedAt: now }
          : p
      ),
    }));
  },

  deleteComment: (productId, commentId) => {
    const now = new Date().toISOString();
    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId
          ? {
              ...p,
              comments: p.comments.filter((c) => c.id !== commentId),
              updatedAt: now,
            }
          : p
      ),
    }));
  },
}));
