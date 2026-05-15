TaskFlow — App de Gerenciamento de Tarefas (v1)
Aplicação full-stack de gerenciamento de tarefas com autenticação JWT, dashboard de produtividade, CRUD completo de tarefas com subtarefas, categorias e tags. Stack: React (Vite) no frontend + Node.js (Express) no backend + SQLite via better-sqlite3.

Visão Geral da Arquitetura
antigravity-agents-project/
├── backend/                  # API Node.js + Express
│   ├── src/
│   │   ├── db/               # Conexão SQLite + migrations
│   │   ├── routes/           # Rotas Express (auth, tasks, categories, tags, dashboard)
│   │   ├── middleware/        # JWT auth, rate limit, validação
│   │   └── index.js          # Entry point
│   ├── .env
│   └── package.json
└── frontend/                 # React + Vite
    ├── src/
    │   ├── pages/            # Login, Register, Dashboard, Tasks, Kanban, Calendar
    │   ├── components/       # Componentes reutilizáveis
    │   ├── hooks/            # useAuth, useTasks, etc.
    │   ├── api/              # Axios + interceptors
    │   └── main.jsx
    └── package.json
Decisões de Design
IMPORTANT

O frontend usará React Router para navegação SPA. O backend rodará na porta 3333 e o frontend na porta 5173 (Vite padrão). O CORS será configurado para permitir apenas localhost:5173 em dev.

NOTE

Banco de dados SQLite com arquivo taskflow.db na raiz do backend/. As migrations serão executadas automaticamente na inicialização do servidor via script interno — sem dependência de ferramenta externa.

Modelo de Dados
Tabelas SQLite
Tabela	Campos principais
users	id, name, email, password_hash, created_at
categories	id, user_id, name, color, icon
tags	id, user_id, name, color
tasks	id, user_id, title, description, status, priority, category_id, due_date, recurrence, created_at, updated_at, archived_at
subtasks	id, task_id, title, done, position
task_tags	task_id, tag_id
Status possíveis: pending | in_progress | done
Prioridades: low | medium | high | urgent

Proposed Changes
Backend — Node.js + Express + SQLite
[NEW] backend/package.json
Dependências: express, better-sqlite3, bcryptjs, jsonwebtoken, dotenv, cors, express-rate-limit, zod

[NEW] backend/src/db/database.js
Conexão singleton com SQLite + execução automática das migrations na inicialização.

[NEW] backend/src/db/migrations.js
SQL de criação de todas as tabelas (CREATE TABLE IF NOT EXISTS).

[NEW] backend/src/middleware/auth.js
Middleware JWT: extrai Bearer token, verifica, injeta req.userId.

[NEW] backend/src/routes/auth.js
POST /api/auth/register — cadastro com bcrypt hash
POST /api/auth/login — valida senha, devolve JWT
[NEW] backend/src/routes/tasks.js
GET /api/tasks — lista com filtros (status, priority, category, tags, search, order)
POST /api/tasks — criação
PUT /api/tasks/:id — edição
DELETE /api/tasks/:id — soft delete (archived_at)
PATCH /api/tasks/:id/status — atualização rápida de status
[NEW] backend/src/routes/subtasks.js
POST /api/tasks/:id/subtasks
PUT /api/subtasks/:id
DELETE /api/subtasks/:id
[NEW] backend/src/routes/categories.js
CRUD completo de categorias por usuário.

[NEW] backend/src/routes/tags.js
CRUD completo de tags por usuário.

[NEW] backend/src/routes/dashboard.js
GET /api/dashboard — retorna:
Total de tarefas, concluídas hoje, atrasadas
Distribuição por prioridade e categoria
Streak (dias consecutivos com ao menos 1 tarefa concluída)
Gráfico de produtividade dos últimos 7 dias (tarefas concluídas por dia)
Taxa de conclusão geral
[NEW] backend/src/index.js
Entry point: Express app, CORS, rate limit no login, rotas montadas.

