// config/swagger.js
const swaggerJSDoc = require("swagger-jsdoc");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Pingu Wallet API",
      version: "1.0.0",
      description: "Documentação da API de Finanças Árticas",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor Local",
      },
    ],
    // MAPEAMENTO DE TODOS OS 5 ENDPOINTS DE TRANSAÇÕES
    paths: {
      "/transacoes/adicionar": {
        post: {
          summary: "Cadastra uma nova transação (Receita ou Despesa)",
          tags: ["Transações"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    usuarioId: { type: "integer", example: 1 },
                    descricao: { type: "string", example: "Gastei no mercado" },
                    valor: { type: "number", example: 50.5 },
                    tipo: {
                      type: "string",
                      enum: ["receita", "despesa"],
                      example: "despesa",
                    },
                    categoria: { type: "string", example: "Alimentação" },
                    data_transacao: {
                      type: "string",
                      format: "date-time",
                      example: "2026-05-15T20:00:00.000Z",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Transação adicionada com sucesso!" },
            500: { description: "Erro interno ao salvar transação." },
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
              description: "ID do usuário no banco de dados",
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
            "Retorna a soma de gastos agrupada por categoria (Gráfico de Pizza)",
          tags: ["Transações"],
          parameters: [
            {
              name: "usuarioId",
              in: "path",
              required: true,
              schema: { type: "integer" },
              description: "ID do usuário no banco de dados",
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
          summary: "Retorna a soma de receitas agrupada por categoria",
          tags: ["Transações"],
          parameters: [
            {
              name: "usuarioId",
              in: "path",
              required: true,
              schema: { type: "integer" },
              description: "ID do usuário no banco de dados",
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
          summary:
            "Gera o relatório mensal agrupado por tipo (Receita/Despesa)",
          tags: ["Transações"],
          parameters: [
            {
              name: "usuarioId",
              in: "path",
              required: true,
              schema: { type: "integer" },
              description: "ID do usuário no banco de dados",
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
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
module.exports = swaggerSpec;
