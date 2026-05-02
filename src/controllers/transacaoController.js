const db = require("../config/db");

exports.adicionarTransacao = async (req, res) => {
  const { usuarioId, descricao, valor, tipo, categoria } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO transacoes (usuario_id, descricao, valor, tipo, categoria) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [usuarioId, descricao, valor, tipo, categoria],
    );
    res
      .status(201)
      .json({ message: "Transação adicionada!", transacao: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno ao salvar transação" });
  }
};

exports.listarTransacoes = async (req, res) => {
  const { usuarioId } = req.params;
  try {
    const result = await db.query(
      "SELECT * FROM transacoes WHERE usuario_id = $1 ORDER BY data_transacao DESC",
      [usuarioId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar transações" });
  }
};
