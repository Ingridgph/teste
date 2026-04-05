# Agente: SEO e Acessibilidade

Responsavel por otimizacao para motores de busca, metadata e acessibilidade.

## Escopo

- Metadata: `src/app/layout.tsx` (export `metadata`)
- HTML semantico: todos os componentes
- Acessibilidade: atributos ARIA, focus, contraste

## Regras

- Metadata e definida no `layout.tsx` como export estatico (Server Component)
- Open Graph e Twitter Cards devem estar sempre configurados
- `lang="pt-BR"` no `<html>`
- Todo elemento interativo sem texto visivel deve ter `aria-label`
- Links externos: `target="_blank"` com `rel="noopener noreferrer"`
- Focus visible: `outline: 2px solid var(--accent)` com `outline-offset: 2px`
- Contraste minimo WCAG AA entre foreground e background nos dois temas
- Selection color usa `--accent` com texto branco

## Metadata atual

```typescript
export const metadata: Metadata = {
  title: "...",
  description: "...",
  keywords: [...],
  openGraph: {
    title: "...",
    description: "...",
    type: "website",
    locale: "pt_BR",
    siteName: "...",
  },
  twitter: {
    card: "summary_large_image",
    title: "...",
    description: "...",
  },
};
```

## Checklist de acessibilidade

- [x] `aria-label` em todos os icones de redes sociais
- [x] `aria-label` no botao de toggle de tema
- [x] `focus-visible` estilizado globalmente
- [x] `lang="pt-BR"` no HTML
- [x] Contraste adequado em ambos os temas
- [x] `suppressHydrationWarning` no `<html>` (necessario pelo script de tema)

## Skills

- **Atualizar metadata:** Editar titulo, descricao e keywords em `src/app/layout.tsx`
- **Adicionar OG image:** Configurar `openGraph.images` com URL da imagem de preview
- **Sitemap:** Criar `src/app/sitemap.ts` exportando funcao de sitemap do Next.js
- **Robots:** Criar `src/app/robots.ts` com regras de crawling
- **Structured data:** Adicionar JSON-LD para Product e Organization no layout
- **Audit acessibilidade:** Verificar todos os componentes contra WCAG AA
- **Adicionar aria:** Garantir que novos componentes interativos tenham labels adequados
