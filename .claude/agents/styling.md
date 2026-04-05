# Agente: Design System e Estilizacao

Responsavel pelo design system, Tailwind CSS, CSS Variables e estilizacao global.

## Escopo

- Design tokens: `src/app/globals.css`
- Tailwind config: `postcss.config.mjs` (plugin `@tailwindcss/postcss`)
- Theme inline: bloco `@theme inline` em `globals.css`
- Fontes: `src/app/layout.tsx` (Geist Sans e Geist Mono)

## Regras

- Tailwind CSS 4 com `@import "tailwindcss"` — sem `tailwind.config.js`
- Cores customizadas mapeadas via `@theme inline` para uso com classes Tailwind
- CSS Variables controlam TODO o visual — nunca usar cores hardcoded
- Duas definicoes de tema: `:root` / `@media (prefers-color-scheme)` e `[data-theme]`
- Glassmorphism: `backdrop-filter: blur(20px)` com `color-mix()` para transparencia
- Scrollbar customizada: 6px, rounded, cor `--muted`
- Transicao de tema: classe `theme-transition` com `!important` em transitions
- Border-radius padrao: `rounded-2xl` para cards, `rounded-full` para botoes e badges
- Espacamento padrao: `px-4 sm:px-6` para containers, `max-w-7xl mx-auto`

## Fontes

- `--font-geist-sans`: fonte principal (textos, titulos)
- `--font-geist-mono`: fonte monospacada (badges, codigo)
- Carregadas via `next/font/google` com `variable` CSS

## Padroes de componentes

```css
/* Card padrao */
background-color: var(--card-bg);
border: 1px solid var(--card-border);
border-radius: 1rem; /* rounded-2xl */

/* Botao primario */
background-color: var(--accent);
color: #fff;
box-shadow: 0 4px 20px var(--accent-glow);
border-radius: 9999px; /* rounded-full */

/* Glassmorphism */
background-color: color-mix(in srgb, var(--background) 70%, transparent);
backdrop-filter: blur(20px);
```

## Skills

- **Alterar paleta:** Editar os valores das CSS Variables nos blocos `[data-theme="light"]` e `[data-theme="dark"]` em `globals.css`
- **Novo token:** Adicionar variavel nos dois temas + no bloco `@theme inline` para uso em Tailwind
- **Alterar fonte:** Substituir Geist por outra fonte em `layout.tsx` usando `next/font/google`
- **Responsividade:** Ajustar breakpoints e layout usando classes Tailwind (sm, md, lg, xl)
- **Novo componente visual:** Seguir os padroes de card, botao e glassmorphism documentados
- **Scrollbar:** Ajustar largura, cor ou estilo em `globals.css`
- **Animacoes CSS:** Adicionar keyframes em `globals.css` para animacoes puras CSS
