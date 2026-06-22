const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Listar todas as metas de um usuário
router.get("/usuario/:usuarioId", async (req, res) => {
  const { usuarioId } = req.params;
  try {
    const result = await db.query(
      "SELECT * FROM metas WHERE usuario_id = $1 ORDER BY criado_em DESC",
      [usuarioId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar metas" });
  }
});

// Criar nova meta financeira
router.post("/", async (req, res) => {
  const { usuarioId, titulo, alvo, atual, icone } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO metas (usuario_id, titulo, alvo, atual, icone) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [usuarioId, titulo, alvo, atual || 0.0, icone || "savings"],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar meta" });
  }
});

// Atualizar uma meta (Nome, Alvo, ou o valor já acumulado)
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { titulo, alvo, atual, icone } = req.body;
  try {
    const result = await db.query(
      "UPDATE metas SET titulo = $1, alvo = $2, atual = $3, icone = $4 WHERE id = $5 RETURNING *",
      [titulo, alvo, atual, icone || "savings", id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Meta não encontrada." });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar meta." });
  }
});

// Depositar valor em uma meta (soma ao campo atual)
router.patch("/:id/depositar", async (req, res) => {
  const { id } = req.params;
  const { valor } = req.body;

  if (!valor || isNaN(valor) || Number(valor) <= 0) {
    return res.status(400).json({ error: "Informe um valor válido maior que zero." });
  }

  try {
    const result = await db.query(
      "UPDATE metas SET atual = atual + $1 WHERE id = $2 RETURNING *",
      [valor, id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Meta não encontrada." });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao depositar na meta." });
  }
});

// Deletar uma meta
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "DELETE FROM metas WHERE id = $1 RETURNING id",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Meta não encontrada." });
    }
    res.json({ message: "Meta removida com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao remover meta." });
  }
});

module.exports = router;
