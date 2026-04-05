# Agente: Painel Administrativo

Responsavel pelo painel administrativo completo: autenticacao, dashboard, CRUD de produtos e categorias, e gerenciamento de comentarios.

## Escopo

- Pagina principal: `src/app/admin/page.tsx`
- Estado global (produtos, categorias, comentarios): `src/store/useStore.ts`
- Tipos exportados: `Product`, `Category`, `Comment` (de `useStore.ts`)

## Arquitetura do arquivo

O arquivo `src/app/admin/page.tsx` e um Client Component (`"use client"`) composto por sub-componentes internos montados em sequencia:

```
AdminPage                  — root: gerencia autenticacao (null | false | true)
  LoginScreen              — tela de login com input de token
  AdminDashboard           — layout com header sticky e tabs
    ProductsTab            — CRUD de produtos com filtros e tabela
      ProductFormModal     — modal de criacao/edicao de produto
      CommentsModal        — modal de listagem e adicao de comentarios
      ConfirmModal         — modal de confirmacao de desativacao
    CategoriesTab          — CRUD de categorias com tabela
      ConfirmModal         — modal de confirmacao de desativacao
```

## Autenticacao

- Token hardcoded na constante `ADMIN_TOKEN` (60 caracteres):
  `A1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6Q7r8S9t0U1v2W3x4Y5z6A7b8C9d0`
- Chave de sessao: `SESSION_KEY = "admin_token"`
- Persistencia: `sessionStorage` — expira ao fechar a aba
- Comparacao: funcao `timingSafeEqual(a, b)` — compara caractere a caractere com XOR bitwise para evitar timing attacks, mesmo quando os comprimentos diferem
- Fluxo de hidratacao: `authenticated` inicia como `null`, `useEffect` le o sessionStorage e seta `true` ou `false`; enquanto `null`, exibe spinner de carregamento

```typescript
const ADMIN_TOKEN = "A1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6Q7r8S9t0U1v2W3x4Y5z6A7b8C9d0";
const SESSION_KEY = "admin_token";

function timingSafeEqual(a: string, b: string): boolean {
  // Itera sempre pelo comprimento maximo para nao vazar timing por length
  let diff = 0;
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  if (a.length !== b.length) return false;
  return diff === 0;
}
```

- Login: `sessionStorage.setItem(SESSION_KEY, token)` + `setAuthenticated(true)`
- Logout: `sessionStorage.removeItem(SESSION_KEY)` + `setAuthenticated(false)`

## Schemas Zod

### Produto (`productSchema`)

```typescript
z.object({
  name:        z.string().min(2).max(100),
  price:       z.number().positive().max(999999).refine(Number.isFinite),
  category:    z.string().min(1),
  description: z.string().min(3).max(500),
  badge:       z.string().max(20).optional(),
})
```

### Categoria (`categorySchema`)

```typescript
z.object({
  name: z.string().min(2).max(50),
})
```

### Comentario (`commentSchema`)

```typescript
z.object({
  author: z.string().min(2).max(100),
  text:   z.string().min(3).max(500),
})
```

Todos os formularios usam `useForm` com `zodResolver`. Erros sao exibidos inline com `errorStyle` (font-size 11px, color `#ef4444`).

## Interfaces de dados

```typescript
interface Comment {
  id:        string;   // crypto.randomUUID() com fallback
  author:    string;
  text:      string;
  createdAt: string;   // ISO string
}

interface Product {
  id:          string;
  name:        string;
  price:       number;
  image:       string;   // URL da imagem primaria (primeiro item de images[])
  images:      string[]; // Lista de URLs de fotos
  category:    string;
  description: string;
  badge?:      string;
  comments:    Comment[];
  active:      boolean;  // Soft delete: false = inativo, nunca removido
  createdAt:   string;
  updatedAt:   string;
}

interface Category {
  id:     string;
  name:   string;
  active: boolean; // Soft delete: false = inativa, nunca removida
}
```

## Actions do store utilizadas

```typescript
// Produtos
addProduct(product: Omit<Product, "id" | "comments" | "active" | "createdAt" | "updatedAt">): void
updateProduct(product: Product): void
deleteProduct(productId: string): void   // Soft delete: seta active = false

// Categorias
addCategory(name: string): void
updateCategory(id: string, name: string): void
deleteCategory(id: string): void          // Soft delete: seta active = false
reactivateCategory(id: string): void      // Seta active = true

// Comentarios
addComment(productId: string, comment: Omit<Comment, "id" | "createdAt">): void
deleteComment(productId: string, commentId: string): void
```

IDs gerados internamente pelo store com `generateId()`:

```typescript
function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
```

## Componentes internos

### ConfirmModal

Modal de confirmacao reutilizavel. Props:

```typescript
{
  message:       string;
  confirmLabel?: string;   // default: "Confirmar"
  confirmColor?: string;   // default: "#ef4444"
  onConfirm:     () => void;
  onCancel:      () => void;
}
```

