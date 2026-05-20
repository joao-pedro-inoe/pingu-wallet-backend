const express = require("express");
const router = express.Router();
const categoriaController = require("../controllers/categoriaController");

router.get("/usuario/:usuarioId", categoriaController.listarCategorias);
router.post("/", categoriaController.adicionarCategoria);
router.put("/:id", categoriaController.editarCategoria);
router.delete("/:id", categoriaController.deletarCategoria);

module.exports = router;
