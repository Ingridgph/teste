# Agente: Formularios e Validacao

Responsavel por todos os formularios e validacao de dados do projeto.

## Escopo

- Pagina de contato: `src/app/contato/page.tsx`
- Modal command-palette: `src/components/ContactPalette.tsx`
- Dependencias: React Hook Form 7, Zod 4, @hookform/resolvers

## Regras

- Todos os formularios usam React Hook Form com `zodResolver`
- Validacao em modo `onChange` (tempo real)
- Schemas Zod definem as regras de validacao
- Erros sao exibidos inline abaixo do campo
- Submit envia via WhatsApp (window.open com URL formatada) e reseta o form
- Inputs seguem o padrao visual: `rounded-xl px-4 py-3 text-sm`
- Borda muda para vermelho (`rgba(239,68,68,0.5)`) quando ha erro
- Botao de submit desabilitado quando form invalido ou em submissao

## Schemas existentes

### Contato simples (contato/page.tsx)
```typescript
z.object({
  name: z.string().min(2, "Nome muito curto"),
  phone: z.string().min(10, "Telefone invalido").max(15),
})
```

### Contato completo (ContactPalette.tsx)
```typescript
z.object({
  name: z.string().min(2, "Nome muito curto"),
  email: z.string().email("E-mail invalido"),
  phone: z.string().min(10, "Telefone invalido").max(15),
  message: z.string().min(5, "Mensagem muito curta").max(500),
})
```

## ContactPalette.tsx

- Abre com `Ctrl+K` (ou `Cmd+K`), fecha com `Escape`
- Overlay com backdrop blur(20px)
- Painel animado com GSAP: `back.out(1.4)` na entrada
- `FormField` wrapper com label, children e tooltip de erro
- Bloqueia scroll do body quando aberto

## Skills

- **Novo campo:** Adicionar campo ao schema Zod, ao tipo inferred, ao JSX e ao template da mensagem WhatsApp
- **Mascara de telefone:** Implementar mascara `(00) 00000-0000` no input de telefone
- **Validacao customizada:** Adicionar regras Zod customizadas (ex: CPF, CEP)
- **Novo formulario:** Criar form seguindo o padrao: schema Zod + useForm + zodResolver + onChange mode
- **Feedback de sucesso:** Adicionar toast ou animacao apos submit bem-sucedido
- **Ajustar atalho:** Modificar o keybinding do command-palette em `ContactPalette.tsx`
