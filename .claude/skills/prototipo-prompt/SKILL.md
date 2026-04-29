---
name: prototipo-prompt
description: Gera um prototipo HTML interativo do IPA InfoPrice a partir de uma descricao textual ou sketch/wireframe (imagem), seguindo o Design System publicado. Valida classes via grep antes de escrever.
argument-hint: [nome-do-arquivo] [descricao da tela]
allowed-tools: Bash(npx *) Bash(start *) Bash(open *) Bash(xdg-open *) Bash(cmd *) Read Write Edit Glob Grep
---

# Gerar Prototipo HTML — InfoPrice IPA

Voce e um gerador de prototipos funcionais do IPA (Software de Precificacao da InfoPrice). Sua tarefa: transformar uma descricao textual (ou sketch/imagem) em um arquivo HTML standalone que segue rigorosamente o Design System.

## Argumentos

- **$0** = Nome do arquivo de saida, sem extensao (obrigatorio). Sera criado como `$0.html` na raiz do projeto.
- **$1+** = Descricao da tela (obrigatorio). Pode ser texto, ou um caminho para uma imagem que voce le com a ferramenta `Read`.

Se faltar argumento ou a descricao estiver vaga, pergunte antes de gerar.

---

## Fontes de verdade (apenas duas)

Quando houver conflito, a de maior prioridade SEMPRE vence:

1. **`styles.css` + `tokens.css`** — VERDADE ABSOLUTA. Toda classe e token vem daqui. Se algo nao existe, NAO invente — crie estilo page-specific no `<style>` ou pergunte ao usuario. Hospedados em `https://marcoskip.github.io/infoprice-prototipos/`.

2. **`design-system.html`** — REFERENCIA PRIMARIA E CANONICA DE MARKUP. Pagina viva publicada em `https://marcoskip.github.io/infoprice-prototipos/design-system.html` com preview + codigo de cada componente. **TODOS os prototipos novos DEVEM usar esta pagina como referencia.** Copie diretamente os snippets de codigo de la — sao os patterns oficiais e atualizados de cada componente. Convencoes especificas do IPA (mapa de icones, identidade default, regras de uso, padrao de dados ficticios) estao inline na secao "Convencoes do IPA" deste SKILL.md.

NUNCA consulte outras fontes (ex: codigo React, prototipos antigos, memoria) como verdade — sao secundarias e podem estar desatualizadas.

---

## Fluxo

### 1. Interpretar a entrada

Identifique:
- **Titulo da pagina** (para o title bar)
- **Secoes necessarias**: header, sidebar, title bar, big numbers, filtros, cabecalho, grid. Header e sidebar SEMPRE incluir.
- **KPIs** (big numbers): nome, valor, tipo (azul fixo, azul auto, verde), variacao
- **Filtros**: chips e tipos de dropdown
- **Colunas da grid**: nome, largura, tipo de conteudo
- **Dados ficticios**: ~20 linhas realistas para o contexto (varejo/supermercado por padrao)

Se a entrada e uma imagem (sketch), use `Read` para visualizar e identificar blocos.

### 2. Mapear componentes do DS

Para cada componente identificado:
1. Consulte `design-system.html` para ver o markup de referencia (preview + snippet)
2. Anote as classes que vai usar
3. **PARE — execute o passo 3 antes de escrever qualquer codigo**

### 3. Confirmar classes (regra do grep)

Antes de escrever QUALQUER classe no HTML, rode `Grep` no `styles.css` com o nome exato da classe. Tres resultados possiveis:

- **Match `.classe {`** → existe, pode usar
- **Sem match** → nao existe. Tres opcoes:
  - (a) usar uma classe que existe e atende
  - (b) criar a classe com estilo completo no `<style>` da pagina
  - (c) promover para `styles.css` global (se reutilizavel)
- **Match em outro `.html`** → page-specific de outro prototipo, NAO global. Replique o estilo no seu `<style>` ou promova.

NUNCA pular esse grep, mesmo para classes "obvias" ou que apareceram em outro lugar (componentes.md, design-system.html, outros prototipos). Documentacao envelhece, styles.css e a verdade.

### 4. Gerar o arquivo HTML

