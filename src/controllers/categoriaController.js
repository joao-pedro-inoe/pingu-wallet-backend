const db = require("../config/db");

const criarTabelaSeNaoExiste = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS categorias (
      id SERIAL PRIMARY KEY,
      usuario_id INTEGER NOT NULL,
      nome VARCHAR(100) NOT NULL,
      tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('despesa', 'receita')),
      icone VARCHAR(50) NOT NULL DEFAULT 'label',
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

const categoriasPadrao = [
  { nome: 'Alimentação',  tipo: 'despesa',  icone: 'restaurant' },
  { nome: 'Transporte',   tipo: 'despesa',  icone: 'directions_car' },
  { nome: 'Moradia',      tipo: 'despesa',  icone: 'home' },
  { nome: 'Saúde',        tipo: 'despesa',  icone: 'favorite' },
  { nome: 'Educação',     tipo: 'despesa',  icone: 'school' },
  { nome: 'Lazer',        tipo: 'despesa',  icone: 'sports_esports' },
  { nome: 'Roupas',       tipo: 'despesa',  icone: 'checkroom' },
  { nome: 'Assinaturas',  tipo: 'despesa',  icone: 'subscriptions' },
  { nome: 'Outros',       tipo: 'despesa',  icone: 'more_horiz' },
  { nome: 'Salário',      tipo: 'receita',  icone: 'work' },
  { nome: 'Freelance',    tipo: 'receita',  icone: 'laptop' },
  { nome: 'Investimento', tipo: 'receita',  icone: 'trending_up' },
  { nome: 'Presente',     tipo: 'receita',  icone: 'card_giftcard' },
  { nome: 'Outros',       tipo: 'receita',  icone: 'more_horiz' },
];

const seedCategoriasPadrao = async (usuarioId) => {
  for (const cat of categoriasPadrao) {
    await db.query(
      "INSERT INTO categorias (usuario_id, nome, tipo, icone) VALUES ($1, $2, $3, $4)",
      [usuarioId, cat.nome, cat.tipo, cat.icone],
    );
  }
};

exports.listarCategorias = async (req, res) => {
  await criarTabelaSeNaoExiste();
  const { usuarioId } = req.params;
  try {
    const result = await db.query(
      "SELECT * FROM categorias WHERE usuario_id = $1 ORDER BY tipo, nome",
      [usuarioId],
    );

    // Se o usuário ainda não tem nenhuma categoria, popula com as padrão
    if (result.rows.length === 0) {
      await seedCategoriasPadrao(usuarioId);
      const resultComPadrao = await db.query(
        "SELECT * FROM categorias WHERE usuario_id = $1 ORDER BY tipo, nome",
        [usuarioId],
      );
      return res.json(resultComPadrao.rows);
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar categorias" });
  }
};

exports.adicionarCategoria = async (req, res) => {
  await criarTabelaSeNaoExiste();
  const { usuarioId, nome, tipo, icone } = req.body;

  if (!usuarioId || !nome || !tipo) {
    return res.status(400).json({ error: "Campos obrigatórios: usuarioId, nome, tipo" });
  }

  try {
    const result = await db.query(
      "INSERT INTO categorias (usuario_id, nome, tipo, icone) VALUES ($1, $2, $3, $4) RETURNING *",
      [usuarioId, nome, tipo, icone || "label"],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao adicionar categoria" });
  }
};

exports.editarCategoria = async (req, res) => {
  const { id } = req.params;
  const { nome, icone } = req.body;

  if (!nome) {
    return res.status(400).json({ error: "O campo nome é obrigatório" });
  }

  try {
    const result = await db.query(
      "UPDATE categorias SET nome = $1, icone = $2 WHERE id = $3 RETURNING *",
      [nome, icone || "label", id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao editar categoria" });
  }
};

exports.deletarCategoria = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "DELETE FROM categorias WHERE id = $1 RETURNING id",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }
    res.json({ message: "Categoria deletada com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar categoria" });
  }
};
