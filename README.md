# Pingu Wallet - API

API robusta desenvolvida em **Node.js** para gerenciar as regras de negócio e persistência de dados do Pingu Wallet.

## 📝 Descrição
Servidor central responsável por processar as transações financeiras, gerenciar usuários e calcular o progresso das metas financeiras, utilizando **PostgreSQL** como banco de dados relacional.

## 🚀 Funcionalidades
* **Auth**: Sistema de autenticação via JWT (JSON Web Tokens).
* **Gestão Financeira**: Endpoints completos para manipulação de transações (`/transacoes`) e metas (`/metas`).
* **Relatórios**: Integração real com lógica de agregação para relatórios mensais e por categoria.
* **Histórico de Metas**: Gestão segura de depósitos em metas com auditoria de dados (tabela `depositos_meta`).

## 🛠️ Tecnologias
* **Runtime**: Node.js
* **Framework**: Express
* **Banco de Dados**: PostgreSQL
* **Infraestrutura**: Docker & Docker Compose para orquestração

## ⚙️ Como Executar
1. Certifique-se de ter **Docker** e **Node.js** instalados.
2. Clone o repositório.
3. Acesse a pasta raiz:
   ```bash
   cd pingu-wallet-backend
4. Copie o arquivo de exemplo para criar o seu **.env** (já configurado):
   ```bash
   cp .env.example .env
5. Suba a infraestrutura do banco de dados:
   ```bash
   docker-compose up -d
6. Instale as dependências: 
   ```bash
   npm install
7. Inicie o servidor:
   ```bash
   npm run dev

## 👥 Equipe
* João Pedro Araújo
* Daniel Suzuki Naves
* Luís Fernando Moreira Beani
* Guilherme Teruichi Nishida

## 📄 Licença
Este projeto está sob a licença **Apache 2.0.**