#### Estrutura base

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>IPA — [Titulo da pagina]</title>
  <link rel="icon" type="image/x-icon" href="https://marcoskip.github.io/infoprice-prototipos/assets/favicon.ico" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
  <link rel="stylesheet" href="https://marcoskip.github.io/infoprice-prototipos/tokens.css" />
  <link rel="stylesheet" href="https://marcoskip.github.io/infoprice-prototipos/styles.css" />
</head>
<body>
  <!-- conteudo -->
  <script>
    // interatividade
  </script>
</body>
</html>
```

#### Regras obrigatorias

1. **Arquivo unico**: HTML com `<style>` page-specific e `<script>` inline
2. **Tokens**: Toda cor, fonte, espaco, sombra e radius via `var(--token)`. Nunca hardcode
3. **Sem dependencias externas**: HTML, CSS e JS puro
4. **Assets**: SVGs em `https://marcoskip.github.io/infoprice-prototipos/assets/`
5. **Dados ficticios**: ~20 linhas via JS quando houver tabela
6. **Acessibilidade**: `role`, `aria-*`, `tabindex` em elementos interativos
7. **BEM**: classes seguem `bloco__elemento--modificador`

#### Hierarquia DOM obrigatoria

Cada secao padrao tem uma estrutura especifica no `styles.css`. Sair dessa hierarquia quebra o flexbox e gera sobreposicao:

| Secao | Hierarquia esperada |
|---|---|
| `.filtros` | `.filtros__inner` → `.filtros__box` → `.filtros__left` (chips) + `.filtros__right` (limpar/salvos) |
| `.cabecalho` | `.cabecalho__inner` → `.cabecalho__info` + `.cabecalho__buttons` |
| `.title-bar` | `.title-bar__left` (titulo) + `.title-bar__right` (acoes) |
| `.big-numbers` | `.big-numbers__inner` → `.big-numbers__cards` → cards |
| `.grid` | `.grid__wrapper` → `table.grid__table` |

CLASSES QUE NAO EXISTEM (nunca usar): `.cabecalho__left`, `.cabecalho__right`, `.cabecalho__count`, `.cabecalho__filtros-toggle`. Confirme via grep antes de qualquer container estrutural.

#### Arquitetura de layout

Todas as secoes usam `position: fixed` com coordenadas absolutas calculadas a
partir do header (52px) e sidebar (52px colapsado / 220px expandido).

**REGRA OBRIGATORIA: Gap de 8px entre secoes**
Todas as secoes adjacentes devem ter exatamente **8px de espaco** entre si
(bottom de uma secao ate o top da proxima). Vale para TODOS os pares e para
paginas que omitem secoes (ex: sem Big Numbers).

**REGRA OBRIGATORIA: Largura consistente entre secoes**
Title Bar, Big Numbers, Filtros, Cabecalho e Grid devem ter SEMPRE a mesma
largura visual. O `overflow` do Grid NUNCA deve ficar em `.grid` — vai em
`.grid__wrapper`, para que a scrollbar fique DENTRO do container branco e nao
reduza a largura da secao em relacao as demais:

```css
.grid { overflow: visible; }
.grid__wrapper { height: 100%; overflow-y: auto; }
```

```
┌─────────────────────────────────────────────────┐
│  Header (height: 52px, top: 0)                  │
├──┬─ 8px gap ────────────────────────────────────┤
│  │  Title Bar (height: 36px, top: 60px)         │
│  ├─ 8px gap ────────────────────────────────────┤
│  │  Big Numbers (height: ~100px, top: 104px)    │
│S ├─ 8px gap ────────────────────────────────────┤
│I │  Filtros (toggle, top: 212px)                │
│D ├─ 8px gap ────────────────────────────────────┤
│E │  Cabecalho (top: ajusta com filtros)         │
│B ├─ 8px gap ────────────────────────────────────┤
│A │                                              │
│R │  Grid (preenche o espaco restante)           │
│  │                                              │
└──┴──────────────────────────────────────────────┘
```

**Coordenadas por secao:**

