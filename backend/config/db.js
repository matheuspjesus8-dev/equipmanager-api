const mysql = require("mysql2");
require("dotenv").config();

const conexao = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "equipmanager"
});

conexao.connect((erro) => {
  if (erro) {
    console.error("Erro ao conectar no banco:", erro.message);
    return;
  }

  console.log("MySQL conectado!");
});

module.exports = conexao;
