const express = require("express");
const router = express.Router();
const transacaoController = require("../controllers/transacaoController");

// ==========================================
// DEFINIÇÃO DOS SCHEMAS DO SWAGGER (Ajustado)
// ==========================================

/**
 * @swagger
 * components:
 * schemas:
 * Transacao:
 * type: object
 * required:
 * - usuario_id
 * - descricao
 * - valor
 * - tipo
 * - categoria
 * properties:
 * id:
 * type: integer
 * description: ID autogerado da transação
 * usuario_id:
 * type: integer
 * description: ID do usuário dono da transação
 * descricao:
 * type: string
 * description: Descrição do gasto ou receita
 * valor:
 * type: number
 * description: Valor monetário da transação
 * tipo:
 * type: string
 * enum: [receita, despesa]
 * description: Tipo da transação
 * categoria:
 * type: string
 * description: Categoria (ex. Alimentação, Transporte)
 * data_transacao:
 * type: string
 * format: date-time
 * description: Data de criação
 */

// ==========================================
// ROTAS DO SISTEMA (E DOCUMENTAÇÃO)
// ==========================================

router.post("/adicionar", transacaoController.adicionarTransacao);

/**
 * @swagger
 * /transacoes/usuario/{usuarioId}/todas:
 * get:
 * summary: Retorna todas as transações de um usuário específico
 * tags: [Transações]
 * parameters:
 * - in: path
 * name: usuarioId
 * required: true
 * schema:
 * type: integer
 * description: ID do usuário
 * responses:
 * 200:
 * description: Lista de transações obtida com sucesso.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Transacao'
 * 500:
 * description: Erro interno do servidor.
 */
router.get(
  "/usuario/:usuarioId/todas",
  transacaoController.listarTransacoesLimite,
);

/**
 * @swagger
 * /transacoes/usuario/{usuarioId}/gastos-por-categoria:
 * get:
 * summary: Retorna a soma de gastos agrupada por categoria
 * tags: [Transações]
 * parameters:
 * - in: path
 * name: usuarioId
 * required: true
 * schema:
 * type: integer
 * description: ID do usuário
 * responses:
 * 200:
 * description: Dados para o gráfico de pizza carregados com sucesso.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * type: object
 * 500:
 * description: Erro interno do servidor.
 */
router.get(
  "/usuario/:usuarioId/gastos-por-categoria",
  transacaoController.gastosPorCategoria,
);

router.get(
  "/usuario/:usuarioId/receitas-por-categoria",
  transacaoController.receitasPorCategoria,
);

router.get(
  "/usuario/:usuarioId/relatorio",
  transacaoController.relatorioMensal,
);

// Atualizar uma transação existente
router.put("/:id", transacaoController.editarTransacao);

// Deletar uma transação existente
router.delete("/:id", transacaoController.deletarTransacao);

module.exports = router;
