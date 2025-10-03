# 🖥️ Frontend do Painel Administrativo (Next.js)

Este é o Frontend da aplicação de gestão de leads, desenvolvido com **Next.js** e **React**. Ele é responsável por duas áreas principais: o **Formulário Público** para captação de leads e o **Painel Administrativo** para gestão e visualização dos dados.

## 🚀 Tecnologias e Setup

Este é um projeto [Next.js](https://nextjs.org) inicializado com `create-next-app`.

* **Framework:** Next.js
* **Linguagem:** TypeScript
* **Design:** Responsivo obrigatório.

## 📋 Estrutura de Rotas e Funcionalidades

As rotas foram estruturadas para atender aos requisitos do formulário público e do painel administrativo.

| Rota | Descrição | Requisitos Atendidos |
| :--- | :--- | :--- |
| `/` | **Formulário Público** de captação de leads. | Campos e Validações obrigatórias, Tracking Automático (UTMs, GCLID, FBCLID) |
| `/admin/login` | Tela de autenticação básica para acesso ao painel. | Autenticação básica |
| `/admin/leads` | **Listagem principal** de leads (com busca e exportação). | Listar, Busca por nome/e-mail |
| `/admin/leads/[id]` | **Detalhes completos** de um lead. | Visualizar detalhes completos do lead, visualização de dados de tracking (UTMs) |
| `/admin/leads/new` | Formulário para **inserir** um novo lead. | Inserir leads |
| `/admin/leads/edit/[id]` | Formulário para **editar** um lead existente. | Editar leads |

---

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Crie um arquivo chamado **`.env.local`** na raiz do diretório `frontend` com as seguintes variáveis. Estas são essenciais para a comunicação com o Backend API e para a implementação do Tracking (Adicional).

```env.local
# URL base para a API REST do Backend
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_API_KEY=XXXXXXX

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