Frontend — React (Vite)
[NEW] frontend/ — criado via npm create vite@latest
React + JavaScript.

[NEW] frontend/src/api/client.js
Axios com interceptor: injeta Authorization: Bearer <token> em toda requisição. Redireciona para /login em 401.

[NEW] frontend/src/hooks/useAuth.js
Context + hook para estado de autenticação (login, logout, user).

[NEW] Páginas
Arquivo	Descrição
pages/Login.jsx	Formulário de login com animação de entrada
pages/Register.jsx	Formulário de cadastro
pages/Dashboard.jsx	Cards de estatísticas, gráfico 7 dias, streak, próximas tarefas
pages/Tasks.jsx	Lista com filtros combinados + busca + ordenação
pages/Kanban.jsx	Visualização kanban (3 colunas: Pendente / Em andamento / Concluída)
pages/Calendar.jsx	Visualização calendário com tarefas por data de prazo
[NEW] Componentes principais
Componente	Descrição
TaskCard.jsx	Card de tarefa com progresso de subtarefas, prioridade colorida, tags
TaskModal.jsx	Modal de criação/edição com todos os campos
SubtaskList.jsx	Lista de subtarefas com checkbox e progresso em %
FilterBar.jsx	Barra de filtros combinados (status + prioridade + categoria + tags)
StatsCard.jsx	Card de estatísticas do dashboard
ProductivityChart.jsx	Gráfico de barras (7 dias) usando Recharts
StreakBadge.jsx	Badge de streak com animação de fogo
Sidebar.jsx	Navegação lateral com links e resumo do usuário
CategoryModal.jsx	Modal CRUD de categorias
TagModal.jsx	Modal CRUD de tags
Design System
Tema: Dark mode por padrão, com toggle para light
Paleta: Roxo profundo (#6C63FF) como cor primária, fundo #0F0F1A, cards #1A1A2E
Tipografia: Inter (Google Fonts)
Animações: Framer Motion para transições de página e abertura de modais
Atalhos de teclado: N nova tarefa, / buscar, Esc fechar modal
Dependências Totais
Backend
express, better-sqlite3, bcryptjs, jsonwebtoken, dotenv, cors, express-rate-limit, zod
Frontend
react, react-dom, react-router-dom, axios, recharts, framer-motion, date-fns, lucide-react
Verificação
Testes Funcionais (via Browser)
Cadastro e login — gerar token JWT válido
CRUD completo de tarefas com subtarefas
Filtros combinados funcionando
Dashboard mostrando estatísticas corretas
Kanban com drag between columns (opcional v1)
Streak incrementando após concluir tarefa
Testes de Segurança
Rotas protegidas retornam 401 sem token
Senha nunca exposta na resposta
Rate limit bloqueando após 5 tentativas de login
Perguntas em Aberto
IMPORTANT

1. Drag & drop no Kanban: Implementar arraste de cards entre colunas no v1 (usando @dnd-kit) ou deixar para o v2 com apenas botões de mudança de status?

IMPORTANT

2. Recorrência de tarefas: No v1, a recorrência deve apenas salvar o campo e exibir visualmente, ou já gerar automaticamente as próximas ocorrências no backend?

NOTE

3. PWA: Configurar vite-plugin-pwa no v1 para instalação mobile, ou focar na experiência web primeiro?

NOTE

4. Exportar dados: Incluir endpoint GET /api/export (JSON/CSV) já no v1?


Antes das fases em si, três observações sobre o spec que vale fixar:

As migrations rodando no boot são ótimas pra dev, mas vale criar um script npm run migrate separado pra não ter surpresa em produção.
O dashboard tem cálculos não-triviais (streak, agregação 7 dias) que merecem ser testados isoladamente antes de plugar no frontend.
Kanban e Calendar dependem de UX bem afinado — deixá-los por último evita bloquear o caminho crítico.

Fase 0 — Setup (≈0,5 dia)

Estrutura de pastas conforme o spec
backend/package.json com as deps listadas; .env.example com JWT_SECRET, PORT, NODE_ENV
frontend/ via npm create vite@latest
Scripts npm no backend: dev, start, migrate

Fase 1 — Backend: fundação (≈1 dia)

db/database.js: singleton better-sqlite3, PRAGMA foreign_keys = ON e journal_mode = WAL
db/migrations.js: todas as tabelas + índices em tasks(user_id, status), tasks(due_date), tasks(archived_at)
middleware/auth.js: Bearer → verify → req.userId
Helper validate(schema) envolvendo Zod
Rate limit de 5 tentativas / 15 min só no /login

Fase 2 — Backend: auth + recursos base (≈1 dia)

routes/auth.js: register com bcrypt (cost 10), login devolvendo { token, user } sem password_hash
routes/categories.js e routes/tags.js: CRUD com user_id derivado do middleware (nunca do body)
Testar via curl/Insomnia antes de seguir — é o ponto onde mais aparecem regressões

Fase 3 — Backend: tasks + subtarefas (≈1,5 dia)

GET /api/tasks com filtros via query string: status, priority, category_id, tags=1,2,3, search, order. Sugestão: tags em modo AND
POST/PUT validados com Zod
DELETE soft (archived_at = CURRENT_TIMESTAMP); todas as queries de listagem filtram archived_at IS NULL
PATCH /status separado — payload leve pro Kanban
routes/subtasks.js aninhadas, ordenação por position inteiro

Fase 4 — Backend: dashboard (≈0,5 dia)

Endpoint único /api/dashboard retornando tudo numa requisição
Streak: query recursiva (CTE) ou loop em JS percorrendo dias até achar o primeiro sem done
Gráfico 7 dias: GROUP BY DATE(updated_at) filtrando status = 'done'
Atrasadas: due_date < CURRENT_DATE AND status != 'done' AND archived_at IS NULL

Fase 5 — Frontend: fundação (≈1 dia)

React Router com <ProtectedRoute> checando token
api/client.js: axios com baseURL, interceptor de request (token) e response (401 → logout + redirect)
hooks/useAuth.js: Context + persistência em localStorage (consciente do trade-off com XSS)
Tema dark/light via CSS custom properties, toggle persistido
Layout com Sidebar fixo + área de conteúdo

Fase 6 — Frontend: auth (≈0,5 dia)
Login e Register com animação de entrada (Framer Motion), erros inline, redirect pós-login pro dashboard.
Fase 7 — Frontend: tasks + categorias + tags (≈2 dias)

/tasks é a página principal: lista + FilterBar + busca com debounce
TaskModal compartilhado entre criar e editar
SubtaskList com checkbox otimista (UI atualiza antes da resposta, faz rollback se falhar)
CategoryModal e TagModal acessíveis pela Sidebar
Atalhos: N abre modal, / foca busca, Esc fecha modal

Fase 8 — Frontend: dashboard (≈1 dia)
StatsCards no topo, ProductivityChart (BarChart do Recharts), StreakBadge com animação no "fogo", lista de próximas tarefas ordenadas por due_date asc.
Fase 9 — Frontend: kanban + calendar (≈1,5 dia)

Kanban: 3 colunas; movimentação via select/botão na TaskCard chamando o PATCH /status (ver decisão abaixo sobre drag-and-drop)
Calendar: mês corrente, dias com tarefas destacados, click no dia filtra a lista
Toda manipulação de data via date-fns

Fase 10 — QA + segurança (≈0,5 dia)
Checklist do spec (401 sem token, senha nunca exposta, rate limit ativo) + smoke test end-to-end: register → login → categoria → tarefa com subtarefa → done → reflexo no dashboard.
Total estimado: ~10–11 dias úteis para uma pessoa.

Recomendações sobre as perguntas em aberto
1. Drag-and-drop no Kanban → v2. @dnd-kit traz complexidade real (sensores, acessibilidade, reordenação otimista com rollback). Em v1, botão/select de status na TaskCard cumpre a função — e o PATCH /status já está previsto justamente pra isso.
2. Recorrência → só salvar e exibir em v1. Gerar próximas ocorrências exige scheduler, política de timezone e tratamento de "o que acontece se o usuário ficar dias sem abrir o app". É feature por si só.
3. PWA → v2. Adicionar vite-plugin-pwa depois é trivial e o app não vai mudar de forma o suficiente pra justificar fazer agora.
4. Export → vale incluir no v1. GET /api/export?format=json|csv listando tasks do usuário. CSV pode ser gerado manualmente sem lib. Custa ~1h e tira atrito futuro.

Riscos a monitorar

better-sqlite3 é nativo — confirmar build no ambiente alvo antes de empacotar.
JWT em localStorage é vulnerável a XSS; aceitável em dev, mas considerar httpOnly cookie pra produção.
A query de streak fica lenta sem índice em updated_at se a tabela crescer; já criar o índice na migration inicial.


Finalizar Páginas e Componentes Faltantes do TaskFlow
Após verificar os arquivos em to-dos/frontend e to-dos/backend e cruzar com o ImplementationPlan.md original, notei que o backend está bem completo (todas as rotas e db configurados), mas o frontend possui algumas lacunas:

As páginas Kanban (Kanban.jsx) e Calendário (Calendar.jsx) estão apenas com placeholders ("em construção...").
Os componentes para gerenciamento de Categorias e Tags (CategoryModal.jsx e TagModal.jsx) não foram criados.
Este plano visa implementar essas partes que estão faltando para que o projeto atinja o escopo v1 definido.

User Review Required
N/A

Open Questions
Kanban (Drag and Drop): No plano original, foi sugerido deixar o drag and drop para a v2 e usar apenas botões de mudança de status no Kanban para a v1. Podemos seguir com a abordagem simplificada (sem biblioteca extra de drag-and-drop) para finalizar mais rápido e manter o padrão?
Calendário: A ideia é montar um grid mensal simples usando date-fns ou preferes que eu adicione uma biblioteca pronta de calendário, como react-big-calendar? Montar com date-fns mantém o bundle menor e segue a stack atual.
Proposed Changes
Frontend (Páginas)
[MODIFY] c:/Users/pedro/OneDrive/Desktop/Pastas/imageModel/antigravity-agents-project/to-dos/frontend/src/pages/Kanban.jsx
Implementar layout com 3 colunas (Pendente, Em Andamento, Concluída).
Buscar as tarefas usando o hook da API.
Renderizar os TaskCard dentro de cada coluna correspondente.
Permitir alteração de status através do <select> que já existe no TaskCard.
[MODIFY] c:/Users/pedro/OneDrive/Desktop/Pastas/imageModel/antigravity-agents-project/to-dos/frontend/src/pages/Calendar.jsx
Criar um grid do mês atual usando date-fns.
Buscar as tarefas e destacá-las nos dias correspondentes com base no due_date.
Ao clicar em um dia, exibir a lista de tarefas daquele dia específico.
Frontend (Componentes Modais)
[NEW] c:/Users/pedro/OneDrive/Desktop/Pastas/imageModel/antigravity-agents-project/to-dos/frontend/src/components/CategoryModal.jsx
Modal para criar/editar Categorias (nome, cor, ícone).
Formulário simples com comunicação com POST/PUT /api/categories.
[NEW] c:/Users/pedro/OneDrive/Desktop/Pastas/imageModel/antigravity-agents-project/to-dos/frontend/src/components/TagModal.jsx
Modal para criar/editar Tags (nome, cor).
Formulário simples com comunicação com POST/PUT /api/tags.
Verification Plan
Manual Verification
Acessar o frontend na rota /kanban e verificar a distribuição das tarefas por colunas.
Acessar a rota /calendar e verificar se as datas estão corretas e populadas com as tarefas com due_date.
Abrir os modais de Categorias e Tags, tentar criar, editar e excluir uma categoria/tag e verificar se a API atualiza e o frontend reflete.
