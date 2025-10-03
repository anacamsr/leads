# ⚙️ Backend API: Gerenciamento de Leads

Esta é a API RESTful construída em Node.js/Express e TypeScript, responsável por gerenciar os dados (CRUD de Leads) e o sistema de autenticação JWT para o Painel Administrativo.

---

## 🛠️ Tecnologias

* **Plataforma:** Node.js (versão **18.0.0** ou superior)
* **Linguagem:** TypeScript
* **Banco de Dados:** MySQL (`mysql2`)

---

## 🔑 Configuração de Variáveis de Ambiente

API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

API_KEY = process.env.NEXT_PUBLIC_API_KEY || "xxxxx"; 

---

## 💾 Setup do Banco de Dados (MySQL)

**Atenção:** Você deve ter um servidor MySQL instalado e rodando localmente (ou um serviço de banco de dados configurado).

### Passo 1: Criar o Banco de Dados

Crie um novo banco de dados no seu servidor MySQL. Você pode chamá-lo de `leads_db`.

```sql
CREATE DATABASE IF NOT EXISTS leads_db;

### Passo 2: Instalar o node
npm install

### Passo 2: Rodar no servidor
npm run dev
