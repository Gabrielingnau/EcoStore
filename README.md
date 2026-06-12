# IgniteShop — Next.js 14

E-commerce completo em **Next.js 14 (App Router) + TypeScript + Tailwind + Supabase**.

## Recursos
- Catálogo de produtos com **carrossel multi-imagens** (capa = `imagem_url`, demais via tabela `product_images`)
- Sacola persistente (Zustand)
- Checkout com RPC `place_order` (transacional, debita estoque)
- Autenticação Supabase (1º cadastro vira admin via trigger)
- **Painel admin**: CRUD de produtos, upload múltiplo de imagens, gerenciamento de pedidos e reembolsos
- Avaliações de produtos
- Solicitação de reembolso pelo cliente
- Header reativo (mostra Admin/Sacola/Logout dinamicamente)

## Setup

```bash
npm install
cp .env.local.example .env.local   # preencha SUPABASE_URL e ANON_KEY
npm run dev
```

### Banco
Rode o `igniteshop-schema.sql` (gerado anteriormente) no SQL Editor do seu Supabase.

### Storage
Crie um bucket público chamado **`product-images`**.

### Auth
Em Authentication → Providers, habilite **Email** (e Google se quiser).
O 1º usuário cadastrado é promovido a `admin` automaticamente pelo trigger `handle_new_user`.

## Estrutura

```
app/                  rotas (App Router)
  page.tsx            home
  produto/[id]/       detalhe + carrossel
  admin/              painel admin
  perfil/             pedidos do cliente
  checkout/           finalização
  login/              auth
components/
  ui/                 botão, input, card, etc (shadcn-style)
  site/               header, drawer, cards
hooks/
  use-auth.ts         user + isAdmin reativo
lib/
  supabase/           client / server / middleware
  store/cart.ts       zustand persist
  utils.ts            cn, formatBRL, máscaras
types/
  database.ts         tipagem Supabase completa
middleware.ts         refresh de sessão
```

## Substituir por shadcn/ui oficial
Os componentes em `components/ui/*` seguem o padrão shadcn. Para trocar pelos oficiais:

```bash
npx shadcn@latest init
npx shadcn@latest add button input card label textarea badge sonner
```
