const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Senha secreta para o JWT
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error(
    "ERRO: A variável JWT_SECRET não está definida no arquivo .env",
  );
}

// 1. CRIAR USUÁRIO (Sign Up)
exports.registrar = async (req, res) => {
  const { nome, idade, cpf, cep, email, senha } = req.body;

  try {
    // Verifica se CPF ou E-mail já existem
    const userExists = await db.query(
      "SELECT * FROM usuarios WHERE email = $1 OR cpf = $2",
      [email, cpf],
    );
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: "E-mail ou CPF já cadastrado." });
    }

    // Criptografa a senha
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    // Salva no banco
    const result = await db.query(
      "INSERT INTO usuarios (nome, idade, cpf, cep, email, senha) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, nome, email",
      [nome, idade, cpf, cep, email, senhaHash],
    );

    res
      .status(201)
      .json({
        message: "Usuário criado com sucesso!",
        usuario: result.rows[0],
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno ao criar usuário" });
  }
};

// 2. FAZER LOGIN (Sign In)
exports.login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Busca o usuário pelo e-mail
    const result = await db.query("SELECT * FROM usuarios WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "E-mail ou senha incorretos." });
    }

    // Compara a senha digitada com a senha do banco
    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: "E-mail ou senha incorretos." });
    }

    // Gera o Token de Sessão (válido por 7 dias)
    const token = jwt.sign({ id: user.id, nome: user.nome }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login bem-sucedido!",
      token: token,
      usuario: { id: user.id, nome: user.nome, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno ao fazer login" });
  }
};

// 3. LISTAR USUÁRIOS (Apenas para teste do CRUD, sem mostrar senhas)
exports.listarUsuarios = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, nome, idade, cpf, cep, email, criado_em FROM usuarios",
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
};

// 4. BUSCAR USUÁRIO POR ID
exports.getUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "SELECT id, nome, idade, cpf, cep, email, criado_em FROM usuarios WHERE id = $1",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
};

// 5. ATUALIZAR DADOS DO USUÁRIO
exports.atualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nome, idade, cep, email, senhaAtual, novaSenha } = req.body;

  if (!nome || !idade || !cep || !email) {
    return res.status(400).json({ error: "Campos obrigatórios ausentes." });
  }

  try {
    const userResult = await db.query("SELECT * FROM usuarios WHERE id = $1", [
      id,
    ]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    const user = userResult.rows[0];

    // Verifica se o novo e-mail já pertence a outro usuário
    if (email !== user.email) {
      const emailExists = await db.query(
        "SELECT id FROM usuarios WHERE email = $1 AND id != $2",
        [email, id],
      );
      if (emailExists.rows.length > 0) {
        return res
          .status(400)
          .json({ error: "E-mail já cadastrado por outro usuário." });
      }
    }

    if (novaSenha) {
      // Troca de senha: valida a senha atual
      if (!senhaAtual) {
        return res
          .status(400)
          .json({ error: "Senha atual obrigatória para alterar a senha." });
      }
      const senhaValida = await bcrypt.compare(senhaAtual, user.senha);
      if (!senhaValida) {
        return res.status(401).json({ error: "Senha atual incorreta." });
      }
      const salt = await bcrypt.genSalt(10);
      const novaSenhaHash = await bcrypt.hash(novaSenha, salt);
      await db.query(
        "UPDATE usuarios SET nome = $1, idade = $2, cep = $3, email = $4, senha = $5 WHERE id = $6",
        [nome, idade, cep, email, novaSenhaHash, id],
      );
    } else {
      await db.query(
        "UPDATE usuarios SET nome = $1, idade = $2, cep = $3, email = $4 WHERE id = $5",
        [nome, idade, cep, email, id],
      );
    }

    res.json({ message: "Dados atualizados com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
};
