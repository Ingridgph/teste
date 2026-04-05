# Agente: Estado Global (Zustand)

Responsavel pelo gerenciamento de estado global da aplicacao.

## Escopo

- Store principal: `src/store/useStore.ts`
- Consumidores: todos os componentes client-side que usam `useStore`

## Regras

- Unico store centralizado criado com `create<StoreState>()`
- Acessar state via selectors para evitar re-renders desnecessarios: `useStore((s) => s.cart)`
- Actions modificam o state via `set()` — nunca mutar diretamente
- Valores derivados (cartCount, generateWhatsAppLink) usam `get()` dentro da action
- Funcoes que acessam `window`, `localStorage` ou `document` devem verificar `typeof window !== "undefined"`
- `applyTheme()` manipula o DOM diretamente (setAttribute no html) — isso e intencional para performance
- `deleteProduct` e `deleteCategory` sao soft deletes — setam `active: false` em vez de remover o registro
- `generateId()` usa `crypto.randomUUID()` com fallback para `Date.now() + Math.random()` (compatibilidade SSR)
- `WHATSAPP_NUMBER` e exportado para uso em outros modulos
- `THEME_STORAGE_KEY` e constante interna usada por `getSavedTheme()` e `applyTheme()`

## Shape do Store

```typescript
interface StoreState {
  // State
  cart: CartItem[]           // Itens no carrinho
  searchQuery: string        // Texto da busca de produtos
  activeCategory: string     // Categoria selecionada ("Todos" default)
  contactOpen: boolean       // Modal de contato aberto/fechado
  theme: "light" | "dark"   // Tema ativo
  products: Product[]        // Catalogo completo (incluindo inativos)
  categories: Category[]     // Lista de categorias (incluindo inativas)

  // Cart actions
  addToCart(product: Product): void
  decrementFromCart(productId: string): void
  removeFromCart(productId: string): void
  clearCart(): void

  // UI actions
  setSearchQuery(query: string): void
  setActiveCategory(category: string): void
  setContactOpen(open: boolean): void

  // Theme actions
  toggleTheme(): void
  initTheme(): void

  // Product actions
  addProduct(product: Omit<Product, "id" | "comments" | "active" | "createdAt" | "updatedAt"> & { badge?: string }): void
  updateProduct(product: Product): void
  deleteProduct(productId: string): void        // soft delete: active = false

  // Category actions
  addCategory(name: string): void
  updateCategory(id: string, name: string): void
  deleteCategory(id: string): void              // soft delete: active = false
  reactivateCategory(id: string): void

  // Comment actions
  addComment(productId: string, comment: Omit<Comment, "id" | "createdAt">): void
  deleteComment(productId: string, commentId: string): void

  // Derived
  cartCount(): number
  generateWhatsAppLink(): string
}
```

## Interfaces

```typescript
interface Comment {
  id: string
  author: string
  text: string
  createdAt: string   // ISO 8601
}

interface Product {
  id: string
  name: string
  price: number
  image: string       // imagem principal (thumbnail)
  images: string[]    // galeria de imagens
  category: string
  description: string
  badge?: string
  comments: Comment[]
  active: boolean     // false = soft deleted
  createdAt: string   // ISO 8601
  updatedAt: string   // ISO 8601
}

interface Category {
  id: string
  name: string
  active: boolean     // false = soft deleted
}

interface CartItem {
  product: Product
  quantity: number
}
```

## Exportacoes do modulo

```typescript
export const WHATSAPP_NUMBER: string   // numero no formato internacional sem "+"
export interface Comment { ... }
export interface Product { ... }
export interface Category { ... }
export interface CartItem { ... }
export const useStore: StoreApi<StoreState>
```

## Skills

- **Novo state:** Adicionar campo ao `StoreState`, valor inicial e action correspondente
- **Novo selector derivado:** Criar funcao que usa `get()` para computar valor a partir do state
- **Persistencia:** Adicionar middleware `persist` do Zustand para campos especificos (ex: carrinho)
- **Middleware:** Adicionar `devtools` para debug ou `immer` para mutacoes simplificadas
- **Dividir store:** Se o store crescer demais, criar slices com `StateCreator` do Zustand
- **Novo consumidor:** Ao criar componente que usa state, importar `useStore` com selector especifico
- **Testar store:** Criar testes unitarios para actions usando `useStore.getState()` e `useStore.setState()`
- **Filtrar ativos:** Ao consumir products ou categories, filtrar por `active === true` nos componentes — o store guarda todos os registros