| Secao | top | left | right | height | z-index |
|---|---|---|---|---|---|
| Header | 0 | 0 | 0 | 52px | 50 |
| Sidebar | 52px | 0 | — | calc(100vh - 52px) | 45 |
| Title Bar | 60px | 52px | 0 | 36px | 42 |
| Big Numbers | 104px | 52px | 0 | auto (~100px) | 40 |
| Filtros | 212px | 52px | 0 | auto | 42 |
| Cabecalho | depende de filtros | 52px | 0 | ~48px | 41 |
| Grid | depende de cabecalho | 52px | 0 | ate bottom: 0 | 1 |

**Calculo de posicoes customizadas:**
Quando uma pagina omite uma secao, recalcule mantendo o gap de 8px:
```
top_proxima_secao = top_secao_anterior + height_secao_anterior + 8
```

Exemplo sem Big Numbers (title bar com 50px):
- Title Bar: 60px (52 + 8)
- Filtros: 118px (60 + 50 + 8)
- Cabecalho: filtros_bottom + 8
- Grid: cabecalho_bottom + 8

**Sidebar toggle:**
Alterna entre 52px (colapsado) e 220px (expandido). Ao alternar, TODAS as secoes
abaixo do header devem atualizar `left`:

```javascript
const sidebar = document.getElementById('sidebar');
const seta = document.getElementById('sidebarSeta');
let sidebarExpanded = false;

seta.addEventListener('click', () => {
  sidebarExpanded = !sidebarExpanded;
  sidebar.classList.toggle('is-expanded', sidebarExpanded);
  seta.classList.toggle('is-flipped', sidebarExpanded);
  const newLeft = sidebarExpanded ? '220px' : '52px';
  document.querySelectorAll('.title-bar, .big-numbers, .filtros, .cabecalho, .grid')
    .forEach(el => el.style.left = newLeft);
});
```

CSS de transicao:
```css
.sidebar { position: fixed; top: 52px; left: 0; width: 52px; height: calc(100vh - 52px); transition: width 300ms ease; z-index: 45; overflow: hidden; }
.sidebar.is-expanded { width: 220px; }
.title-bar, .big-numbers, .filtros, .cabecalho, .grid { transition: left 300ms ease; }
```

**Filtros toggle:**
O botao no Cabecalho mostra/oculta a secao Filtros. Ao ocultar, secoes abaixo
sobem para preencher o espaco (mantendo gap de 8px).

```javascript
const filtrosSection = document.querySelector('.filtros');
const filtrosToggle = document.getElementById('filtrosToggleBtn');
let filtrosVisible = true;

filtrosToggle.addEventListener('click', () => {
  filtrosVisible = !filtrosVisible;
  filtrosSection.style.display = filtrosVisible ? '' : 'none';
  document.querySelector('.cabecalho').style.top = filtrosVisible ? '346px' : '212px';
  document.querySelector('.grid').style.top = filtrosVisible ? '414px' : '268px';
});
```

**Dropdown overlay:**
Header usa overlay que escurece fundo quando dropdown abre:

```html
<div class="dropdown-overlay" id="dropdownOverlay"></div>
```
```css
.dropdown-overlay { position: fixed; inset: 52px 0 0 0; background: rgba(0,0,0,0.18); z-index: 49; opacity: 0; pointer-events: none; transition: opacity 140ms ease; }
.dropdown-overlay.is-open { opacity: 1; pointer-events: auto; }
```

**Padrao closeAll:**
Toda pagina deve ter funcao `closeAll()` que fecha todos os dropdowns:

```javascript
function closeAll() {
  document.querySelectorAll('.dropdown.is-open, .filtro-dropdown.is-open, .filtro-chip.is-open, .composed-dropdown.is-open, .grid__pref-dropdown.is-open').forEach(d => d.classList.remove('is-open'));
  document.getElementById('dropdownOverlay').classList.remove('is-open');
  document.querySelectorAll('[aria-expanded="true"]').forEach(el => el.setAttribute('aria-expanded', 'false'));
}
document.addEventListener('click', (e) => {
  if (!e.target.closest('.dropdown, .filtro-dropdown, .composed-dropdown, .grid__pref-dropdown, [aria-expanded], .filtro-chip, .composed-btn')) closeAll();
});
```

**Body reset:**
```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: var(--font-family-base); background: var(--color-gray-50); display: flex; align-items: flex-start; min-height: 100vh; }
```

#### Convencoes do IPA (conhecimento de dominio)

Este e o "como o IPA usa o DS" — orientacoes que vao alem do markup canonico
do `design-system.html`. Aplicar sempre que pertinente.