Overlay com `rgba(0,0,0,0.65)` e `backdropFilter: blur(4px)`. Clicar no overlay aciona `onCancel`.

### ProductFormModal

Modal de criacao e edicao de produto. Props:

```typescript
{
  initial?:         Product;           // undefined = criacao, preenchido = edicao
  activeCategories: Category[];        // apenas categorias com active = true
  onSave: (data: ProductFormData, id?: string, images?: string[]) => void;
  onClose: () => void;
}
```

Campos do formulario:
- **Nome** — input text, min 2 / max 100 chars
- **Preco (R$)** — `inputMode="numeric"`, aceita apenas digitos (replace `/[^0-9]/g`), registrado com `valueAsNumber: true`, max 999999
- **Categoria** — `<select>` populado com `activeCategories.map(c => c.name)`
- **Descricao** — `<textarea>` resizavel, min 3 / max 500 chars
- **Badge** — input text opcional, max 20 chars
- **Fotos (URLs)** — estado local `images: string[]`; input separado com botao "Adicionar"; Enter no input tambem adiciona; URLs duplicadas sao rejeitadas; lista renderizada abaixo com botao de remocao por item

Ao salvar:
- `image` = `images[0] ?? ""` (ou `existing.image` se edicao sem novas fotos)
- `badge: data.badge || undefined` (string vazia vira undefined)

### CommentsModal

Modal para listar e adicionar comentarios de um produto. Props:

```typescript
{
  product: Product;
  onClose: () => void;
}
```

- Lista de comentarios e reativa: usa `products.find(p => p.id === product.id)` para refletir mudancas do store em tempo real
- Cada comentario exibe: autor, texto, data formatada com `toLocaleDateString("pt-BR", { day, month, year, hour, minute })`
- Botao de deletar por comentario aciona `deleteComment(product.id, comment.id)` diretamente (sem confirmacao)
- Formulario de adicao com campos `author` e `text`, validados pelo `commentSchema`; reset apos submit

### LoginScreen

Tela de login a pagina inteira. Caracteristicas:
- Input `type="password"` com toggle para `type="text"` via botao com icone olho
- Contador de caracteres `{token.length}/60` exibido abaixo do input
- `maxLength={60}` no input
- Borda do input muda para `#ef4444` quando ha erro de token invalido
- `autoComplete="off"` no input
- Submit valida com `timingSafeEqual`; erro exibido como texto abaixo do input

### AdminDashboard

Layout principal apos autenticacao. Caracteristicas:
- Header sticky com `z-40`, `backdropFilter: blur(20px)`, `color-mix(in srgb, var(--background) 90%, transparent)` como fundo
- Exibe contador: "{N} ativo(s) / {M} inativo(s)" baseado em `products.filter(p => p.active).length`
- Botao "Sair" aciona `onLogout`
- Tabs "Produtos" e "Categorias" com estilo pill; tab ativa recebe `backgroundColor: "var(--accent)"`, inativa e transparente
- `activeCategories` derivada via `useMemo`: `storeCategories.filter(c => c.active)` — passada para `ProductsTab`

### ProductsTab

Aba principal de gerenciamento de produtos. Estado local:

| State | Tipo | Descricao |
|---|---|---|
| `formOpen` | boolean | Modal de formulario aberto |
| `editTarget` | `Product \| undefined` | Produto em edicao (undefined = criacao) |
| `confirmDeactivate` | `string \| null` | ID do produto aguardando confirmacao |
| `commentsTarget` | `Product \| null` | Produto com modal de comentarios aberto |
| `searchQuery` | string | Texto de busca por nome |
| `filterCat` | string | Categoria selecionada no filtro |
| `filterStatus` | `"todos" \| "ativos" \| "inativos"` | Filtro de status |

Logica de filtragem (`filteredProducts` via `useMemo`):
1. `matchesCat`: `filterCat === "Todos"` ou `p.category === filterCat`
2. `matchesSearch`: busca case-insensitive em `p.name`
3. `matchesStatus`: correspondencia com `p.active`

Toolbar:
- Pills de categoria (scrollavel horizontalmente, sem scrollbar visivel)
- Segmented control de status: Todos / Ativos / Inativos
- Input de busca (width 200px) com icone de lupa
- Botao "Adicionar produto"

Tabela (grid CSS):
- Colunas desktop: `48px 2fr 1fr 1fr 1fr 80px auto`
- Header: Img / Produto / Preco / Categoria / Badge / Status / Acoes
- Mobile: layout em coluna (flex)
- Zebrado: linhas pares `--card-bg`, impares `--surface`
- Produtos inativos: `opacity: 0.55`
- Thumbnail: primeira letra do nome em `--accent` sobre `--accent-soft`
- Preco formatado: `price.toLocaleString("pt-BR")` prefixado com "R$"
- Badge de status: verde `rgba(34,197,94,0.15)` / vermelho `rgba(239,68,68,0.12)`

