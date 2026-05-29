const db = require("../config/db");

exports.adicionarTransacao = async (req, res) => {
  const { usuarioId, descricao, valor, tipo, categoria, data_transacao } =
    req.body;

  try {
    const result = await db.query(
      `INSERT INTO transacoes (usuario_id, descricao, valor, tipo, categoria, data_transacao) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        usuarioId,
        descricao,
        valor,
        tipo,
        categoria,
        data_transacao || new Date(),
      ],
    );
    res
      .status(201)
      .json({ message: "Transação adicionada!", transacao: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno ao salvar transação" });
  }
};

exports.listarTransacoesLimite = async (req, res) => {
  const { usuarioId } = req.params;

  // Se a URL contiver "todas", não aplicamos o limite (deixamos null ou um limite gigante como 1000)
  const limite = req.path.includes("todas")
    ? 1000
    : parseInt(req.query.limite) || 5;

  try {
    const result = await db.query(
      "SELECT * FROM transacoes WHERE usuario_id = $1 ORDER BY data_transacao DESC LIMIT $2",
      [usuarioId, limite],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar transações" });
  }
};

exports.gastosPorCategoria = async (req, res) => {
  const { usuarioId } = req.params;
  try {
    const result = await db.query(
      `SELECT categoria, SUM(valor) AS total
       FROM transacoes
       WHERE usuario_id = $1 AND tipo = 'despesa'
       GROUP BY categoria
       ORDER BY total DESC`,
      [usuarioId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar gastos por categoria" });
  }
};

exports.receitasPorCategoria = async (req, res) => {
  const { usuarioId } = req.params;
  try {
    const result = await db.query(
      `SELECT categoria, SUM(valor) AS total
       FROM transacoes
       WHERE usuario_id = $1 AND tipo = 'receita'
       GROUP BY categoria
       ORDER BY total DESC`,
      [usuarioId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar receitas por categoria" });
  }
};

exports.relatorioMensal = async (req, res) => {
  const { usuarioId } = req.params;
  const { mes, ano } = req.query; // Ex: ?mes=05&ano=2024
  try {
    const result = await db.query(
      `SELECT 
                tipo, 
                SUM(valor) as total 
             FROM transacoes 
             WHERE usuario_id = $1 
             AND EXTRACT(MONTH FROM data_transacao) = $2 
             AND EXTRACT(YEAR FROM data_transacao) = $3
             GROUP BY tipo`,
      [usuarioId, mes, ano],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao gerar relatório" });
  }
};

exports.editarTransacao = async (req, res) => {
  const { id } = req.params;
  const { descricao, valor, tipo, categoria, data_transacao } = req.body;

  if (!descricao || !valor || !tipo || !categoria) {
    return res.status(400).json({ error: "Campos obrigatórios ausentes." });
  }

  try {
    const result = await db.query(
      "UPDATE transacoes SET descricao = $1, valor = $2, tipo = $3, categoria = $4, data_transacao = $5 WHERE id = $6 RETURNING *",
      [descricao, valor, tipo, categoria, data_transacao || new Date(), id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Transação não encontrada." });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao editar transação." });
  }
};

exports.deletarTransacao = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "DELETE FROM transacoes WHERE id = $1 RETURNING id",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Transação não encontrada." });
    }
    res.json({ message: "Transação deletada com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar transação." });
  }
};
