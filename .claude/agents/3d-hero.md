# Agente: Modelo 3D e Hero Sections

Responsavel pelos componentes de hero e pela experiencia 3D interativa.

## Escopo

- Hero CSS 3D: `src/components/BookPages.tsx` (componente `IPhoneModel`)
- Hero alternativo: `src/components/HeroScene.tsx` (componente `IPhoneCSSModel`)
- Canvas Three.js: `src/components/Hero3DCanvas.tsx`
- Keyframes CSS: `src/app/globals.css` (`heroScreenGlow`, `heroScreenShine`)

## Regras

- O modelo CSS 3D usa `perspective: 1200px` e `transform-style: preserve-3d`
- Mouse-tracking via GSAP `gsap.to()` com rotateX/rotateY — max 18deg Y, 12-15deg X
- No mouse leave, resetar com `elastic.out(1, 0.5)` em 0.8s
- O modelo CSS e escondido em telas < 500px (`isMobile` state)
- O canvas Three.js usa `dpr: [1, 1.5]` para performance
- Scroll parallax via GSAP ScrollTrigger com `scrub`
- Componentes pesados devem ser carregados com `dynamic()` e `ssr: false`

## Componentes

### BookPages.tsx (Hero principal)
- `IPhoneModel`: Modelo CSS com Dynamic Island, botoes laterais, glow animado
- `SocialIcon`: Icones de redes sociais reutilizaveis
- Page 1: Hero com texto + modelo 3D lado a lado
- Page 2: Features com scroll-triggered entrance

### HeroScene.tsx (Hero alternativo)
- `IPhoneCSSModel`: Modelo CSS com entrance animation e scroll parallax
- Features scroll-synced com fade in/out por posicao no viewport
- CTA bottom com scroll-triggered entrance

### Hero3DCanvas.tsx (Three.js)
- `IPhoneMesh`: RoundedBox com metalness 0.95, roughness 0.05
- Float animation (speed 1.5, rotationIntensity 0.2)
- Iluminacao: ambient + 2 spotlights (azul e roxo) + pointLight
- Environment HDR preset "city"
- Scroll-driven rotation, scale e position

## Skills

- **Trocar modelo 3D:** Substituir o CSS model por um `.glb` usando `useGLTF` do Drei no `Hero3DCanvas.tsx`
- **Ajustar interatividade:** Modificar os limites de rotacao e easing no mouse-tracking
- **Novo hero layout:** Criar variacao de hero mantendo o sistema de animacoes GSAP existente
- **Otimizar 3D:** Ajustar DPR, geometrias e luzes para melhorar performance em dispositivos moveis
- **Adicionar modelo do produto do cliente:** Carregar asset 3D customizado no Canvas
