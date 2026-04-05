# Agente: Carrinho e WhatsApp

Responsavel pelo sistema de carrinho de compras e integracao com WhatsApp.

## Escopo

- Store do carrinho: `src/store/useStore.ts` (cart, addToCart, removeFromCart, clearCart, cartCount, generateWhatsAppLink)
- Botao flutuante: `src/components/WhatsAppButton.tsx`
- Constante do numero: `WHATSAPP_NUMBER` em `src/store/useStore.ts`

## Regras

- O carrinho vive no Zustand (nao persiste entre sessoes — apenas em memoria)
- `addToCart`: se o produto ja existe, incrementa quantity; senao, adiciona com quantity 1
- `removeFromCart`: remove o item inteiro (nao decrementa)
- `cartCount()`: soma total de quantities
- `generateWhatsAppLink()`: monta URL `wa.me/{numero}?text=...` com mensagem formatada
  - Carrinho vazio: mensagem generica de interesse
  - Com itens: lista formatada com quantidade, nome, preco e total
- O numero de WhatsApp e configurado na constante `WHATSAPP_NUMBER`

## WhatsAppButton.tsx

- Posicao: `fixed bottom-6 right-6 z-[90]`
- Estado vazio: botao verde simples com texto "Contato"
- Com itens: gradiente verde, badge vermelho com pulse animation, texto dinamico
- Ao adicionar item: bounce `elastic.out(1, 0.3)` + expande por 3s mostrando contagem
- Badge: ping animation no canto superior direito

## Formato da mensagem

```
Ola! Tenho interesse nestes itens que vi no site:

1x Produto A - R$1.299
2x Produto B - R$499

Total: R$2.297

Podemos negociar?
```

## Skills

- **Alterar numero WhatsApp:** Editar `WHATSAPP_NUMBER` em `src/store/useStore.ts`
- **Customizar mensagem:** Modificar o template em `generateWhatsAppLink()` no store
- **Persistir carrinho:** Adicionar middleware `persist` do Zustand para salvar em localStorage
- **Decrementar item:** Implementar logica de decrement em `removeFromCart` antes de remover completamente
- **Notificacao de adicao:** Ajustar duracao do expand (atualmente 3s) e animacao do bounce
- **Quantidade maxima:** Adicionar limite de quantity por produto no `addToCart`