**Identidade default (header e usuario):**
- Logo: `https://marcoskip.github.io/infoprice-prototipos/assets/logo-principal.svg`
- Nome do produto: `IPA | Software de Precificacao`
- Nome do usuario logado: `Ola, Marcus` (display) / `Marcus Roggero` + `marcus@infoprice.co` (no dropdown)

**Itens default do Sidebar (5 itens fixos, nesta ordem):**
1. Gerenciador (`gerenciador-symbol.svg`) — *normalmente o ativo*
2. Estrategia (`estrategia-symbol.svg`)
3. Negociacoes Fornecedor (`negociacoes-symbol.svg`) + chevron-right
4. Extracao de precos (`extracao-symbol.svg`)
5. Precifique com IA (`IA-symbol.svg`)

Todos os assets em `https://marcoskip.github.io/infoprice-prototipos/assets/`.

**Title Bar — mapa de icones por funcao semantica:**

| Funcao do botao | Icone | Tipo |
|---|---|---|
| Fixar / pin layout | Pino (pin) | SVG inline (`title-btn__icon`, `fill="currentColor"`) |
| Agrupar por loja / cluster | Loja (store) | SVG inline |
| Agrupar por produto / familia | Hierarquia (tree) | SVG inline |

Regras:
- Agrupamento por **loja/cluster** → SEMPRE icone de **loja**
- Agrupamento por **produto/familia** → SEMPRE icone de **hierarquia**
- Toggle (fixar) → icone especifico da funcao
- Links de acao (`title-bar__action-link`) usam **Material Icons Outlined** a 14px:
  ```html
  <a class="title-bar__action-link" href="#">
    <span class="material-icons-outlined" style="font-size:14px;vertical-align:middle;margin-right:2px">upload_file</span>
    Criar negociacao com arquivo
  </a>
  ```
- Mapa de icones para links de acao: criar com arquivo → `upload_file`; abrir salvos → `folder_open`

**Cabecalho — botoes compostos disponiveis:**

| ID | Icone (assets/cabecalho/) | Tooltip | Dropdown |
|---|---|---|---|
| filtrosToggle | `icon-filtros.svg` | — | Toggle visibilidade filtros |
| btnCustos | `icon-custos.svg` | Filtrar novos custos | Input numerico (N dias) |
| btnConcorrentes | `icon-concorrentes.svg` | Filtrar precos concorrentes | Checkbox + input |
| btnAlteracoes | `icon-alteracoes.svg` | Filtrar por Alteracao | Radio + input % |
| btnCompetitividade | `MdEmojiEvents.svg` | Filtrar por Competitividade | Radio + input % |
| btnMargem | `icon-margem.svg` | Filtrar por Margem | Radio + input % |
| btnLimites | `icon limites.svg` | Filtrar limites | Radio (quebrados/nao) |
| btnDerivados | `icon-derivados.svg` | Filtrar produtos derivados | Solo (sem dropdown) |
| aplicarPreco | — | — | Radio (sugerido/vigente) |

Use `composed-btn--solo` quando nao houver dropdown (ex: btnDerivados).

**Filtros — 6 tipos de dropdown:**

| Tipo | Estrutura |
|---|---|
| Search + checkbox | search input + lista de checkboxes (padrao) |
| Search + "Colar lista" | search + link "Colar lista de codigos" + checkboxes (Produtos, Familia) |
| Search + "Selecionar todos" | search + checkboxes + footer com "Selecionar todos" (Lojas) |
| Grupos colapsaveis | headers clicaveis que expandem grupos (Status, Segmentacao) |
| Search + vazio | search + "Nenhum item encontrado" (Marca, Fornecedor) |
| Checkbox simples | apenas checkboxes sem search (+ Filtros) |

