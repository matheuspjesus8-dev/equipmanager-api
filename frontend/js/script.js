const API_URL = "/equipamentos";

const form = document.getElementById("equipmentForm");
const tableBody = document.getElementById("equipmentTableBody");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const message = document.getElementById("message");
const equipmentId = document.getElementById("equipmentId");
const formTitle = document.getElementById("formTitle");
const submitButton = document.getElementById("submitButton");
const cancelEdit = document.getElementById("cancelEdit");
const statusField = document.getElementById("statusField");
const statusInput = document.getElementById("status");
const refreshButton = document.getElementById("refreshButton");
const apiStatus = document.getElementById("apiStatus");
const totalEquipamentos = document.getElementById("totalEquipamentos");
const disponiveis = document.getElementById("disponiveis");
const emUso = document.getElementById("emUso");

const deleteModal = document.getElementById("deleteModal");
const deleteText = document.getElementById("deleteText");
const cancelDelete = document.getElementById("cancelDelete");
const confirmDelete = document.getElementById("confirmDelete");

let equipamentos = [];
let equipamentoParaExcluir = null;

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showMessage(text = "", type = "") {
  message.textContent = text;
  message.className = `message ${type}`.trim();

  if (text) {
    window.clearTimeout(showMessage.timer);
    showMessage.timer = window.setTimeout(() => {
      message.textContent = "";
      message.className = "message";
    }, 4000);
  }
}

function setApiStatus(online) {
  apiStatus.classList.toggle("online", online);
  apiStatus.classList.toggle("offline", !online);
  apiStatus.querySelector("span:last-child").textContent = online ? "API conectada" : "API indisponível";
}

function statusClass(status) {
  const normalized = String(status || "").toLowerCase();
  if (normalized.includes("dispon")) return "status-disponivel";
  if (normalized.includes("uso")) return "status-uso";
  if (normalized.includes("manut")) return "status-manutencao";
  return "status-indisponivel";
}

function updateStats(list) {
  totalEquipamentos.textContent = list.length;
  disponiveis.textContent = list.filter(item => String(item.status).toLowerCase() === "disponível").length;
  emUso.textContent = list.filter(item => String(item.status).toLowerCase() === "em uso").length;
}

