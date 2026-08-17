# EquipManager — Atividade 4.1

Sistema web para gerenciamento de equipamentos desenvolvido como evolução da API REST do projeto EquipManager. Nesta etapa, a API foi integrada a uma interface visual utilizando **HTML5, CSS3 e JavaScript puro com Fetch API**.

**Instituição:** SENAI Candeias  
**Professor Orientador:** Adalberto Santana  
**Equipe:** Etony Guedes, Geovanna Almeida e Matheus Pereira

---

## Objetivo

Permitir que o usuário realize as operações do CRUD diretamente pelo navegador, sem depender do Postman para utilizar o sistema.

O fluxo completo é:

```text
Front-End → Fetch API → Express → MySQL
     ↑                         ↓
     └──── atualização da tela ┘
```

---

## Funcionalidades

- Cadastro de equipamentos;
- Consulta de equipamentos;
- Busca por nome, categoria, patrimônio, localização ou status;
- Edição de equipamentos;
- Exclusão de equipamentos;
- Indicadores de quantidade de equipamentos;
- Identificação do status da API;
- Persistência dos dados no MySQL;
- Interface responsiva para desktop e dispositivos menores.

---

## Tecnologias

- HTML5
- CSS3
- JavaScript
- Fetch API
- Node.js
- Express
- MySQL
- MySQL2
- CORS
- Postman

---

## Estrutura do projeto

```text
equipmanager-atividade-4.1/
│
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── .env.example
│   ├── controllers/
│   │   └── controller.js
│   ├── routes/
│   │   └── routes.js
│   ├── package.json
│   └── server.js
│
├── database/
│   └── script.sql
│
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── script.js
│   └── index.html
│
├── postman/
│   └── collection.json
│
├── docs/
│   └── demo.gif
│
├── .gitignore
└── README.md
```

> **Observação:** a pasta `docs/` fica preparada para o GIF ou vídeo curto exigido pela atividade. Depois de gravar a demonstração, coloque o arquivo `demo.gif` nessa pasta e adicione a imagem ao README, conforme a seção abaixo.

---

## 1. Pré-requisitos

Tenha instalado:

- Node.js;
- MySQL Server;
- Git;
- Navegador atualizado.

---

## 2. Configuração do banco de dados

Abra o MySQL Workbench ou outro cliente MySQL e execute:

```sql
SOURCE caminho/para/database/script.sql;
```

Ou copie e execute o conteúdo de `database/script.sql`.

O script cria:

```text
equipmanager
└── equipamentos
```

A tabela possui os campos:

| Campo | Tipo | Regra |
|---|---|---|
| id | INT | Chave primária, auto incremento |
| nome | VARCHAR(100) | Obrigatório |
| categoria | VARCHAR(50) | Obrigatório |
| patrimonio | VARCHAR(50) | Obrigatório e único |
| localizacao | VARCHAR(100) | Obrigatório |
| status | VARCHAR(30) | Padrão: Disponível |

---

## 3. Configuração da conexão

Entre na pasta `backend` e crie um arquivo `.env` baseado em `.env.example`:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=equipmanager
```

Se o seu usuário `root` não tiver senha, deixe:

```env
DB_PASSWORD=
```

O arquivo `.env` não deve ser enviado para o GitHub, pois está incluído no `.gitignore`.

---

## 4. Instalação do Back-End

No terminal:

```bash
cd backend
npm install
```

---

## 5. Inicialização do sistema

Para iniciar normalmente:

```bash
node server.js
```

Ou:

```bash
npm start
```

Durante o desenvolvimento, também é possível utilizar:

```bash
npm run dev
```

Quando o servidor iniciar corretamente, será exibido:

```text
Servidor rodando em http://localhost:3000
MySQL conectado!
```

---

## 6. Abrindo o Front-End

O próprio Express disponibiliza a pasta `frontend/`.

Depois de iniciar o Back-End, abra no navegador:

```text
http://localhost:3000
```

Não é necessário abrir o `index.html` diretamente pelo explorador de arquivos.

---

## 7. Operações CRUD

### CREATE — Cadastrar

Preencha:

- Nome;
- Categoria;
- Patrimônio;
- Localização.

Clique em **Cadastrar equipamento**.

O JavaScript envia uma requisição `POST` para:

```text
POST /equipamentos
```

O registro é salvo no MySQL e a tabela é atualizada automaticamente.

### READ — Consultar

Ao abrir a aplicação, o JavaScript executa:

```text
GET /equipamentos
```

Os registros são carregados na tabela.

### UPDATE — Atualizar

Clique em **Editar** em um equipamento.

O formulário será preenchido e o usuário poderá alterar os dados e o status.

A aplicação envia:

```text
PUT /equipamentos/:id
```

### DELETE — Excluir

Clique em **Excluir**, confirme a operação e a aplicação enviará:

```text
DELETE /equipamentos/:id
```

Após a exclusão, a listagem é atualizada automaticamente.

---

## 8. Endpoints da API

| Método | Endpoint | Função |
|---|---|---|
| GET | `/equipamentos` | Lista todos |
| GET | `/equipamentos/:id` | Busca por ID |
| POST | `/equipamentos` | Cadastra |
| PUT | `/equipamentos/:id` | Atualiza |
| DELETE | `/equipamentos/:id` | Remove |

---

## 9. Exemplo de cadastro

```json
{
  "nome": "Notebook Dell",
  "categoria": "Informática",
  "patrimonio": "NT001",
  "localizacao": "Laboratório 01"
}
```

---

## 10. Demonstração visual

### CRUD funcionando de ponta a ponta

Adicione aqui o GIF ou vídeo curto solicitado pela Atividade 4.1:

```text
![Demonstração do EquipManager](docs/demo.gif)
```

A gravação deve mostrar, preferencialmente, o seguinte fluxo:

1. Abrir o sistema no navegador;
2. Cadastrar um equipamento;
3. Mostrar o equipamento aparecendo na tabela;
4. Editar o equipamento;
5. Mostrar a alteração na tela;
6. Excluir o equipamento;
7. Mostrar que o registro foi removido.

---

## 11. Testes com Postman

A coleção de testes está em:

```text
postman/collection.json
```

Ela contém requisições para:

- GET — listar;
- GET — buscar por ID;
- POST — cadastrar;
- PUT — atualizar;
- DELETE — remover.

O Postman continua disponível para validação da API, enquanto o Front-End permite que o usuário realize as mesmas operações pelo navegador.

---

## 12. Integração completa

O projeto atende à proposta da Atividade 4.1 ao integrar as três camadas:

```text
┌───────────────────────────┐
│         FRONT-END         │
│ HTML + CSS + JavaScript   │
│       Fetch API           │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│          BACK-END         │
│     Node.js + Express     │
│         API REST          │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│           MYSQL           │
│       equipmanager        │
│        equipamentos       │
└───────────────────────────┘
```

---

## Autores

**Etony Guedes, Geovanna Almeida e Matheus Pereira**

Projeto desenvolvido para a disciplina de Backend / Atividade 4.1 — SENAI Candeias.
