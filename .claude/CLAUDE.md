# Projeto: E-commerce Landing Page Template

Template premium de loja virtual com experiencia interativa construido com Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, GSAP, Three.js e Zustand.

## Regras Gerais

- Idioma do projeto: Portugues do Brasil (pt-BR)
- Sempre respeitar o design system definido via CSS Variables em `src/app/globals.css`
- Nunca hardcodar cores — usar sempre os tokens (`--background`, `--foreground`, `--accent`, etc.)
- Componentes client-side devem ter `"use client"` no topo
- Manter compatibilidade com os dois temas (light/dark)
- Nao adicionar dependencias sem justificativa clara
- Este e um template comercializavel — nunca incluir nomes de empresas ou marcas especificas no codigo
- Usar path alias `@/` para imports (configurado em tsconfig.json)

## Estrutura

```
src/app/          -> Paginas e layout (App Router)
src/components/   -> Componentes React reutilizaveis
src/data/         -> Dados estaticos (catalogo de produtos)
src/hooks/        -> Custom hooks
src/store/        -> Estado global (Zustand)
```

## Comandos

- `npm run dev` — desenvolvimento
- `npm run build` — build producao
- `npm run lint` — ESLint

## Agentes Especializados

Este projeto utiliza agentes especializados por funcionalidade. Consulte `.claude/agents/` para instrucoes detalhadas de cada dominio:

- `theme.md` — Sistema de temas (light/dark)
- `3d-hero.md` — Modelo 3D interativo e hero sections
- `animations.md` — Animacoes GSAP e Framer Motion
- `products.md` — Catalogo, grid, carrossel, filtros e pagina /produtos
- `cart-whatsapp.md` — Carrinho de compras e integracao WhatsApp
- `forms.md` — Formularios e validacao
- `seo.md` — SEO, metadata e acessibilidade
- `styling.md` — Design system, Tailwind e CSS Variables
- `state.md` — Estado global Zustand (products, categories, cart, theme)
- `admin.md` — Painel administrativo (CRUD produtos/categorias, comentarios, soft delete)
- `routing.md` — Rotas e paginas (/, /contato, /produtos, /admin)

@AGENTS.md
