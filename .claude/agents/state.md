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

## Shape do Store

```typescript
interface StoreState {
  // State
  cart: CartItem[]           // Itens no carrinho
  searchQuery: string        // Texto da busca de produtos
  activeCategory: string     // Categoria selecionada ("Todos" default)
  contactOpen: boolean       // Modal de contato aberto/fechado
  theme: "light" | "dark"   // Tema ativo

  // Cart actions
  addToCart(product: Product): void
  removeFromCart(productId: string): void
  clearCart(): void

  // UI actions
  setSearchQuery(query: string): void
  setActiveCategory(category: string): void
  setContactOpen(open: boolean): void

  // Theme actions
  toggleTheme(): void
  initTheme(): void

  // Derived
  cartCount(): number
  generateWhatsAppLink(): string
}
```

## Interfaces

```typescript
interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  description: string
  badge?: string
}

interface CartItem {
  product: Product
  quantity: number
}
```

## Skills

- **Novo state:** Adicionar campo ao `StoreState`, valor inicial e action correspondente
- **Novo selector derivado:** Criar funcao que usa `get()` para computar valor a partir do state
- **Persistencia:** Adicionar middleware `persist` do Zustand para campos especificos (ex: carrinho)
- **Middleware:** Adicionar `devtools` para debug ou `immer` para mutacoes simplificadas
- **Dividir store:** Se o store crescer demais, criar slices com `StateCreator` do Zustand
- **Novo consumidor:** Ao criar componente que usa state, importar `useStore` com selector especifico
- **Testar store:** Criar testes unitarios para actions usando `useStore.getState()` e `useStore.setState()`
