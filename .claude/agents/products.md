# Agente: Catalogo de Produtos

Responsavel pelo catalogo, grid de produtos, carrossel e sistema de filtros.

## Escopo

- Dados iniciais: `src/data/products.ts` (exporta `defaultProducts` e `categories`)
- Grid e carrossel (home): `src/components/ProductGrid.tsx`
- Pagina dedicada: `src/app/produtos/page.tsx`
- Tipos e estado: `src/store/useStore.ts` (interface `Product`, arrays `products` e `categories`)
- Estado de filtros globais: `src/store/useStore.ts` (searchQuery, activeCategory)

## Regras

- Produtos vem exclusivamente do Zustand store via `useStore((s) => s.products)` — nunca importar o array direto
- Filtro `p.active === true` e obrigatorio em TODAS as views publicas antes de exibir qualquer produto
- Categorias vem do store via `useStore((s) => s.categories)`, filtradas por `c.active === true`, mapeadas para `c.name`
- "Todos" deve ser sempre o primeiro item na lista de categorias das tabs — concatenar antes dos nomes do store
- O carrossel (home) exibe 3 itens visiveis com wrapping circular
- Auto-rotacao a cada 4s, pausa no hover, pausa quando ha item no carrinho, resume no mouse leave
- Animacao de troca: GSAP `fromTo` com opacity 0.5 -> 1, stagger 0.05, ease power2.out
- Filtro de busca compara contra `name` e `description` (case-insensitive)
- Quando categoria e "Todos" na home, exibe carrossel unico com todos os produtos ativos filtrados
- Cards tem hover `scale[1.03]` e badge opcional (canto superior esquerdo)
- O preco e formatado com `toLocaleString("pt-BR")`
- Grid de /produtos: responsivo 1 coluna mobile, 2 tablet (sm), 3 desktop (lg), 4 wide (xl)

## Estrutura de dados

```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images: string[];
  category: string;
  description: string;
  badge?: string;        // "Novo", "Popular", "Destaque", "Mais vendido"
  comments: string[];
  active: boolean;
  createdAt: string;     // ISO string
  updatedAt: string;     // ISO string
}
```

## Dados iniciais

- `src/data/products.ts` exporta `defaultProducts` (alias de `products`) e `categories`
- `defaultProducts` serve como valor inicial do store — todos os produtos tem `active: true`
- `categories` em `products.ts` lista nomes em texto; as categorias do store sao objetos com `{ name, active }`
- `createdAt` e `updatedAt` sao gerados com `new Date().toISOString()` no momento do build

## Componentes

### ProductGrid (home, `src/components/ProductGrid.tsx`)
- Secao `#vitrine` com titulo, link "Ver todos os produtos" -> `/produtos`, tabs de categoria (sticky), barra de busca e carrossel unico
- Tabs usam `setActiveCategory` e `setSearchQuery` do store global
- Sticky detectado via IntersectionObserver sobre `#tabs-sentinel`, ativa blur/border no header de tabs
- `ProductCard`: card individual com placeholder (primeira letra), nome, descricao, preco, controles de quantidade (decrement/remove) e botao Pedir
- `SingleCarousel`: carrossel com half-window de itens ao redor do centro, setas, dots e counter "N / total"

### ProdutosPage (`src/app/produtos/page.tsx`)
- Pagina completa com `Navbar`, `Footer` e `WhatsAppButton`
- Estado local de `activeCategory` e `searchQuery` (independente do store global)
- Hero com breadcrumb, titulo e contador de produtos ativos
- Filtros sticky com tabs de categoria e barra de busca
- Grid CSS com `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- `ProductCardGrid`: variante vertical do card com area de imagem maior, label de categoria, botao "Pedir pelo WhatsApp" quando item ja esta no carrinho

## Skills

- **Adicionar produto:** Inserir novo item em `defaultProducts` em `products.ts` seguindo a interface; `active: true` e obrigatorio
- **Nova categoria:** Adicionar objeto `{ name, active: true }` no array de categorias do store e criar produtos associados em `products.ts`
- **Desativar produto:** Setar `active: false` no item em `products.ts` ou via store — sera ocultado em todas as views publicas automaticamente
- **Customizar card:** Modificar `ProductCard` (carrossel) ou `ProductCardGrid` (pagina /produtos) mantendo a animacao GSAP de bounce no addToCart
- **Imagens reais:** Substituir o placeholder (primeira letra) por `<Image>` do Next.js usando `product.image` ou itens de `product.images[]`
- **Ajustar carrossel:** Modificar tempo de auto-rotacao (4000ms), quantidade de itens visiveis (half = floor(min(total,7)/2)) ou animacao de transicao no `useEffect` de `centerIndex`
- **Sticky tabs:** O sistema de tabs usa IntersectionObserver com `rootMargin: "-1px 0px 0px 0px"` — ajustar se necessario