Acoes por linha:
- **Editar** (azul accent) — abre `ProductFormModal` com produto pre-preenchido
- **Toggle ativo/inativo** — desativar exige `ConfirmModal`; reativar e direto (`updateProduct({ ...product, active: true })`)
- **Comentarios** (cinza) — abre `CommentsModal`; exibe badge com contagem quando `comments.length > 0`

### CategoriesTab

Aba de gerenciamento de categorias. Usa um unico `useForm` para criacao e edicao (reaproveitado via `reset` e `setValue`).

Estado local:

| State | Tipo | Descricao |
|---|---|---|
| `formOpen` | boolean | Modal de formulario aberto |
| `editTarget` | `Category \| null` | Categoria em edicao |
| `confirmDeactivate` | `string \| null` | ID aguardando confirmacao |
| `dupError` | string | Mensagem de erro de duplicata |

Validacao de duplicata (alem do Zod):
- Compara `c.name.toLowerCase() === trimmed.toLowerCase()` excluindo o proprio item em edicao (`c.id !== editTarget?.id`)
- Erro de duplicata exibido via `dupError` state, limpo ao digitar

Tabela (grid CSS): `2fr 80px 100px auto`
- Colunas: Nome / Produtos / Status / Acoes
- Coluna "Produtos" exibe contagem de todos os produtos da categoria (ativos e inativos)
- Categorias inativas: `opacity: 0.55`
- Reativacao e direta (sem confirmacao); desativacao exige `ConfirmModal`

Modal de formulario: inline no proprio `CategoriesTab` (nao e componente separado), campo unico "Nome da categoria".

## Estilos compartilhados

```typescript
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
```

Botoes de acao pequenos usam `smallBtnBase` (32x32px, borderRadius 8px).

Todos os modais: overlay `rgba(0,0,0,0.65)` + `backdropFilter: blur(4px)`; painel com `backdropFilter: blur(20px)` e `WebkitBackdropFilter: blur(20px)`.

## Regras

- Nunca usar `innerHTML` ou `dangerouslySetInnerHTML`
- IDs sempre gerados com `crypto.randomUUID()` com fallback `Date.now() + Math.random()`
- `price` deve ser `number`, positivo, max 999999, `inputMode="numeric"`, aceita apenas digitos via `replace(/[^0-9]/g, "")`
- Todas as strings sanitizadas com `.trim()` antes de persistir (especialmente em categorias)
- Soft delete obrigatorio: nunca remover produto ou categoria do array — setar `active = false`
- Reativacao de produto: `updateProduct({ ...product, active: true })` diretamente
- Reativacao de categoria: `reactivateCategory(id)` action do store
- Desativacao de produto e categoria sempre precedida de `ConfirmModal`
- `activeCategories` (apenas `active = true`) deve ser passada para o `ProductFormModal` para popular o `<select>` de categoria
- Token nunca exibido em logs, estados derivados ou JSX além do próprio input de login

## Skills

- **Alterar token:** Substituir a constante `ADMIN_TOKEN` em `src/app/admin/page.tsx` — manter exatamente 60 caracteres para preservar o `maxLength` e o placeholder do input
- **Adicionar campo ao produto:** Atualizar `productSchema`, `ProductFormData`, o JSX do `ProductFormModal`, a logica `handleSave` em `ProductsTab`, a interface `Product` em `useStore.ts` e a action `addProduct`
- **Nova coluna na tabela:** Ajustar `gridTemplateColumns` no header e nas linhas de `ProductsTab` simultaneamente
- **Filtro adicional:** Adicionar estado local em `ProductsTab`, condicao no `filteredProducts` (useMemo) e controle de UI na toolbar
- **Persistencia de sessao:** Trocar `sessionStorage` por `localStorage` nas chamadas `setItem`, `getItem` e `removeItem` em `LoginScreen` e `AdminPage`
- **Novo campo de comentario:** Atualizar `commentSchema`, `CommentFormData`, o JSX do `CommentsModal` e a action `addComment` no store
- **Adicionar dashboard de metricas:** Inserir cards de resumo entre o header e as tabs no `AdminDashboard` (total de produtos, total de categorias, total de comentarios)
- **Paginacao na tabela:** Adicionar estado `page` e `pageSize` em `ProductsTab`; fatiar `filteredProducts` com `.slice(page * pageSize, (page + 1) * pageSize)` e renderizar controles de paginacao abaixo da tabela
- **Confirmacao de reativacao de produto:** Envolver `updateProduct({ ...product, active: true })` em um segundo `ConfirmModal` com mensagem adequada
- **Ordenacao de colunas:** Adicionar estado `sortBy` e `sortDir` em `ProductsTab`; aplicar `.sort()` sobre `filteredProducts` antes de renderizar; adicionar indicadores visuais nos headers clicaveis
