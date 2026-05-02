const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/db"); // Testa a conexão com o banco

// Importando as Rotas
const usuarioRoutes = require("./routes/usuarioRoutes");
const transacaoRoutes = require("./routes/transacaoRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Registrando as rotas no servidor
app.use("/usuarios", usuarioRoutes);
app.use("/transacoes", transacaoRoutes);

// Rota de Teste para garantir que a API está viva
app.get("/ping", (req, res) => {
  res.json({ message: "Pong! A API está funcionando perfeitamente." });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
