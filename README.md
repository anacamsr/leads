# 📊 Painel Administrativo de Leads (Full Stack)

Este projeto é um painel administrativo completo para gestão de leads, desenvolvido como um teste técnico Full Stack. Ele consiste em um **Backend API** robusto e um **Frontend** moderno, com o objetivo de criar um sistema completo de captação, gestão e rastreamento de leads.

## 🚀 Visão Geral e Tecnologias

O projeto utiliza uma stack moderna e robusta:

| Componente | Tecnologia Principal | Versão | Responsabilidade |
| :--- | :--- | :--- | :--- |
| **Backend** | **Node.js / TypeScript** | $\ge$ 18.0.0 | Autenticação, CRUD de Leads, Exportação CSV e recebimento de submissões do formulário público. |
| **Frontend** | **Next.js (React)** | Última | Interface do Painel (admin), Formulário Público e Consumo da API. |
| **Database** | **MySQL** | - | Persistência dos dados de leads, incluindo informações de tracking. |
| **Design** | **Responsivo** | - | Layout obrigatório para todas as telas. |

---

## ✨ Funcionalidades Implementadas

### 1. Formulário Público de Leads

O formulário de captação deve conter os seguintes requisitos:

* **Campos:** Nome, e-mail, telefone, cargo, data de nascimento e mensagem.
* **Validações:** E-mail válido, telefone brasileiro, data válida, e todos os campos obrigatórios.
* **Tracking Automático:** Captura e persistência dos parâmetros de URL.

### 2. Painel Administrativo

A área restrita para gestão e análise dos leads:
* **Gestão de Leads (CRUD):** Listar, inserir, editar e deletar leads.
* **Detalhes:** Visualização completa dos detalhes do lead.
* **Busca:** Busca por nome e e-mail.
* **Visualização de Tracking:** Exibição dos dados de tracking (UTMs).
* **Autenticação:** Autenticação básica para acesso restrito.
* **Exportação:** Funcionalidade para exportar leads em formato **CSV** ou **Excel**.

---

## 🛠️ Pré-requisitos

Para rodar o projeto, você precisará ter instalado:
* **Node.js** (versão $\ge$ **18.0.0**)
* **npm** (ou yarn)
* Um servidor de banco de dados **MySQL** configurado e acessível.

---

## 📦 Como Instalar e Rodar

O projeto deve ser iniciado em duas etapas separadas: **Backend** (API) e **Frontend** (Next.js).

### 1. Configuração e Inicialização do Backend (API)

1.  Navegue até o diretório `backend`:
    ```bash
    cd backend
    ```
2.  Siga as instruções de instalação e configuração do banco de dados descritas no `README` específico.


### 2. Configuração e Inicialização do Frontend (Next.js)

1.  Navegue até o diretório `frontend`:
    ```bash
    cd frontend
    ```
2.  Siga as instruções para configurar as variáveis de ambiente e iniciar a aplicação.
