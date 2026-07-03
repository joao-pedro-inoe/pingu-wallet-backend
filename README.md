# Pingu Wallet - Backend

API de alta performance desenvolvida em **Node.js** para suportar a infraestrutura de dados e a lógica de negócio do Pingu Wallet, um sistema de gestão financeira pessoal focado em segurança, usabilidade e precisão.

## 📝 Visão Geral
Servidor robusto desenvolvido com arquitetura REST, responsável pela persistência de dados financeiros, processamento de transações, gestão de metas e autenticação segura de usuários. O projeto utiliza **PostgreSQL** como base relacional, gerenciada via **Prisma ORM**.

## 🚀 Principais Funcionalidades
* **Autenticação Segura**: Implementação de sistema de login e registro baseada em **JWT (JSON Web Token)**.
* **Gestão Financeira**: Operações completas de CRUD para transações de receitas e despesas.
* **Inteligência de Metas**: Lógica de negócio focada no acompanhamento de objetivos ("cofrinhos"), permitindo depósitos incrementais e auditoria de histórico.
* **Relatórios**: Endpoints otimizados para agregação de dados financeiros mensais, organizados por categorias.

## 🛠️ Stack Tecnológica
* **Linguagem**: JavaScript (Node.js)
* **Framework**: Express.js
* **ORM**: Prisma
* **Banco de Dados**: PostgreSQL
* **Orquestração**: Docker & Docker Compose

## ⚙️ Como Executar o Projeto

### Pré-requisitos
* [Node.js](https://nodejs.org/) (LTS)
* [Docker](https://www.docker.com/) e Docker Compose

### Instalação e Execução
1. Clone este repositório:
   ```bash
   git clone [URL_DO_REPOSITORIO]
   cd pingu-wallet-backend
2. Configure as variáveis de ambiente:
* copie o arquivo de exemplo para o seu arquivo de ambiente local:
   ```bash
   cp .env.example .env
* **Nota:** edite o **.env** gerado e insira suas credenciais locais de banco de dados e segredos de JWT.
3. Suba a infraestrutura do banco de dados via Docker:
   ```bash
   docker-compose up -d
4. Instale as dependências e inicie o servidor:
   ```bash
   npm install
   npx prisma migrate dev
   npm run dev

## 👥 Equipe de Desenvolvimento
* Daniel Suzuki Naves
* Guilherme Teruichi Nishida
* João Pedro Araújo
* Luís Fernando Moreira Beani

## 📄 Licença
Este projeto está licenciado sob a licença **Apache 2.0.**
