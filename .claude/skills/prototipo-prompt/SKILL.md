---
name: prototipo-prompt
description: Gera um prototipo HTML interativo do IPA InfoPrice a partir de uma descricao textual ou sketch/wireframe (imagem), seguindo o Design System publicado. Valida classes via grep antes de escrever.
argument-hint: [nome-do-arquivo] [descricao da tela]
allowed-tools: Bash(npx *) Read Write Edit Glob Grep
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

2. **`design-system.html`** — REFERENCIA PRIMARIA de markup. Pagina viva publicada em `https://marcoskip.github.io/infoprice-prototipos/design-system.html` com preview + codigo de cada componente. Use como referencia visual e copia direta de snippets. Para complementos textuais, consulte [componentes.md](componentes.md) e [../prototipo/arquitetura.md](../prototipo/arquitetura.md).

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

Resumo (detalhes em [../prototipo/arquitetura.md](../prototipo/arquitetura.md)):
- Todas as secoes usam `position: fixed` com coordenadas absolutas
- Sidebar toggle altera o `left` de todas as secoes (52px ↔ 220px)
- Filtros toggle altera o `top` das secoes abaixo
- Grid ocupa o resto com `overflow: auto`
- Gap de 8px entre secoes adjacentes (regra obrigatoria)

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

### 6. Informar o usuario

Ao finalizar:
- Caminho do arquivo criado
- Componentes incluidos
- Dados ficticios gerados
- Interacoes funcionais
- Tabela de validacao
- Comando para publicar:
  ```
  git add $0.html
  git commit -m "feat: adiciona prototipo $0"
  git push origin main
  ```
- URL publica: `https://marcoskip.github.io/infoprice-prototipos/$0.html`

---

## Resumo do fluxo (TL;DR)

1. Le entrada (texto ou imagem)
2. Identifica secoes e componentes
3. Para cada classe → **grep no styles.css** antes de escrever
4. Escreve HTML seguindo hierarquia DOM correta
5. Valida 7 pontos. Corrige FAILs. Reporta WARNs.
6. Entrega arquivo + URL + comandos de publicacao
