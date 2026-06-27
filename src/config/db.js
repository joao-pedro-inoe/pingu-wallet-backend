const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Fazendo um teste real de conexão assim que o arquivo é lido
pool.query("SELECT NOW()", async (err, res) => {
  if (err) {
    console.error("❌ Erro ao conectar ao banco de dados:", err.stack);
  } else {
    console.log("✅ Conectado ao banco de dados PostgreSQL com sucesso!");

    try {
      // Criação automática da tabela de Usuários
      const initQuery = `
                CREATE TABLE IF NOT EXISTS usuarios (
                    id SERIAL PRIMARY KEY,
                    nome VARCHAR(100) NOT NULL,
                    idade INTEGER NOT NULL,
                    cpf VARCHAR(14) UNIQUE NOT NULL,
                    cep VARCHAR(9) NOT NULL,
                    email VARCHAR(100) UNIQUE NOT NULL,
                    senha VARCHAR(255) NOT NULL,
                    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS transacoes (
                    id SERIAL PRIMARY KEY,
                    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
                    descricao VARCHAR(255) NOT NULL,
                    valor DECIMAL(10,2) NOT NULL,
                    tipo VARCHAR(10) CHECK (tipo IN ('receita', 'despesa')) NOT NULL,
                    categoria VARCHAR(50) NOT NULL,
                    data_transacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                
                CREATE TABLE IF NOT EXISTS metas (
                    id SERIAL PRIMARY KEY,
                    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
                    titulo VARCHAR(100) NOT NULL,
                    alvo DECIMAL(10,2) NOT NULL,
                    atual DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                    icone VARCHAR(50) NOT NULL DEFAULT 'savings',
                    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS depositos_meta (
                    id SERIAL PRIMARY KEY,
                    meta_id INTEGER REFERENCES metas(id) ON DELETE CASCADE,
                    valor DECIMAL(10, 2) NOT NULL,
                    descricao VARCHAR(255) DEFAULT 'Aporte',
                    data_deposito TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `;
      await pool.query(initQuery);
      console.log(
        "📦 Tabela de USUÁRIOS, TRANSAÇÕES e Metas prontas para uso!",
      );
    } catch (tableErr) {
      console.error("❌ Erro ao criar as tabelas:", tableErr.stack);
    }
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
