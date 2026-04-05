# Agente de Rotas e Paginas

## Responsabilidade

Gerenciar a estrutura de rotas do projeto usando Next.js App Router. Criar, modificar e proteger paginas no diretorio `src/app/`, garantindo correta configuracao de metadata SEO, diretivas de client/server components e inclusao no sitemap.

---

## Rotas Existentes

### / (Home)

- **Arquivo:** `src/app/page.tsx`
- **Componentes:** Hero, carrossel de produtos, footer
- **Tipo:** Server Component

### /contato

- **Arquivo:** `src/app/contato/page.tsx`
- **Componentes:** Bio, informacoes de contato, formulario de WhatsApp
- **Tipo:** Client Component (formulario usa hooks)

### /produtos

- **Arquivo:** `src/app/produtos/page.tsx`
- **Componentes:** Grid completo de produtos com filtros
- **Tipo:** Client Component (filtros usam estado)

### /admin

- **Arquivo:** `src/app/admin/page.tsx`
- **Componentes:** Painel administrativo
- **Acesso:** Protegido por token
- **Tipo:** Client Component

### Layout Raiz

- **Arquivo:** `src/app/layout.tsx`
- **Responsabilidades:** Metadata SEO global, fontes Geist, inicializacao do tema (ThemeInit)
- **Tipo:** Server Component (nao pode ser client component)

---

## Skills

### Criar nova rota

1. Criar o diretorio correspondente em `src/app/<nome-da-rota>/`
2. Criar o arquivo `page.tsx` dentro do diretorio
3. Adicionar `"use client"` no topo se a pagina usar hooks ou eventos do browser
4. Exportar um componente React como `default export`
5. Adicionar metadata SEO especifica da pagina (ver skill abaixo)

Estrutura minima de uma nova pagina:

```tsx
// sem "use client" se for server component
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Titulo da Pagina",
  description: "Descricao da pagina para SEO.",
};

export default function NomeDaPagina() {
  return <main>{/* conteudo */}</main>;
}
```

Estrutura minima de uma nova pagina client:

```tsx
"use client";

export default function NomeDaPagina() {
  return <main>{/* conteudo com hooks */}</main>;
}
```

### Adicionar metadata SEO por pagina

Em server components, exportar o objeto `metadata` diretamente no arquivo `page.tsx`:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Titulo — Nome do Site",
  description: "Descricao clara e objetiva da pagina.",
  openGraph: {
    title: "Titulo — Nome do Site",
    description: "Descricao para compartilhamento.",
    url: "https://seudominio.com/rota",
  },
};
```

Em client components, usar `generateMetadata` em um arquivo separado ou manter o metadata no layout pai. Metadata estatica nao funciona em arquivos com `"use client"`.

### Proteger rota com autenticacao

O padrao atual (rota `/admin`) usa verificacao de token no lado do cliente. Para replicar:

1. Na pagina, verificar o token em `useEffect` ou durante a renderizacao
2. Redirecionar ou exibir tela de bloqueio caso o token seja invalido
3. Nunca expor logica sensivel em client components — mover verificacoes criticas para middleware ou API routes

Exemplo de verificacao basica:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token !== process.env.NEXT_PUBLIC_ADMIN_TOKEN) {
      router.replace("/");
    } else {
      setAutorizado(true);
    }
  }, [router]);

  if (!autorizado) return null;

  return <main>{/* conteudo admin */}</main>;
}
```

### Adicionar pagina ao sitemap

Criar ou editar `src/app/sitemap.ts` para incluir a nova rota:

```ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://seudominio.com", lastModified: new Date() },
    { url: "https://seudominio.com/contato", lastModified: new Date() },
    { url: "https://seudominio.com/produtos", lastModified: new Date() },
    // adicionar nova rota aqui
  ];
}
```

A rota `/admin` nao deve ser incluida no sitemap.

---

## Regras

- Usar exclusivamente o App Router do Next.js — todas as rotas ficam em `src/app/`
- Cada rota e um diretorio com seu proprio `page.tsx`
- Adicionar `"use client"` apenas em paginas que utilizam hooks React, eventos do browser ou bibliotecas client-only
- O arquivo `src/app/layout.tsx` e um Server Component e nao pode receber a diretiva `"use client"`
- Metadata SEO deve ser definida por pagina sempre que possivel, sobrescrevendo os valores globais do layout raiz
- Paginas administrativas ou restritas nao devem aparecer no sitemap

---

## Estrutura de Diretorios

```
src/
  app/
    layout.tsx          # Layout raiz (server component)
    page.tsx            # Rota /
    contato/
      page.tsx          # Rota /contato
    produtos/
      page.tsx          # Rota /produtos
    admin/
      page.tsx          # Rota /admin (protegida)
    sitemap.ts          # Sitemap dinamico (opcional)
```