function renderTable(list = equipamentos) {
  tableBody.innerHTML = "";

  if (!list.length) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  list.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="id-cell">#${escapeHtml(item.id)}</td>
      <td class="name-cell">${escapeHtml(item.nome)}</td>
      <td>${escapeHtml(item.categoria)}</td>
      <td>${escapeHtml(item.patrimonio)}</td>
      <td>${escapeHtml(item.localizacao)}</td>
      <td><span class="status-badge ${statusClass(item.status)}">${escapeHtml(item.status)}</span></td>
      <td>
        <div class="action-buttons">
          <button class="action-button edit-button" data-action="edit" data-id="${item.id}">Editar</button>
          <button class="action-button delete-button" data-action="delete" data-id="${item.id}">Excluir</button>
        </div>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

async function carregarEquipamentos() {
  try {
    refreshButton.disabled = true;
    refreshButton.textContent = "Carregando...";

    const response = await fetch(API_URL);
    const data = await response.json();

    if (!response.ok) throw new Error(data.mensagem || "Não foi possível carregar os equipamentos.");

    equipamentos = data;
    renderTable(equipamentos);
    updateStats(equipamentos);
    setApiStatus(true);
  } catch (error) {
    setApiStatus(false);
    showMessage(error.message || "Erro ao conectar com a API.", "error");
    equipamentos = [];
    renderTable([]);
    updateStats([]);
  } finally {
    refreshButton.disabled = false;
    refreshButton.textContent = "Atualizar";
  }
}

async function verificarApi() {
  try {
    const response = await fetch("/api/status");
    setApiStatus(response.ok);
  } catch {
    setApiStatus(false);
  }
}

function limparFormulario() {
  form.reset();

  const campos = form.querySelectorAll("input, select");

  campos.forEach((campo) => {
    campo.classList.remove("input-error", "input-success");
  });

  equipmentId.value = "";
  statusInput.value = "Disponível";
  statusField.classList.add("hidden");
  formTitle.textContent = "Novo equipamento";
  submitButton.innerHTML = "<span>+</span> Cadastrar equipamento";
  cancelEdit.classList.add("hidden");
}

function iniciarEdicao(item) {
  equipmentId.value = item.id;
  document.getElementById("nome").value = item.nome;
  document.getElementById("categoria").value = item.categoria;
  document.getElementById("patrimonio").value = item.patrimonio;
  document.getElementById("localizacao").value = item.localizacao;
  statusInput.value = item.status || "Disponível";

  statusField.classList.remove("hidden");
  formTitle.textContent = "Editar equipamento";
  submitButton.innerHTML = "Salvar alterações";
  cancelEdit.classList.remove("hidden");
  document.querySelector(".form-panel").scrollIntoView({ behavior: "smooth", block: "start" });
}

function validarFormulario() {
  const campos = [
    document.getElementById("nome"),
    document.getElementById("categoria"),
    document.getElementById("patrimonio"),
    document.getElementById("localizacao")
  ];

  let formularioValido = true;

  campos.forEach((campo) => {
    const valor = campo.value.trim();

    campo.classList.remove("input-error", "input-success");

    if (!valor) {
      campo.classList.add("input-error");
      formularioValido = false;
    } else {
      campo.classList.add("input-success");
    }
  });

  return formularioValido;
}

async function salvarEquipamento(event) {
  event.preventDefault();

  const id = equipmentId.value;

  const payload = {
    nome: document.getElementById("nome").value.trim(),
    categoria: document.getElementById("categoria").value.trim(),
    patrimonio: document.getElementById("patrimonio").value.trim(),
    localizacao: document.getElementById("localizacao").value.trim()
  };

  if (!validarFormulario()) {
    showMessage("Preencha todos os campos obrigatórios.", "error");
    return;
  }

  const isEditing = Boolean(id);

  if (isEditing) {
    payload.status = statusInput.value;
    delete payload.patrimonio;
  }

  try {
    submitButton.disabled = true;
    submitButton.textContent = isEditing ? "Salvando..." : "Cadastrando...";

    const response = await fetch(isEditing ? `${API_URL}/${id}` : API_URL, {
      method: isEditing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.mensagem || "Não foi possível salvar o equipamento.");
    }

    showMessage(data.mensagem || "Operação realizada com sucesso.", "success");
    limparFormulario();
    await carregarEquipamentos();

  } catch (error) {
    showMessage(error.message || "Erro ao salvar equipamento.", "error");

  } finally {
    submitButton.disabled = false;

    if (equipmentId.value) {
      submitButton.textContent = "Salvar alterações";
    } else {
      submitButton.innerHTML = "<span>+</span> Cadastrar equipamento";
    }
  }
}

function abrirModalExclusao(item) {
  equipamentoParaExcluir = item;
  deleteText.textContent = `O equipamento “${item.nome}” será removido permanentemente.`;
  deleteModal.classList.remove("hidden");
}

function fecharModalExclusao() {
  equipamentoParaExcluir = null;
  deleteModal.classList.add("hidden");
}

async function excluirEquipamento() {
  if (!equipamentoParaExcluir) return;

  try {
    confirmDelete.disabled = true;
    confirmDelete.textContent = "Excluindo...";

    const response = await fetch(`${API_URL}/${equipamentoParaExcluir.id}`, { method: "DELETE" });
    const data = await response.json();

    if (!response.ok) throw new Error(data.mensagem || "Não foi possível excluir o equipamento.");

    fecharModalExclusao();
    showMessage(data.mensagem || "Equipamento removido.", "success");
    await carregarEquipamentos();
  } catch (error) {
    showMessage(error.message || "Erro ao excluir equipamento.", "error");
  } finally {
    confirmDelete.disabled = false;
    confirmDelete.textContent = "Excluir";
  }
}

tableBody.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const id = Number(button.dataset.id);
  const item = equipamentos.find(equipamento => Number(equipamento.id) === id);
  if (!item) return;

  if (button.dataset.action === "edit") iniciarEdicao(item);
  if (button.dataset.action === "delete") abrirModalExclusao(item);
});

searchInput.addEventListener("input", () => {
  const term = searchInput.value.trim().toLowerCase();
  const filtered = equipamentos.filter(item =>
    [item.nome, item.categoria, item.patrimonio, item.localizacao, item.status]
      .some(value => String(value ?? "").toLowerCase().includes(term))
  );

  renderTable(filtered);
});

form.addEventListener("submit", salvarEquipamento);
cancelEdit.addEventListener("click", limparFormulario);
refreshButton.addEventListener("click", carregarEquipamentos);
cancelDelete.addEventListener("click", fecharModalExclusao);
confirmDelete.addEventListener("click", excluirEquipamento);
deleteModal.addEventListener("click", (event) => {
  if (event.target === deleteModal) fecharModalExclusao();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") fecharModalExclusao();
});

verificarApi();
carregarEquipamentos();
