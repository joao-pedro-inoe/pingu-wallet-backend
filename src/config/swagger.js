// config/swagger.js
const swaggerJSDoc = require("swagger-jsdoc");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Pingu Wallet API",
      version: "1.0.0",
      description: "Documentação Completa da API de Finanças Árticas - UTFPR",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor Local de Desenvolvimento",
      },
    ],
    components: {
      schemas: {
        UsuarioRegistro: {
          type: "object",
          required: ["nome", "idade", "cpf", "cep", "email", "senha"],
          properties: {
            nome: { type: "string", example: "Pingu da Silva" },
            idade: { type: "integer", example: 21 },
            cpf: { type: "string", example: "123.456.789-00" },
            cep: { type: "string", example: "87300-000" },
            email: { type: "string", example: "pingu@utfpr.edu.br" },
            senha: { type: "string", example: "iglu1234" },
          },
        },
        UsuarioLogin: {
          type: "object",
          required: ["email", "senha"],
          properties: {
            email: { type: "string", example: "pingu@utfpr.edu.br" },
            senha: { type: "string", example: "iglu1234" },
          },
        },
        Transacao: {
          type: "object",
          required: ["usuarioId", "descricao", "valor", "tipo", "categoria"],
          properties: {
            usuarioId: { type: "integer", example: 1 },
            descricao: { type: "string", example: "Picole de Sardinha" },
            valor: { type: "number", example: 15.9 },
            tipo: {
              type: "string",
              enum: ["receita", "despesa"],
              example: "despesa",
            },
            categoria: { type: "string", example: "Alimentação" },
            data_transacao: {
              type: "string",
              format: "date-time",
              example: "2026-05-29T16:00:00.000Z",
            },
          },
        },
        Categoria: {
          type: "object",
          required: ["usuarioId", "nome", "tipo"],
          properties: {
            usuarioId: { type: "integer", example: 1 },
            nome: { type: "string", example: "Pescaria" },
            tipo: {
              type: "string",
              enum: ["receita", "despesa"],
              example: "receita",
            },
            icone: { type: "string", example: "set_meal" },
          },
        },
        Meta: {
          type: "object",
          required: ["usuarioId", "titulo", "alvo"],
          properties: {
            usuarioId: { type: "integer", example: 1 },
            titulo: { type: "string", example: "Viagem para a Antártida" },
            alvo: { type: "number", example: 5000.0 },
            atual: { type: "number", example: 1200.5 },
            icone: { type: "string", example: "flight" },
          },
        },
      },
    },
    paths: {
      // ==========================================
      // CONTROLE DE AUTENTICAÇÃO E USUÁRIOS
      // ==========================================
      "/usuarios/registrar": {
        post: {
          summary: "Registra um novo usuário no banco de dados",
          tags: ["Usuários"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UsuarioRegistro" },
              },
            },
          },
          responses: {
            201: { description: "Usuário criado com sucesso!" },
            400: {
              description: "Erro de validação ou e-mail/CPF já cadastrado.",
            },
            500: { description: "Erro interno do servidor." },
          },
        },
      },
      "/usuarios/login": {
        post: {
          summary: "Autentica o usuário e retorna um token JWT estruturado",
          tags: ["Usuários"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UsuarioLogin" },
              },
            },
          },
          responses: {
            200: { description: "Autenticação bem-sucedida. Token emitido." },
            401: { description: "Credenciais inválidas." },
            500: { description: "Erro interno do servidor." },
          },
        },
      },
      "/usuarios": {
        get: {
          summary:
            "Lista todos os usuários cadastrados (Uso administrativo/testes)",
          tags: ["Usuários"],
          responses: {
            200: { description: "Lista de usuários recuperada com sucesso." },
            500: { description: "Erro interno do servidor." },
          },
        },
      },

      // ==========================================
      // CONTROLE DE TRANSAÇÕES
      // ==========================================
      "/transacoes/adicionar": {
        post: {
          summary: "Cadastra uma nova transação (Receita ou Despesa)",
          tags: ["Transações"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Transacao" },
              },
            },
          },
          responses: {
            201: { description: "Transação adicionada com sucesso!" },
            500: { description: "Erro interno ao salvar transação." },
          },
        },
      },
      "/transacoes/{id}": {
        put: {
          summary: "Atualiza os dados de uma transação existente",
          tags: ["Transações"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Transacao" },
              },
            },
          },
          responses: {
            200: { description: "Transação modificada com sucesso." },
            404: { description: "Transação não encontrada." },
          },
        },
        delete: {
          summary: "Deleta uma transação do banco de dados",
          tags: ["Transações"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Transação removida com sucesso." },
          },
        },
      },
      "/transacoes/usuario/{usuarioId}/todas": {
        get: {
          summary: "Retorna todas as transações de um usuário específico",
          tags: ["Transações"],
          parameters: [
            {
              name: "usuarioId",
              in: "path",
              required: true,
              schema: { type: "integer" },
              description: "ID do usuário",
            },
          ],
          responses: {
            200: { description: "Lista de transações obtida com sucesso." },
            500: { description: "Erro interno do servidor." },
          },
        },
      },
      "/transacoes/usuario/{usuarioId}/gastos-por-categoria": {
        get: {
          summary:
            "Retorna a soma de gastos agrupada por categoria (Gráfico de Pizza de Despesas)",
          tags: ["Transações"],
          parameters: [
            {
              name: "usuarioId",
              in: "path",
              required: true,
              schema: { type: "integer" },
              description: "ID do usuário",
            },
          ],
          responses: {
            200: { description: "Dados de despesas carregados com sucesso." },
            500: { description: "Erro interno do servidor." },
          },
        },
      },
      "/transacoes/usuario/{usuarioId}/receitas-por-categoria": {
        get: {
          summary:
            "Retorna a soma de receitas agrupada por categoria (Gráfico de Pizza de Receitas)",
          tags: ["Transações"],
          parameters: [
            {
              name: "usuarioId",
              in: "path",
              required: true,
              schema: { type: "integer" },
              description: "ID do usuário",
            },
          ],
          responses: {
            200: { description: "Dados de receitas carregados com sucesso." },
            500: { description: "Erro interno do servidor." },
          },
        },
      },
      "/transacoes/usuario/{usuarioId}/relatorio": {
        get: {
          summary: "Gera o relatório mensal filtrado agrupado por tipo",
          tags: ["Transações"],
          parameters: [
            {
              name: "usuarioId",
              in: "path",
              required: true,
              schema: { type: "integer" },
              description: "ID do usuário",
            },
            {
              name: "mes",
              in: "query",
              required: false,
              schema: { type: "integer" },
              description: "Mês do filtro (Ex: 5)",
            },
            {
              name: "ano",
              in: "query",
              required: false,
              schema: { type: "integer" },
              description: "Ano do filtro (Ex: 2026)",
            },
          ],
          responses: {
            200: { description: "Relatório gerado com sucesso." },
            500: { description: "Erro ao gerar relatório." },
          },
        },
      },

      // ==========================================
      // CONTROLE DE CATEGORIAS DINÂMICAS
      // ==========================================
      "/categorias/usuario/{usuarioId}": {
        get: {
          summary:
            "Lista todas as categorias customizadas e padrões de um usuário",
          tags: ["Categorias"],
          parameters: [
            {
              name: "usuarioId",
              in: "path",
              required: true,
              schema: { type: "integer" },
              description: "ID do usuário",
            },
          ],
          responses: {
            200: {
              description:
                "Categorias retornadas com sucesso (popula padrões se vazio).",
            },
            500: { description: "Erro ao buscar categorias." },
          },
        },
      },
      "/categorias": {
        post: {
          summary: "Adiciona uma nova categoria personalizada para o usuário",
          tags: ["Categorias"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Categoria" },
              },
            },
          },
          responses: {
            201: { description: "Categoria personalizada criada com sucesso." },
            400: { description: "Campos obrigatórios ausentes." },
            500: { description: "Erro ao inserir categoria." },
          },
        },
      },
      "/categorias/{id}": {
        put: {
          summary: "Edita o nome e ícone de uma categoria existente",
          tags: ["Categorias"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
              description: "ID único da categoria",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    nome: { type: "string", example: "Alimentação Luxo" },
                    icone: { type: "string", example: "fastfood" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Categoria modificada com sucesso." },
            404: { description: "Categoria não encontrada." },
            500: { description: "Erro ao atualizar categoria." },
          },
        },
        delete: {
          summary: "Remove definitivamente uma categoria do usuário",
          tags: ["Categorias"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
              description: "ID único da categoria",
            },
          ],
          responses: {
            200: { description: "Categoria deletada com sucesso." },
            404: { description: "Categoria não encontrada." },
            500: { description: "Erro ao remover categoria." },
          },
        },
      },

      // ==========================================
      // CONTROLE DE METAS E OBJETIVOS
      // ==========================================
      "/metas/usuario/{usuarioId}": {
        get: {
          summary:
            "Retorna todos os objetivos de poupança salvos para o usuário",
          tags: ["Metas"],
          parameters: [
            {
              name: "usuarioId",
              in: "path",
              required: true,
              schema: { type: "integer" },
              description: "ID do usuário",
            },
          ],
          responses: {
            200: { description: "Lista de metas recuperada." },
            500: { description: "Erro interno do servidor." },
          },
        },
      },
      "/metas": {
        post: {
          summary: "Cria um novo alvo/meta de economia financeira",
          tags: ["Metas"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Meta" },
              },
            },
          },
          responses: {
            201: { description: "Objetivo cadastrado com sucesso." },
            400: { description: "Dados obrigatórios inválidos." },
            500: { description: "Erro interno ao salvar objetivo." },
          },
        },
      },
      "/metas/{id}": {
        put: {
          summary: "Atualiza os alvos e valores de um objetivo de poupança",
          tags: ["Metas"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Meta" },
              },
            },
          },
          responses: {
            200: { description: "Meta alterada com sucesso." },
          },
        },
        delete: {
          summary: "Remove um objetivo financeiro do usuário",
          tags: ["Metas"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Meta excluída com sucesso." },
          },
        },
      },
      "/metas/{id}/depositar": {
        patch: {
          summary: "Adiciona um valor ao progresso atual da meta",
          tags: ["Metas"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
              description: "ID da meta",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["valor"],
                  properties: {
                    valor: {
                      type: "number",
                      example: 250.5,
                      description: "Valor a ser adicionado ao progresso da meta",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Valor depositado na meta com sucesso." },
            400: { description: "Valor inválido ou maior que zero não informado." },
            404: { description: "Meta não encontrada." },
            500: { description: "Erro ao depositar na meta." },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
module.exports = swaggerSpec;
