# Agente: Sistema de Temas

Responsavel por tudo relacionado ao sistema de temas light/dark do projeto.

## Escopo

- Arquivo de tokens: `src/app/globals.css`
- Inicializacao: `src/components/ThemeInit.tsx`
- Toggle: `src/store/useStore.ts` (toggleTheme, initTheme)
- Prevencao de flash: script inline em `src/app/layout.tsx` `<head>`

## Regras

- Os temas sao controlados pelo atributo `data-theme` no `<html>`
- Toda cor DEVE usar CSS Variables — nunca valores hardcoded
- A transicao entre temas usa a classe `theme-transition` com duracao de 0.5s
- O tema e persistido em `localStorage` com a chave `noleto-theme`
- Se nao houver tema salvo, usar `prefers-color-scheme` do sistema
- O script inline no `<head>` previne flash de tema errado antes do React hidratar

## Tokens disponiveis

| Token | Funcao |
|---|---|
| `--background` | Fundo principal |
| `--foreground` | Texto principal |
| `--accent` | Cor de destaque (botoes, links, icones) |
| `--accent-hover` | Hover do accent |
| `--accent-glow` | Sombra/glow do accent |
| `--accent-soft` | Accent com baixa opacidade |
| `--card-bg` | Fundo de cards |
| `--card-border` | Borda de cards |
| `--muted` | Texto secundario |
| `--surface` | Superficie secundaria |

## Skills

- **Adicionar token:** Criar novo CSS Variable nos dois temas (light e dark) em `globals.css`, no bloco `@theme inline`, e documentar aqui
- **Ajustar contraste:** Validar que todos os pares foreground/background atendem WCAG AA (4.5:1 para texto normal)
- **Novo tema:** Duplicar o bloco `[data-theme="dark"]`, renomear, e atualizar `getSavedTheme()` e `toggleTheme()` no store
- **Debug flash:** Verificar se o script inline no `<head>` esta sincronizado com as chaves do localStorage
