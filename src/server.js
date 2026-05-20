const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger.js");
require("dotenv").config();
const db = require("./config/db"); // Testa a conexão com o banco

// Importando as Rotas
const usuarioRoutes = require("./routes/usuarioRoutes");
const transacaoRoutes = require("./routes/transacaoRoutes");
const categoriaRoutes = require("./routes/categoriaRoutes");

const app = express();

// Middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Registrando as rotas no servidor
app.use("/usuarios", usuarioRoutes);
app.use("/transacoes", transacaoRoutes);
app.use("/categorias", categoriaRoutes);

// Rota de Teste para garantir que a API está viva
app.get("/ping", (req, res) => {
  res.json({ message: "Pong! A API está funcionando perfeitamente." });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n🚀 =================================================`);
  console.log(`🚀 Servidor Pingu Wallet rodando com sucesso!`);
  console.log(
    `🚀 Acesse a Documentação Swagger em: http://localhost:${PORT}/api-docs`,
  );
  console.log(`🚀 =================================================\n`);
});
