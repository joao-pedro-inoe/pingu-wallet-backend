const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Fazendo um teste real de conexão assim que o arquivo é lido
pool.query('SELECT NOW()', async (err, res) => {
    if (err) {
        console.error('❌ Erro ao conectar ao banco de dados:', err.stack);
    } else {
        console.log('✅ Conectado ao banco de dados PostgreSQL com sucesso!');
        
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
            `;
            await pool.query(initQuery);
            console.log('📦 Tabela de USUÁRIOS pronta para uso!');
        } catch (tableErr) {
            console.error('❌ Erro ao criar a tabela de usuários:', tableErr.stack);
        }
    }
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};