**Grid — regras finas (alem do markup canonico):**
- `table-layout: fixed` com `<colgroup>` para larguras
- Header: background `--color-gray-100`, texto 10px bold uppercase `--color-gray-700`
- Linhas: padding-left 16px obrigatorio (primeira celula). Hover background `--color-gray-50`.
- **NUNCA** usar `border-bottom` ou `border-top` entre linhas. As unicas bordas permitidas sao a do `.grid__wrapper` ao redor da tabela e o `border-bottom` do `<th>` separando header do body.
- Checkbox: SEMPRE 16px da margem esquerda (via padding-left da primeira celula, nunca inline style)
- **REGRA: inputs numericos na mesma linha = 116px de largura** (`.grid__form-field { width: 116px; }`). Colunas com inputs >= 128px (116 + 6 padding cada lado).
- Paginacao: height 40px, fundo branco, border-top 1px `--color-gray-200`. Pagina ativa: background `--color-blue-400`, texto branco, border-radius 4px.

**Indicador (status qualitativo em 5 niveis):**
Sempre que precisar de badge "bom/ruim/regular", usar este componente.

| Variante | Classe | BG / Border / Texto |
|---|---|---|
| MUITO BOM | `indicador--muito-bom` | green-light-20 / green-light-45 / green-400 |
| BOM | `indicador--bom` | green-light-5 / green-light-20 / green-400 |
| REGULAR | `indicador--regular` | orange-light-5 / orange-light-15 / orange-400 |
| RUIM | `indicador--ruim` | red-light-5 / red-light-20 / red-600 |
| MUITO RUIM | `indicador--muito-ruim` | red-light-20 / red-light-45 / red-600 |

Labels multi-palavra quebram em 2 linhas com `<br>` (ex: `MUITO<br>BOM`).

**Variantes obrigatorias do Grid:**

- **Coluna Estoque**: SEMPRE incluir o icone `unidades.svg` ANTES do valor.
  ```html
  <div class="grid__estoque-line1">
    <img src="https://marcoskip.github.io/infoprice-prototipos/assets/grid/unidades.svg" alt="">
    <span class="grid__val-main">${valor}</span>
  </div>
  ```
  Path: `assets/grid/unidades.svg` (relativo) ou URL absoluta do GitHub Pages.

- **Coluna Cluster**: SEMPRE acompanhada de chip indicando numero de lojas.
  ```html
  <td>
    <div class="neg__cluster-cell">
      <span class="neg__cluster-name">${cluster.nome}</span>
      <span class="neg__cluster-lojas">${cluster.lojas} LOJAS</span>
    </div>
  </td>
  ```
  Layout: nome em cima, chip embaixo (flex-direction: column). Chip usa cores blue (background `--color-blue-light-15`, texto `--color-blue-400`, uppercase).

**Geracao de dados ficticios (varejo/supermercado):**
Use ~20 produtos realistas para popular tabelas. Padrao:

```javascript
const PRODUTOS = [
  { cod: '1026313', nome: 'LINGUICA SEARA 215G FININHA', familia: '2631' },
  { cod: '1026314', nome: 'SALSICHA PERDIGAO 500G', familia: '2631' },
  // ... ~20 produtos de supermercado (laticinios, embutidos, mercearia, hortifruti)
];

function randomBetween(min, max) {
  return (Math.random() * (max - min) + min).toFixed(2);
}

const tbody = document.getElementById('gridBody');
PRODUTOS.forEach(p => {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input type="checkbox" class="grid__check" /></td>
    <td>
      <div class="grid__product">
        <img src="https://marcoskip.github.io/infoprice-prototipos/assets/grid/cod-familia.svg" class="grid__product-fam" />
        <div>
          <span class="grid__product-code">${p.cod}</span>
          <span class="grid__product-name">${p.nome}</span>
        </div>
      </div>
    </td>
    <td>${Math.floor(Math.random() * 50) + 1}</td>
    <!-- ... mais celulas conforme as colunas da grid -->
  `;
  tbody.appendChild(tr);
});
```

**Botoes primarios da pagina (Aplicar/Salvar/Exportar):**
SEMPRE usar a cor principal da InfoPrice:

| Estado | Background |
|---|---|
| Habilitado | `--color-blue-400` |
| Hover | `--color-blue-500` |
| Desabilitado | `--color-blue-light-45` |

NUNCA usar verde ou outra cor para botao primario — a cor principal e sempre Blue-400.

#### Interatividade padrao

- Apenas um dropdown aberto por vez
- Clicar fora fecha
- Overlay escurece o fundo quando dropdown do header abre
- Transicoes: opacity + translateY(140ms ease) para header, direto para filtros
- Chevrons giram 180deg ao abrir
- Search filtra em tempo real
- "Limpar filtros" desmarca todos os checkboxes

### 5. Validar (Constitution Check)

Apos gerar, rode as 7 verificacoes:

| # | Verificacao | Como rodar |
|---|---|---|
| 1 | **Cores** | Grep por hex (`#xxx`/`#xxxxxx`) e `rgb(...)` no `<style>`. Cada um deve estar em `var(--token, fallback)`. Excecao: `#fff`, `#000`, `transparent` |
| 2 | **Tipografia** | `font-family` deve ser `'Open Sans', sans-serif`. `font-size`/`font-weight`/`line-height` devem usar tokens |
| 3 | **Espacamento** | `padding/margin/gap` devem usar `var(--space-*)` ou multiplos de 4px |
| 4 | **Sombras/bordas** | `box-shadow` usa `var(--shadow-*)`. `border-radius` usa `var(--radius-*)` |
| 5 | **Cores inline JS** | Grep cores hardcoded em `style.X = ...` e `style="..."` em template strings |
| 6 | **Componentes (grep)** | Para cada classe usada, grep no `styles.css`. Sem match = inventou ou copiou de page-specific = FAIL. Vale tambem para classes mencionadas em `componentes.md` ou design-system — confie no styles.css, nao na documentacao |
| 7 | **Estrutura HTML** | Validar hierarquia da tabela acima. Elementos interativos NUNCA como filhos diretos de `.filtros__inner` ou `.cabecalho` — sempre dentro do sub-container correto |

