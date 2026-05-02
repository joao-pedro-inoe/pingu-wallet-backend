const express = require("express");
const router = express.Router();
const transacaoController = require("../controllers/transacaoController");

router.post("/adicionar", transacaoController.adicionarTransacao);
router.get("/usuario/:usuarioId", transacaoController.listarTransacoes);

module.exports = router;
