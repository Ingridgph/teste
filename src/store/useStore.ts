import { create } from "zustand";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface StoreState {
  cart: CartItem[];
  searchQuery: string;
  activeCategory: string;
  contactOpen: boolean;
  theme: "light" | "dark";
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

export const useStore = create<StoreState>((set, get) => ({
  cart: [],
  searchQuery: "",
  activeCategory: "Todos",
  contactOpen: false,
  theme: "dark",

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
        "Ol\u00e1! Gostaria de saber mais sobre os produtos da Noleto iPhones."
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
}));