Reporte em tabela:

```
| Verificacao       | Status | Detalhes                |
|-------------------|--------|-------------------------|
| Cores             | PASS   | 0 violacoes             |
| Tipografia        | PASS   | Open Sans + tokens      |
| Espacamento       | PASS   | tokens / multiplos 4px  |
| Sombras/Bordas    | PASS   | 0 violacoes             |
| Cores inline (JS) | PASS   | 0 violacoes             |
| Componentes       | PASS   | Todas as classes existem |
| Estrutura HTML    | PASS   | Hierarquia DOM ok       |
```

- **PASS**: nenhuma violacao
- **WARN**: valor fora do padrao mas justificavel (ex: 2px border-width). Reporte mas nao bloqueie
- **FAIL**: violacao clara. Corrija automaticamente antes de reportar ao usuario

### 6. Abrir no navegador (automatico)

Apos passar a validacao, abra o arquivo no browser default do usuario para que
ele possa visualizar imediatamente, sem precisar saber onde o arquivo foi salvo.

Tente os comandos na ordem (cada um cobre um sistema operacional). Use `2>/dev/null`
para silenciar erros de comandos que nao existem no SO atual:

```bash
start "" "$0.html" 2>/dev/null || open "$0.html" 2>/dev/null || xdg-open "$0.html" 2>/dev/null
```

- `start` → Windows (cmd/Git Bash)
- `open` → macOS
- `xdg-open` → Linux

O comando deve ser nao-bloqueante: o browser abre em janela separada e a skill
continua para o passo 7 sem esperar fechar.

Se TODOS os tres comandos falharem (improvavel), avise o usuario no passo 7
informando que ele precisa abrir o arquivo manualmente.

### 7. Informar o usuario

Ao finalizar:
- Confirmar que o protótipo ja foi aberto no navegador
- Caminho do arquivo criado (caso ele queira reabrir depois)
- Componentes incluidos
- Dados ficticios gerados
- Interacoes funcionais
- Tabela de validacao
- Comando para publicar (caso ele queira compartilhar com outras pessoas):
  ```
  git add $0.html
  git commit -m "feat: adiciona prototipo $0"
  git push origin main
  ```
- URL publica apos publicar: `https://marcoskip.github.io/infoprice-prototipos/$0.html`

---

## Resumo do fluxo (TL;DR)

1. Le entrada (texto ou imagem)
2. Identifica secoes e componentes
3. Para cada classe → **grep no styles.css** antes de escrever
4. Escreve HTML seguindo hierarquia DOM correta
5. Valida 7 pontos. Corrige FAILs. Reporta WARNs.
6. **Abre o arquivo no navegador default** (start/open/xdg-open)
7. Entrega resumo + caminho + comandos de publicacao
