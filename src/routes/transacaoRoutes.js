const express = require("express");
const router = express.Router();
const transacaoController = require("../controllers/transacaoController");

router.post("/adicionar", transacaoController.adicionarTransacao);
router.get("/usuario/:usuarioId", transacaoController.listarTransacoes);
router.get("/usuario/:usuarioId/gastos-por-categoria", transacaoController.gastosPorCategoria);
router.get("/usuario/:usuarioId/receitas-por-categoria", transacaoController.receitasPorCategoria);

module.exports = router;
