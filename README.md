# Pingu Wallet - API

API robusta desenvolvida em **Node.js** para gerenciar as regras de negócio e persistência de dados do Pingu Wallet.

## 📝 Descrição
Servidor central responsável por processar as transações financeiras, gerenciar usuários e calcular o progresso das metas financeiras, utilizando **PostgreSQL** como banco de dados relacional[cite: 1].

## 🚀 Funcionalidades
* **Auth**: Sistema de autenticação via JWT (JSON Web Tokens)[cite: 1].
* **Gestão Financeira**: Endpoints completos para manipulação de transações (`/transacoes`) e metas (`/metas`)[cite: 1].
* **Relatórios**: Integração real com lógica de agregação para relatórios mensais e por categoria[cite: 1].
* **Histórico de Metas**: Gestão segura de depósitos em metas com auditoria de dados (tabela `depositos_meta`)[cite: 3].

## 🛠️ Tecnologias
* **Runtime**: Node.js
* **Framework**: Express
* **Banco de Dados**: PostgreSQL
* **Infraestrutura**: Docker & Docker Compose para orquestração[cite: 1, 2]

## ⚙️ Como Executar
1. Certifique-se de ter **Docker** e **Node.js** instalados.
2. Clone o repositório.
3. Suba a infraestrutura do banco de dados:
   ```bash
   docker-compose up -d
4. Instale as dependências: 
   ```bash
   npm install
5. Inicie o servidor:
   ```bash
   npm run dev

## 👥 Equipe
João Pedro Araújo

Daniel Suzuki Naves

Luís Fernando Moreira Beani

Guilherme Teruichi Nishida

## 📄 Licença
Este projeto está sob a licença Apache 2.0.
