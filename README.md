# Protótipos Funcionais — InfoPrice IPA

Pipeline de geração de protótipos funcionais e compartilháveis a partir do Figma, sem envolver o time de desenvolvimento.

> **Produto:** IPA | Software de Precificação  
> **Time:** UX/UI — InfoPrice  
> **Período:** Março–Abril 2026  
> **Stack:** HTML + CSS + JavaScript puro (zero dependências externas)  
> **Publicação:** GitHub Pages — [marcoskip.github.io/infoprice-prototipos](https://marcoskip.github.io/infoprice-prototipos/)

---

## Sumário

- [Visão geral](#visão-geral)
- [O que foi construído](#o-que-foi-construído)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Design System e tokens](#design-system-e-tokens)
- [Componentes implementados](#componentes-implementados)
  - [Header](#1-header)
  - [Sidebar](#2-sidebar)
  - [Title Bar](#3-title-bar)
  - [Big Numbers](#4-big-numbers)
  - [Filtros](#5-filtros)
  - [Cabeçalho de resultados](#6-cabeçalho-de-resultados)
  - [Grid de dados](#7-grid-de-dados)
- [Arquitetura da página](#arquitetura-da-página)
- [Timeline do projeto](#timeline-do-projeto)
- [Como usar o pipeline](#como-usar-o-pipeline)
  - [Pré-requisitos](#pré-requisitos)
  - [Setup inicial](#setup-inicial)
  - [Gerando um protótipo](#gerando-um-protótipo)
- [Páginas de referência](#páginas-de-referência)
- [Escopo de interatividade](#escopo-de-interatividade)
- [Solução de problemas](#solução-de-problemas)

---

## Visão geral

Este projeto implementa um pipeline que transforma frames do Figma em protótipos HTML funcionais usando Claude Code + Figma MCP. O objetivo é permitir que o time de UX/UI valide interfaces diretamente com stakeholders, sem depender do time de desenvolvimento.

```
Figma (frame pronto)
    ↓  Figma MCP lê o design
Claude Code (gera HTML + CSS com tokens do DS)
    ↓  VSCode
GitHub (commit + push)
    ↓  GitHub Pages publica automaticamente
Link compartilhável → enviado ao solicitante
```

---

## O que foi construído

O protótipo principal é a tela **Gerenciador de Preços** do IPA, uma interface completa de precificação com 7 seções interativas:

| Seção | Descrição |
|---|---|
| **Header** | Top bar com logo, dropdown de produtos, menu do usuário |
| **Sidebar** | Menu lateral colapsável com 5 módulos e botão expand/collapse |
| **Title Bar** | Título da página + botões de ação (Fixar, Loja, Produto) com tooltips e dropdowns |
| **Big Numbers** | 7 KPI cards com indicadores de variação (setas up/down coloridas) |
| **Filtros** | 13 chips pill com dropdowns variados (search, checkbox, grupos colapsáveis) |
| **Cabeçalho** | Barra com 9 botões compostos (ícone + dropdown) para filtros avançados |
| **Grid** | Tabela de 15 colunas com dados fictícios, sorting, paginação e inputs editáveis |

Além do protótipo, foram criadas **3 páginas de referência**:
- **tokens.html** — catálogo visual de todos os design tokens (cores, tipografia, sombras, ícones)
- **components.html** — documentação isolada dos componentes UI com estados e variações
- **styles.css** — stylesheet compartilhado (~2.050 linhas) com todos os estilos dos componentes

---

## Estrutura do projeto

```
infoprice-prototipos/
├── index.html              → Protótipo principal: Gerenciador de Preços (1.563 linhas)
├── styles.css              → Estilos compartilhados de todos os componentes (2.050 linhas)
├── tokens.css              → Design tokens extraídos do Figma (364 linhas)
├── tokens.html             → Catálogo visual dos tokens (1.387 linhas)
├── components.html         → Documentação dos componentes isolados (2.412 linhas)
├── .mcp.json               → Configuração do Figma MCP
├── README.md               → Este documento
│
├── assets/
│   ├── logo-principal.svg          → Logo InfoPrice
│   ├── favicon.ico                 → Favicon
│   ├── gerenciador-symbol.svg      → Ícone sidebar: Gerenciador
│   ├── estrategia-symbol.svg       → Ícone sidebar: Estratégia
│   ├── negociacoes-symbol.svg      → Ícone sidebar: Negociações
│   ├── extracao-symbol.svg         → Ícone sidebar: Extração
│   ├── IA-symbol.svg               → Ícone sidebar: IA
│   ├── fixar.svg                   → Ícone botão Fixar
│   ├── loja.svg                    → Ícone botão Loja
│   ├── produto.svg                 → Ícone botão Produto
│   │
│   ├── cabecalho/                  → Ícones da barra de cabeçalho
│   │   ├── icon-filtros.svg
│   │   ├── icon-custos.svg
│   │   ├── icon-concorrentes.svg
│   │   ├── icon-alteracoes.svg
│   │   ├── icon-margem.svg
│   │   ├── icon limites.svg
│   │   ├── icon-derivados.svg
│   │   └── MdEmojiEvents.svg       → Ícone competitividade (troféu)
│   │
│   └── grid/                       → Ícones da tabela/grid
│       ├── double.svg              → Seta dupla (sorting)
│       ├── up.svg / down.svg       → Setas de ordenação
│       ├── preferences.svg         → Ícone config. de coluna
│       ├── icon-margem.svg
│       ├── unidades.svg
│       ├── cod familia.svg
│       ├── Cifra-precovigente.svg
│       ├── trofeu-precovigente.svg
│       └── design-grid.png         → Screenshot de referência do Figma
│
├── direcionais/                    → PDFs de referência do Figma
│   ├── Big numbers.pdf
│   ├── Cabecalho.pdf
│   ├── Grid.pdf
│   ├── Sidebar.pdf
│   └── Title.pdf
│
└── prints/                         → Screenshots de referência
    ├── tooltip.JPG
    ├── fixar.JPG
    ├── loja.JPG
    ├── produto.JPG
    └── filtros/                    → Screenshots dos 16 dropdowns de filtro
        ├── produtos.JPG
        ├── familia.JPG
        ├── lojas.JPG
        ├── cluster.JPG
        └── ... (16 arquivos)
```

---

## Design System e tokens

Os tokens foram extraídos do [Figma Design System](https://www.figma.com/design/qXRoOz0cCzAX4WgOz7fAmJ/Design-System) e estão em `tokens.css`. Fonte: 196 styles (125 cores, 66 tipografia, 5 efeitos).

### Paleta de cores

| Categoria | Tokens | Exemplo |
|---|---|---|
| Marca | `--color-brand-primary`, `--color-brand-tertiary` | `#0e9ce3` |
| Cinza | `--color-gray-50` a `--color-gray-900` (10 tons) | `#fafafa` → `#323232` |
| Azul | `--color-blue-400` a `--color-blue-700` + 7 light | `#378ef0` → `#0d66d0` |
| Verde | `--color-green-400` a `--color-green-700` + 7 light | `#33ab84` → `#12805c` |
| Vermelho | `--color-red-400` a `--color-red-700` + 7 light | `#ec5b62` → `#c9252d` |
| Laranja | `--color-orange-400` a `--color-orange-700` + 7 light | `#f29423` → `#cb6f10` |
| Roxo | `--color-purple-400` a `--color-purple-700` | `#9256d9` → `#6f38b1` |
| Rosa | `--color-pink-400`, `--color-pink-500` + 7 light | `#f473d6` → `#e663c9` |
| Gráficos | `--color-chart-1` a `--color-chart-12` | Sequência azul → vermelho |

### Tipografia

- **Família:** Open Sans (light 300, regular 400, semibold 600, bold 700)
- **Escala:** 8 tamanhos de `--font-size-2xs` (8px) a `--font-size-3xl` (24px)
- **Line heights:** 8 valores de `--line-height-2xs` (10px) a `--line-height-3xl` (32px)
- **Headings:** H1 (56px), H2 (48px), H3 (40px), H6 (20px semibold)
- **Botões:** 4 tamanhos (xs, sm, md, lg) com variantes bold e regular

### Outros tokens

| Token | Valores |
|---|---|
| Border radius | `none` (0), `sm` (4px), `md` (8px), `pill` (999px) |
| Espaçamento | `space-1` (4px) a `space-6` (24px) |
| Ícones | 5 tamanhos (10–24px), 4 cores semânticas |
| Sombras | `elevation` (cards/modais), `focus` (acessibilidade), `hover` (destaque) |

---

## Componentes implementados

### 1. Header

Barra superior fixa com 52px de altura.

**Lado esquerdo:**
- Botão de menu (quadrado azul `--color-blue-400`, 52×52px) com ícone `apps`
- Dropdown de produtos: lista os módulos ISA e IPA, com itens bloqueados (`lock`)
- Logo InfoPrice + divider + nome do produto "IPA | Software de Precificação"

**Lado direito:**
- Botão de ajuda (`help_outline`) com hover azul
- Menu do usuário: "Olá, Marcus" + chevron
- Dropdown de usuário: identidade, Configurações, Pessoas (badge "Convidar"), Base de conhecimento, Termos de uso, Sair

**Interatividade:**
- Dropdowns abrem/fecham com animação (opacity + translateY, 140ms ease)
- Overlay escurece o fundo quando um dropdown está aberto
- Apenas um dropdown aberto por vez (abre um, fecha todos os outros)

---

### 2. Sidebar

Menu lateral colapsável fixo à esquerda.

**Dimensões:**
- Colapsado: 52px de largura
- Expandido: 220px de largura
- Transição: 300ms ease

**Itens de navegação (5 módulos):**
1. Gerenciador (ativo)
2. Estratégia
3. Negociações Fornecedor (com sub-chevron)
4. Extração de preços
5. Precifique com IA

**Comportamento:**
- Cada item tem ícone SVG custom + label + tooltip
- No estado colapsado, labels ficam ocultas e tooltips aparecem no hover
- No estado expandido, labels aparecem e tooltips ficam ocultas
- Botão seta (55×37px) na parte inferior faz o toggle
- Ícone da seta gira 180° com transição de 300ms
- Todas as seções da página ajustam seu `left` ao expandir/collapsar

---

### 3. Title Bar

Barra de título posicionada em `top: 52px` (abaixo do header), `height: 36px`.

**Lado esquerdo:**
- Título: "Gerenciador de preços" (14px semibold)
- Badge: "Atualizado em 01/07/2023, 13:42" (background `--color-green-400`, texto branco, pill)

**Lado direito — 3 botões:**

| Botão | Tooltip | Dropdown | Comportamento |
|---|---|---|---|
| Fixar | "Alternar a exibição do layout fixo" (abaixo) | — | Toggle: ativa/desativa classe `is-active` (cor azul) |
| Loja | "Agrupar por" (acima) | Loja, Cluster de lojas | Seleção fecha o dropdown |
| Produto | "Precificar por" (abaixo) | Produto, Família | Seleção fecha o dropdown |

**Estilo dos botões:**
- Background `--color-gray-300`, sem border, radius 4px, altura 26px
- Hover: background `--color-gray-400`
- Ícones: SVG inline com `fill="currentColor"`

---

### 4. Big Numbers

Faixa de KPI cards em `top: 88px` (52px header + 36px title).

**Container:**
- Seção transparente com padding 4px 16px (mostra o gray-50 da página)
- Inner div: background branco, border-radius 6px, padding 12px

**7 cards:**

| # | Card | Tipo | Dados |
|---|---|---|---|
| 1 | Total de preços | Azul fixo (140px) | 3.645 de 3.645 |
| 2 | Novos custos | Azul fixo (140px) | 236 de 236 |
| 3 | Preços sugeridos | Azul fixo (140px) | 1.269 de 1.269 |
| 4 | Preços aplicados | Azul fixo (140px) | 364 de 364 |
| 5 | Competitividade projetada | Azul auto | 101,3% ↓ 0,4% |
| 6 | Margem projetada | Azul auto | 26,3% ↑ 0,1% |
| 7 | Estimativa diferença lucro | Verde | + R$ 392mil ↑ 0,1% |

**Estilos dos cards:**
- Azul: border `#d7e8fc`, background `#f5f9fe`
- Verde: border `#33ab84` (1.5px), background `#f5fbf9`
- Número: 20px semibold / Descrição: 12px regular gray-600
- Variação ↑ verde (`--color-green-500`) / ↓ vermelha (`--color-red-600`)

---

### 5. Filtros

Barra de filtros em `top: 188px`, com toggle de visibilidade.

**Estrutura:**
- Container branco com border-radius 6px
- Box interno com border gray-300
- Layout flex: coluna esquerda (chips) + coluna direita (ações, 240px)

**Linha 1 — 9 chips:**
Produtos, Família, Lojas, Cluster, Tipo de loja, Status de preço, Segmentação, Marca, Fornecedor

**Linha 2 — 4 chips numerados:**
01 Departamento, 02 Seção, 03 Grupo, 04 Sub-grupo

**Coluna direita:**
- "+ Filtros" e "Limpar filtros" (linha superior)
- "Filtros salvos" (linha inferior)

**Tipos de dropdown:**

| Tipo | Filtros |
|---|---|
| Search + "Colar lista de códigos" + checkbox | Produtos, Família |
| Search + checkbox + "Selecionar todos" | Lojas |
| Search + checkbox (padrão) | Cluster, Tipo loja, Departamento, Seção, Grupo, Subgrupo |
| Grupos colapsáveis (sem search) | Status de preço, Segmentação |
| Search + "Nenhum item encontrado" | Marca, Fornecedor, Filtros salvos |
| Checkbox simples (sem search) | + Filtros |

**Estilo dos chips:**
- Pill: height 32px, border-radius 18px, background `--color-gray-100`
- Hover: background `--color-gray-300`
- Aberto: background `--color-gray-300`, chevron gira 180°

---

### 6. Cabeçalho de resultados

Barra de ações avançadas entre os filtros e a grid.

**Lado esquerdo — botão toggle:**
- Ícone de filtros com label "Filtros" — mostra/oculta a seção de filtros acima
- Ao ocultar, todas as seções abaixo sobem para preencher o espaço

**Lado direito — 9 botões compostos:**

| # | Botão | Dropdown | Tipo |
|---|---|---|---|
| 1 | Filtros | — | Toggle visibilidade |
| 2 | Custos | Filtrar novos custos dos últimos N dias | Input numérico |
| 3 | Concorrentes | Origem do preço (MPDV, infopanel, externo) | Checkbox + input |
| 4 | Alterações | Variação maior/igual a X% | Radio + input |
| 5 | Competitividade | Competitividade maior/igual a X% | Radio + input |
| 6 | Margem | Margem maior/igual a X% | Radio + input |
| 7 | Limites | Limites quebrados/não quebrados | Radio |
| 8 | Derivados | — | Solo (sem dropdown) |
| 9 | Aplicar preço | Preço sugerido/vigente | Radio (botão verde) |

**Estilo dos botões compostos:**
- Base (ícone SVG) + drop (chevron) lado a lado
- Tooltip no hover da base
- Dropdown com `position: absolute` abaixo do botão

---

### 7. Grid de dados

Tabela de dados ocupando o espaço restante da tela.

**15 colunas:**

| Coluna | Largura | Conteúdo |
|---|---|---|
| Checkbox | 40px | Seleção de linha |
| Produto | flex | Código + nome + ícone família |
| Loja | 70px | Número da loja |
| Estoque | 108px | Dias + unidades com ícones |
| PMZ e custos | 90px | Preço + tag "Novo custo" |
| Margem Objetiva | 80px | Valor % |
| Embalagem | 50px | Quantidade |
| PMC | 110px | Preço |
| Preço vigente | 120px | R$ + ícone troféu/cifra |
| Preço concorrente | 104px | R$ + fonte |
| Preço sugerido | 108px | Input editável + variação % |
| CPI | 108px | % + variação |
| Margem | 108px | % + variação |
| Previsão | 100px | R$ |
| Menu | 50px | Botão "Menu preços" |

**Funcionalidades:**
- `table-layout: fixed` com `<colgroup>` para larguras
- 4 colunas com dropdown de preferência de ordenação (Produto, Preço sugerido, CPI, Margem)
- Botões de sort (seta dupla) em todas as colunas
- Checkbox master no header (seleciona todas as linhas)
- ~20 linhas geradas via JavaScript com dados randomizados
- Inputs editáveis na coluna "Preço sugerido"
- Paginação com navegação por páginas

**Estilo:**
- Header: background `--color-gray-100`, texto 10px bold uppercase
- Linhas: alternância branca, hover com background sutil
- Inputs: bordas azuis no foco (shadow-focus)

---

## Arquitetura da página

Todas as seções usam `position: fixed` com coordenadas absolutas calculadas:

```
┌─────────────────────────────────────────────────┐
│  Header (height: 52px, top: 0)                  │
├──┬──────────────────────────────────────────────┤
│  │  Title Bar (height: 36px, top: 52px)         │
│  ├──────────────────────────────────────────────┤
│  │  Big Numbers (height: ~100px, top: 88px)     │
│S ├──────────────────────────────────────────────┤
│I │  Filtros (toggle, top: 188px)                │
│D ├──────────────────────────────────────────────┤
│E │  Cabeçalho (top: ajusta com filtros)         │
│B ├──────────────────────────────────────────────┤
│A │                                              │
│R │  Grid (preenche o espaço restante)           │
│  │                                              │
└──┴──────────────────────────────────────────────┘
```

**Responsividade ao sidebar:**
- Sidebar colapsado: todas as seções com `left: 52px`
- Sidebar expandido: todas as seções com `left: 220px`
- Transição CSS de 300ms

**Responsividade aos filtros:**
- Filtros visíveis: grid e cabeçalho ajustam `top` para acomodar
- Filtros ocultos: grid e cabeçalho sobem para preencher o espaço

---

## Timeline do projeto

| Data | Commit | O que foi feito |
|---|---|---|
| 17/03/2026 | `faa6217` | Initial commit |
| 17/03/2026 | `90c57ab` | Design tokens (`tokens.css`) e template base |
| 17/03/2026 | `219702d` | Primeiro protótipo funcional (preço oferta/regular) |
| 17/03/2026 | `6c65275` | Documentação SOP do pipeline |
| 18/03/2026 | `305e28f` | Reformatação e expansão do protótipo de preço |
| 25/03/2026 | `02440d6` | Protótipos de tokens e header com sidebar e dropdowns |
| 25/03/2026 | `3bf7732` | Assets: logo e ícones da sidebar |
| 30/03/2026 | `6c5aee1` | Seções Title, Big Numbers e ícones do header |
| 01/04/2026 | `cd8736c` | Seções Filtros, Resultados e Grid |

**Duração total:** ~4 semanas (17/03 a 15/04/2026)

**Métricas:**
- 9 commits
- ~7.776 linhas de código (HTML + CSS)
- 30+ assets SVG
- 5 PDFs de referência do Figma
- 20+ screenshots de referência

---

## Como usar o pipeline

### Pré-requisitos

- [Git](https://git-scm.com/download/win) instalado
- [VSCode](https://code.visualstudio.com/) instalado
- [Node.js](https://nodejs.org/) instalado
- Claude Code instalado (`npm install -g @anthropic-ai/claude-code`)
- Conta Anthropic autenticada (`claude` no terminal)
- Token de acesso pessoal do Figma (Settings → Security → Personal access tokens)
- Repositório clonado na máquina local

### Setup inicial

**1. Clone o repositório:**

```bash
git clone https://github.com/marcoskip/infoprice-prototipos.git
cd infoprice-prototipos
```

**2. Configure o Figma MCP:**

O arquivo `.mcp.json` na raiz já está configurado. Substitua o token se necessário:

```json
{
  "mcpServers": {
    "figma-developer-mcp": {
      "command": "npx",
      "args": ["figma-developer-mcp"],
      "env": {
        "FIGMA_API_KEY": "SEU_TOKEN_AQUI"
      }
    }
  }
}
```

**3. Configure o modelo Opus (recomendado):**

```bash
claude config set model claude-opus-4-5
```

### Gerando um protótipo

**Passo 1 — Abra o terminal na pasta do projeto:**

```bash
cd "C:/Users/ADMIN/Desktop/projeto claude"
```

**Passo 2 — Abra o Claude Code:**

```bash
claude
```

**Passo 3 — Cole o prompt padrão:**

Substitua `[URL DO FRAME]` e `[NOME-DO-ARQUIVO]`:

```
Acesse o frame nesta URL do Figma: [URL DO FRAME]

Com base no design, gere um arquivo chamado [NOME-DO-ARQUIVO].html na raiz do projeto.

Instruções:
- Use o template.html e o tokens.css já existentes no projeto como base
- Reproduza o layout do frame com fidelidade ao Design System da Infoprice
- Implemente botões com estados visuais completos: default, hover, active e disabled
- Implemente dropdowns e filtros funcionais e interativos, se houver no design
- Use dados fictícios mas realistas para preencher o conteúdo
- O código deve ser semântico, acessível e responsivo
- Não use bibliotecas externas — apenas HTML, CSS e JavaScript puro
```

**Passo 4 — Revise e ajuste:**

```
Ajuste [descreva o que precisa mudar]
```

**Passo 5 — Publique:**

```bash
git add .
git commit -m "feat: adiciona protótipo [nome da tela]"
git push origin main
```

**Passo 6 — Compartilhe:**

```
https://marcoskip.github.io/infoprice-prototipos/[NOME-DO-ARQUIVO].html
```

---

## Páginas de referência

| Página | URL | Descrição |
|---|---|---|
| Gerenciador de Preços | [index.html](index.html) | Protótipo principal com todas as seções |
| Design Tokens | [tokens.html](tokens.html) | Catálogo visual: cores, tipografia, sombras, ícones |
| Componentes | [components.html](components.html) | Componentes isolados com estados e variações |

---

## Escopo de interatividade

Os protótipos têm como objetivo **validação visual e funcional**, não implementação.

| Elemento | Comportamento implementado |
|---|---|
| Botões | Default, hover, active, disabled |
| Dropdowns | Abrir/fechar, selecionar opção, fechar ao clicar fora |
| Filtros | Search em tempo real, checkbox, "Selecionar todos", "Limpar filtros" |
| Tooltips | Aparecem no hover, posição acima ou abaixo |
| Sidebar | Expand/collapse com transição, ajuste de todas as seções |
| Tabela | Hover nas linhas, checkboxes, inputs editáveis, paginação |
| Sorting | Dropdowns de preferência de ordenação por coluna |

Dados dinâmicos, integração com APIs e lógica de negócio **ficam a cargo do time de desenvolvimento**.

---

## Solução de problemas

**O Figma MCP não está conectado**  
Verifique se `.mcp.json` está na raiz e se o token do Figma é válido. Tokens expirados precisam ser regenerados em Figma → Settings → Security.

**O Claude Code não reconhece o Figma MCP**  
Feche e reabra o Claude Code. O `.mcp.json` é lido apenas na inicialização.

**O protótipo não aparece no GitHub Pages**  
Aguarde 2–5 minutos após o push. Verifique em Settings → Pages se o branch `main` está configurado.

**O design não foi reproduzido fielmente**  
Adicione mais detalhes ao prompt descrevendo os elementos específicos. Quanto mais contexto, melhor o resultado.

**Como atualizar os tokens do Design System**  
Rode o seguinte prompt no Claude Code:

```
Acesse o arquivo do Design System no Figma: https://www.figma.com/design/qXRoOz0cCzAX4WgOz7fAmJ/Design-System

Extraia todos os tokens disponíveis — Variables e Styles — e atualize o arquivo
tokens.css na raiz do projeto, mantendo a estrutura e os comentários existentes.
```

---

_Desenvolvido pelo time de UX/UI — InfoPrice · 2026_
