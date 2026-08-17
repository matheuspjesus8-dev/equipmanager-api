const db = require("../config/db");

// GET - listar equipamentos
exports.listar = (req, res) => {
  db.query("SELECT * FROM equipamentos ORDER BY id DESC", (erro, resultados) => {
    if (erro) {
      return res.status(500).json({ mensagem: "Erro ao listar equipamentos" });
    }

    res.status(200).json(resultados);
  });
};

// GET - buscar equipamento por ID
exports.buscarPorId = (req, res) => {
  const id = req.params.id;

  db.query("SELECT * FROM equipamentos WHERE id = ?", [id], (erro, resultados) => {
    if (erro) {
      return res.status(500).json({ mensagem: "Erro ao buscar equipamento" });
    }

    if (resultados.length === 0) {
      return res.status(404).json({ mensagem: "Equipamento não encontrado" });
    }

    res.status(200).json(resultados[0]);
  });
};

// POST - cadastrar equipamento
exports.criar = (req, res) => {
  const { nome, categoria, patrimonio, localizacao } = req.body;

  if (!nome || !categoria || !patrimonio || !localizacao) {
    return res.status(400).json({ mensagem: "Todos os campos são obrigatórios" });
  }

  db.query(
    "SELECT id FROM equipamentos WHERE patrimonio = ?",
    [patrimonio],
    (erro, resultado) => {
      if (erro) {
        return res.status(500).json({ mensagem: "Erro ao verificar patrimônio" });
      }

      if (resultado.length > 0) {
        return res.status(400).json({
          mensagem: "Já existe um equipamento com esse patrimônio"
        });
      }

      const sql = `
        INSERT INTO equipamentos (nome, categoria, patrimonio, localizacao)
        VALUES (?, ?, ?, ?)
      `;

      db.query(sql, [nome, categoria, patrimonio, localizacao], (erro, resultado) => {
        if (erro) {
          return res.status(500).json({ mensagem: "Erro ao cadastrar equipamento" });
        }

        res.status(201).json({
          mensagem: "Equipamento cadastrado",
          id: resultado.insertId
        });
      });
    }
  );
};

// PUT - atualizar equipamento
exports.atualizar = (req, res) => {
  const id = req.params.id;
  const { nome, categoria, localizacao, status } = req.body;

  if (!nome || !categoria || !localizacao || !status) {
    return res.status(400).json({ mensagem: "Todos os campos são obrigatórios" });
  }

  db.query("SELECT id FROM equipamentos WHERE id = ?", [id], (erro, resultado) => {
    if (erro) {
      return res.status(500).json({ mensagem: "Erro ao verificar equipamento" });
    }

    if (resultado.length === 0) {
      return res.status(404).json({ mensagem: "Equipamento não encontrado" });
    }

    const sql = `
      UPDATE equipamentos
      SET nome = ?, categoria = ?, localizacao = ?, status = ?
      WHERE id = ?
    `;

    db.query(sql, [nome, categoria, localizacao, status, id], (erro) => {
      if (erro) {
        return res.status(500).json({ mensagem: "Erro ao atualizar equipamento" });
      }

      res.status(200).json({ mensagem: "Equipamento atualizado" });
    });
  });
};

// DELETE - remover equipamento
exports.remover = (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM equipamentos WHERE id = ?", [id], (erro, resultado) => {
    if (erro) {
      return res.status(500).json({ mensagem: "Erro ao remover equipamento" });
    }

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: "Equipamento não encontrado" });
    }

    res.status(200).json({ mensagem: "Equipamento removido" });
  });
};
