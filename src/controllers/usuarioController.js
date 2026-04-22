const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Senha secreta para o JWT (No futuro, coloque isso no .env)
const JWT_SECRET = process.env.JWT_SECRET || 'chave_super_secreta_do_projeto';

// 1. CRIAR USUÁRIO (Sign Up)
exports.registrar = async (req, res) => {
    const { nome, idade, cpf, cep, email, senha } = req.body;

    try {
        // Verifica se CPF ou E-mail já existem
        const userExists = await db.query('SELECT * FROM usuarios WHERE email = $1 OR cpf = $2', [email, cpf]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'E-mail ou CPF já cadastrado.' });
        }

        // Criptografa a senha
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        // Salva no banco
        const result = await db.query(
            'INSERT INTO usuarios (nome, idade, cpf, cep, email, senha) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, nome, email',
            [nome, idade, cpf, cep, email, senhaHash]
        );

        res.status(201).json({ message: 'Usuário criado com sucesso!', usuario: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro interno ao criar usuário' });
    }
};

// 2. FAZER LOGIN (Sign In)
exports.login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Busca o usuário pelo e-mail
        const result = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
        }

        // Compara a senha digitada com a senha do banco
        const senhaValida = await bcrypt.compare(senha, user.senha);
        if (!senhaValida) {
            return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
        }

        // Gera o Token de Sessão (válido por 7 dias)
        const token = jwt.sign({ id: user.id, nome: user.nome }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            message: 'Login bem-sucedido!',
            token: token,
            usuario: { id: user.id, nome: user.nome, email: user.email }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro interno ao fazer login' });
    }
};

// 3. LISTAR USUÁRIOS (Apenas para teste do CRUD, sem mostrar senhas)
exports.listarUsuarios = async (req, res) => {
    try {
        const result = await db.query('SELECT id, nome, idade, cpf, cep, email, criado_em FROM usuarios');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
};