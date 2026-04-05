# Agente: Animacoes

Responsavel por todas as animacoes do projeto (GSAP, Framer Motion, CSS).

## Escopo

- GSAP core + ScrollTrigger: usado em `BookPages`, `HeroScene`, `Hero3DCanvas`, `ProductGrid`, `WhatsAppButton`, `ContactPalette`, pagina de contato
- Lenis smooth scroll: `src/hooks/useLenis.ts`
- CSS keyframes: `src/app/globals.css`
- Framer Motion: disponivel mas usado pontualmente

## Regras

- Sempre registrar plugins: `gsap.registerPlugin(ScrollTrigger)` no topo do modulo
- Usar `gsap.context()` dentro de `useEffect` e retornar `ctx.revert()` no cleanup
- Padroes de easing preferidos:
  - Entrance: `power3.out`
  - Bounce: `elastic.out(1, 0.5)` ou `back.out(1.7)`
  - Scroll-synced: `scrub: 1` a `scrub: 1.5`
- Stagger padrao: `0.08` a `0.1`
- Duracao padrao: `0.5s` a `1.2s`
- Elementos animados usam classe `.anim` como seletor
- Scroll-triggered: `start: "top 75%"` ou `"top 85%"` como padrao
- Lenis deve estar sincronizado com `ScrollTrigger.update` e GSAP ticker

## Padroes existentes

```typescript
// Entrance animation
gsap.fromTo(els, 
  { opacity: 0, y: 30 }, 
  { opacity: 1, y: 0, stagger: 0.1, duration: 0.9, ease: "power3.out" }
);

// Scroll-triggered
gsap.fromTo(els, { opacity: 0, y: 40 }, {
  opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
  scrollTrigger: { trigger: ref, start: "top 75%", toggleActions: "play none none none" },
});

// Carousel cards
gsap.fromTo(cards,
  { opacity: 0, x: 40, scale: 0.95 },
  { opacity: 1, x: 0, scale: 1, stagger: 0.08, duration: 0.45, ease: "power2.out" }
);
```

## Lenis (useLenis.ts)

- Duracao: 1.2
- Easing: exponential decay `1.001 - Math.pow(2, -10 * t)`
- `smoothWheel: true`
- Sync: `lenis.on("scroll", ScrollTrigger.update)` + `gsap.ticker.add()`
- Cleanup: `lenis.destroy()` + `gsap.ticker.remove()`

## Skills

- **Adicionar animacao de entrada:** Criar entrance animation em novo componente seguindo o padrao `.anim` + `gsap.fromTo`
- **Scroll-triggered section:** Configurar ScrollTrigger com trigger, start/end e toggleActions
- **Parallax:** Implementar parallax com `scrub` e transformacoes (y, scale, rotation)
- **Micro-interacao:** Adicionar feedback visual em botoes/cards com GSAP ou Framer Motion
- **Debug animacao:** Usar `ScrollTrigger.create({ markers: true })` para visualizar triggers
- **Performance:** Verificar se todos os contexts sao revertidos no cleanup do useEffect
