const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const equipamentoRoutes = require("./routes/routes");
app.use("/equipamentos", equipamentoRoutes);

// Disponibiliza o Front-End pelo mesmo servidor.
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/api/status", (req, res) => {
  res.json({ mensagem: "EquipManager API online" });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.use((req, res) => {
  res.status(404).json({ mensagem: "Rota não encontrada" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
