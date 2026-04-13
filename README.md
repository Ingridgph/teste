<div align="center">

# E-commerce Landing Page

**Template premium de loja virtual com experiência interativa de alto nível**

Uma solução completa, moderna e personalizável para marcas que buscam presença digital de impacto — construída com as tecnologias mais avançadas do ecossistema React.

[![Next.js](https://img.shields.io/badge/Next.js-16.2.2-000?logo=next.js&style=flat)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react&logoColor=000&style=flat)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=fff&style=flat)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=fff&style=flat)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-r183-000?logo=three.js&style=flat)](https://threejs.org/)
[![GSAP](https://img.shields.io/badge/GSAP-3.14-88CE02?logo=greensock&logoColor=000&style=flat)](https://gsap.com/)
[![License](https://img.shields.io/badge/License-MIT-green&style=flat)](#licença)

[Repositório](https://github.com/wLuC45/portfolio.git) · [Reportar Bug](https://github.com/wLuC45/portfolio/issues) · [Solicitar Recurso](https://github.com/wLuC45/portfolio/issues)

</div>

---

## Sobre

Este template entrega uma landing page de e-commerce de alto padrão, pronta para ser adaptada à identidade visual e ao catálogo de qualquer marca. O projeto combina modelo 3D interativo com rastreamento de mouse, animações cinematográficas por scroll, smooth scrolling nativo e um fluxo de compra direto via WhatsApp — tudo construído com as tecnologias mais modernas do mercado frontend.

O resultado é uma vitrine digital que transmite credibilidade, sofisticação e converte visitantes em clientes. Ideal para marcas que desejam se destacar da concorrência com uma experiência online verdadeiramente premium.

**Por que escolher este template:**

- Impressiona desde o primeiro acesso com animações 3D e transições fluidas
- Reduz o tempo de desenvolvimento sem abrir mão da qualidade de engenharia
- Totalmente personalizável: cores, fontes, produtos, textos e número de WhatsApp configuráveis em poucos arquivos
- Código limpo, tipado e escalável — fácil de manter e expandir
- Performance otimizada com code splitting, lazy loading e fontes sem layout shift
- SEO completo com Open Graph e Twitter Cards prontos para configurar

---

## Funcionalidades

- Modelo 3D interativo com mouse-tracking via CSS transforms e GSAP, com alternativa em Three.js (React Three Fiber + Drei, iluminação HDR)
- Animacoes cinematograficas com GSAP ScrollTrigger: entrance por viewport, stagger, parallax
- Smooth scrolling com Lenis sincronizado ao GSAP ticker
- Tema claro/escuro com transicao suave, persistencia em localStorage e deteccao automatica da preferencia do sistema operacional
- Carrinho de compras com geracao automatica de pedido formatado via WhatsApp
- Grid de produtos com carrossel animado por categoria, busca em tempo real e filtros
- Formularios validados com React Hook Form e Zod
- Modal command-palette ativado por Ctrl+K
- Navbar com efeito glassmorphism
- SEO completo: Open Graph, Twitter Cards, metadata estruturada
- Estado global com Zustand
- Acessibilidade: aria-label, focus-visible, lang, contraste adequado entre temas

---

## Stack Tecnologica

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16.2.2 (App Router) |
| UI | React 19.2.4 + TypeScript 5 |
| Estilizacao | Tailwind CSS 4 + CSS Variables |
| Animacao | GSAP 3.14 + ScrollTrigger |
| 3D | Three.js r183 + React Three Fiber + Drei |
| Scroll | Lenis 1.0.42 |
| Estado global | Zustand 5.0.12 |
| Formularios | React Hook Form 7 + Zod 4 |
| Lint | ESLint 9 + eslint-config-next |
| Fontes | Geist Sans + Geist Mono |

---

## Arquitetura

```
src/
├── app/
│   ├── layout.tsx            # Root layout: SEO, fontes, ThemeInit
│   ├── page.tsx              # Home: hero, vitrine, footer
│   ├── globals.css           # Design tokens, temas, keyframes, scrollbar
│   └── contato/
│       └── page.tsx          # Pagina de contato com formulario validado
│
├── components/
│   ├── Navbar.tsx            # Nav fixa com glassmorphism, logo, links, toggle de tema
│   ├── BookPages.tsx         # Hero com modelo 3D CSS + secao de features (ScrollTrigger)
│   ├── HeroScene.tsx         # Hero alternativo com parallax e features scroll-synced
│   ├── Hero3DCanvas.tsx      # Canvas Three.js: RoundedBox, Float, Environment HDR
│   ├── ProductGrid.tsx       # Vitrine: carrossel por categoria, busca, filtros, cards animados
│   ├── ContactPalette.tsx    # Modal command-palette (Ctrl+K) com formulario validado
│   ├── WhatsAppButton.tsx    # Botao flutuante com badge de carrinho e bounce animation
│   ├── Footer.tsx            # Rodape: brand, navegacao, links sociais
│   └── ThemeInit.tsx         # Inicializacao de tema sem flash no mount
│
├── data/
│   └── products.ts           # Catalogo de produtos configuravel
│
├── hooks/
│   └── useLenis.ts           # Hook de smooth scroll com sync ao GSAP ticker
│
└── store/
    └── useStore.ts           # Estado global: carrinho, tema, busca, categorias, WhatsApp
```

---

## Personalizacao

Adaptar o template para a marca do cliente e um processo direto, concentrado em poucos arquivos.

**Identidade visual**

Todas as cores, espacamentos e estilos globais sao controlados por CSS Variables em `src/app/globals.css`. Altere os tokens para aplicar a paleta da marca sem tocar em nenhum componente:

| Token | Descricao |
|---|---|
| `--background` | Cor de fundo principal |
| `--foreground` | Cor do texto principal |
| `--accent` | Cor de destaque (botoes, links) |
| `--card-bg` | Fundo dos cards de produto |
| `--card-border` | Borda dos cards |
| `--muted` | Texto secundario |

**Catalogo de produtos**

Edite `src/data/products.ts` para definir os produtos, categorias, precos e imagens da loja. O grid e o carrossel se adaptam automaticamente ao conteudo cadastrado.

**Numero de WhatsApp**

Configure o numero de destino dos pedidos diretamente no store em `src/store/useStore.ts`. A mensagem gerada inclui os itens do carrinho com quantidades e valores, pronta para atendimento.

**Textos e metadados**

Atualize os textos da interface e os metadados de SEO (titulo, descricao, Open Graph) em `src/app/layout.tsx` e nos componentes de cada secao.

**Modelo 3D**

O hero principal usa um modelo CSS 3D personalizavel. O componente `Hero3DCanvas.tsx` oferece uma alternativa com Three.js para quem deseja exibir um modelo `.glb` real do produto.

---

## Como Executar

**Pre-requisitos:** Node.js 18 ou superior e npm.

```bash
# Clonar o repositorio
git clone https://github.com/wLuC45/portfolio.git
cd portfolio

# Instalar dependencias
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:3000` no navegador.

---

## Scripts

| Comando | Descricao |
|---|---|
| `npm run dev` | Servidor de desenvolvimento com hot reload |
| `npm run build` | Build otimizado para producao |
| `npm run start` | Servidor de producao local |
| `npm run lint` | Verificacao de qualidade com ESLint 9 |

**Deploy na Vercel:**

```bash
npx vercel
```

O projeto esta configurado para deploy direto na Vercel sem necessidade de ajustes adicionais.

---

## Performance

| Estrategia | Implementacao |
|---|---|
| Code splitting | `dynamic()` com `ssr: false` para componentes pesados (hero 3D, canvas) |
| Fontes otimizadas | `next/font/google` com variable fonts — zero layout shift |
| CSS Variables | Troca de tema sem re-render, apenas atributo `data-theme` |
| Smooth scroll | Lenis sincronizado com GSAP ticker — sem jank |
| Lazy loading | Canvas Three.js carregado sob demanda |
| DPR limitado | Canvas 3D com `dpr: [1, 1.5]` para equilibrio entre qualidade e performance |

---

## Licenca

Distribuido sob a licenca MIT. Veja [LICENSE](LICENSE) para mais informacoes.

---

<div align="center">

Desenvolvido por [wLuC45](https://github.com/wLuC45)

</div>
#   t e s t e  
 