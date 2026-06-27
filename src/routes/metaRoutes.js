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

// Criar nova meta financeira e registrar o aporte inicial
router.post("/", async (req, res) => {
  const { usuarioId, titulo, alvo, atual, icone } = req.body;
  try {
    const valorAtual = atual || 0.0;

    // 1. Cria a meta no banco
    const result = await db.query(
      "INSERT INTO metas (usuario_id, titulo, alvo, atual, icone) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [usuarioId, titulo, alvo, valorAtual, icone || "savings"],
    );

    const novaMeta = result.rows[0];

    // 2. Se o usuário já começou com um valor inicial guardado, cria o registro no histórico!
    if (Number(valorAtual) > 0) {
      await db.query(
        "INSERT INTO depositos_meta (meta_id, valor, descricao) VALUES ($1, $2, $3)",
        [novaMeta.id, valorAtual, "Depósito Inicial"],
      );
    }

    res.status(201).json(novaMeta);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar meta" });
  }
});

// Atualizar uma meta (Nome, Alvo, ou o valor já acumulado)
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { titulo, alvo, icone } = req.body;
  try {
    const result = await db.query(
      "UPDATE metas SET titulo = $1, alvo = $2, icone = $3 WHERE id = $4 RETURNING *",
      [titulo, alvo, icone || "savings", id],
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

// Realizar depósito em uma meta (Soma matemática no banco + Salvar Histórico)
router.patch("/:id/depositar", async (req, res) => {
  const { id } = req.params;
  const { valor } = req.body;

  if (!valor || isNaN(valor) || Number(valor) <= 0) {
    return res
      .status(400)
      .json({ error: "Informe um valor válido maior que zero." });
  }

  try {
    // 1. Atualiza o saldo geral da meta usando matemática segura contra concorrência
    const result = await db.query(
      "UPDATE metas SET atual = atual + $1 WHERE id = $2 RETURNING *",
      [valor, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Meta não encontrada." });
    }

    // 2. Grava o registro cronológico do depósito na tabela depositos_meta
    await db.query(
      "INSERT INTO depositos_meta (meta_id, valor, descricao) VALUES ($1, $2, $3)",
      [id, valor, "Aporte Manual"],
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erro no depósito:", err);
    res.status(500).json({ error: "Erro ao depositar na meta." });
  }
});

// NOVO: Buscar o histórico de todos os depósitos de uma meta específica
router.get("/:id/depositos", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "SELECT * FROM depositos_meta WHERE meta_id = $1 ORDER BY data_deposito DESC",
      [id],
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar histórico da meta:", err);
    res.status(500).json({ error: "Erro ao buscar histórico de depósitos." });
  }
});

// Deletar uma meta (O "ON DELETE CASCADE" do banco vai apagar o histórico automaticamente)
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
