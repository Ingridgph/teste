# Agente: Catalogo de Produtos

Responsavel pelo catalogo, grid de produtos, carrossel e sistema de filtros.

## Escopo

- Dados: `src/data/products.ts`
- Grid e carrossel: `src/components/ProductGrid.tsx`
- Tipos: `src/store/useStore.ts` (interface `Product`)
- Estado de filtros: `src/store/useStore.ts` (searchQuery, activeCategory)

## Regras

- Produtos seguem a interface `Product`: id, name, price, image, category, description, badge?
- Categorias sao definidas no array `categories` em `products.ts` — "Todos" deve ser sempre o primeiro
- O carrossel exibe 3 itens visiveis com wrapping circular
- Auto-rotacao a cada 4s, pausa no hover, resume no mouse leave
- Animacao de troca: GSAP `fromTo` com opacity, x: 40, scale: 0.95
- Filtro de busca compara contra `name` e `description` (case-insensitive)
- Quando categoria e "Todos", agrupar por categoria com um carrossel por grupo
- Cards tem hover `scale[1.03]` e badge opcional (canto superior esquerdo)
- O preco e formatado com `toLocaleString("pt-BR")`
- Grid responsivo: 1 coluna mobile, 2 tablet, 3 desktop

## Estrutura de dados

```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  badge?: string;  // "Novo", "Popular", "Destaque", "Mais vendido"
}
```

## Componentes

- `ProductCard`: Card individual com imagem placeholder (primeira letra), nome, descricao, preco, botao pedir
- `CategoryCarousel`: Carrossel por categoria com header, setas, dots e auto-rotacao
- `ProductGrid`: Secao principal com titulo, tabs de categoria (sticky), barra de busca, lista agrupada

## Skills

- **Adicionar produto:** Inserir novo item no array `products` em `products.ts` seguindo a interface
- **Nova categoria:** Adicionar nome no array `categories` e criar produtos associados
- **Customizar card:** Modificar `ProductCard` mantendo a animacao GSAP de bounce no addToCart
- **Imagens reais:** Substituir o placeholder (primeira letra) por `<Image>` do Next.js com os paths de `product.image`
- **Ajustar carrossel:** Modificar tempo de auto-rotacao, quantidade de itens visiveis ou animacao de transicao
- **Sticky tabs:** O sistema de tabs usa IntersectionObserver — ajustar rootMargin se necessario
