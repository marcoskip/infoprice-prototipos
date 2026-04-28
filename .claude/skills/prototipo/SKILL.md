---
name: prototipo
description: Gera um prototipo funcional HTML a partir de um frame do Figma, seguindo o Design System InfoPrice e a arquitetura padrao do IPA
argument-hint: [URL_DO_FIGMA] [nome-do-arquivo]
allowed-tools: Bash(npx *) Read Write Edit Glob Grep
---

# Gerar Prototipo Funcional

Voce e um gerador de prototipos funcionais do IPA (Software de Precificacao) da InfoPrice.
Sua tarefa: transformar um frame do Figma em um arquivo HTML interativo, fiel ao design, usando o Design System da InfoPrice.

## Argumentos

- **$0** = URL do frame no Figma (obrigatorio)
- **$1** = Nome do arquivo de saida, sem extensao (obrigatorio). O arquivo sera criado como `$1.html` na raiz do projeto.

Se algum argumento estiver faltando, pergunte ao usuario antes de prosseguir.

---

## Passo a passo

### 1. Ler o design do Figma

Use a ferramenta `get_design_context` do Figma MCP para ler o frame na URL `$0`.
Extraia o `fileKey` e `nodeId` da URL:
- `figma.com/design/:fileKey/:fileName?node-id=:nodeId` — converta "-" para ":" no nodeId
- Se houver `/branch/:branchKey/` na URL, use `branchKey` como fileKey

Tambem use `get_screenshot` para ter referencia visual.

### 2. Analisar os componentes necessarios

Compare o design recebido com a biblioteca de componentes ja implementados.

#### Hierarquia de referencias (ordem de prioridade)

Quando houver conflito entre elas, a de maior prioridade SEMPRE vence:

1. **`styles.css` + `tokens.css`** (VERDADE ABSOLUTA) — Classes CSS, tokens, hierarquia DOM. Se uma classe existe aqui, use-a exatamente como definida. Se nao existe, NAO invente — crie com estilo completo no `<style>` ou pergunte ao usuario.
2. **`design-system.html`** (REFERENCIA PRIMARIA DE MARKUP) — Pagina viva publicada em `https://marcoskip.github.io/infoprice-prototipos/design-system.html` com preview + codigo de cada componente. Use como referencia visual e copia direta de snippets. **TODOS os prototipos novos devem usar esta pagina como referencia canonica.** Para complementos textuais, consulte [componentes.md](componentes.md).

**Regra pratica**: Antes de usar qualquer classe como container estrutural, grep no `styles.css` para confirmar que ela existe. Se nao existir, copie o snippet do `design-system.html` ou pergunte ao usuario.

### 3. Gerar o arquivo HTML

Crie o arquivo `$1.html` na raiz do projeto seguindo rigorosamente estas regras:

#### Estrutura do arquivo

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

1. **Arquivo unico**: HTML com `<style>` inline (apenas estilos especificos da pagina) e `<script>` inline
2. **Tokens do DS**: Sempre use as custom properties de `tokens.css` — NUNCA use valores hardcoded ou cores de fora do Design System. Isso vale para cores, fontes, espacamento, sombras e border-radius. Se a cor necessaria nao existir nos tokens, pergunte ao usuario se deve adicionar ao tokens.css. Nunca invente cores
3. **Estilos compartilhados**: Importe `styles.css` e reutilize as classes existentes (header, sidebar, title-bar, big-numbers, filtros, grid, etc.). Leia o arquivo `styles.css` para verificar quais classes ja existem antes de criar novas
4. **Zero dependencias externas**: Apenas HTML, CSS e JavaScript puro. Sem frameworks, sem bibliotecas
5. **Assets remotos**: Use os SVGs hospedados em `https://marcoskip.github.io/infoprice-prototipos/assets/` (sidebar icons, cabecalho icons, grid icons). Consulte o componentes.md para ver os caminhos disponiveis
6. **Dados ficticios**: Preencha com dados realistas de supermercado/varejo (produtos, precos, lojas). Gere ~20 linhas de dados via JavaScript quando houver tabela
7. **Semantica e acessibilidade**: Use `role`, `aria-*`, `tabindex` nos elementos interativos
8. **BEM naming**: Classes CSS seguem BEM (bloco__elemento--modificador)

#### Arquitetura de layout

Leia o arquivo de referencia [arquitetura.md](arquitetura.md) para entender o sistema de posicionamento fixo, sidebar toggle e filtros toggle.

Resumo:
- Todas as secoes usam `position: fixed` com coordenadas absolutas
- Sidebar toggle altera o `left` de todas as secoes (52px <-> 220px)
- Filtros toggle altera o `top` das secoes abaixo
- Grid ocupa o espaco restante com `overflow: auto`

#### Interatividade padrao

Para TODOS os dropdowns e elementos interativos:
- Apenas um dropdown aberto por vez (abre um, fecha todos os outros)
- Clicar fora fecha o dropdown aberto
- Overlay escurece o fundo quando dropdown do header esta aberto
- Transicoes: opacity + translateY (140ms ease) para dropdowns do header, direto para filtros
- Chevrons giram 180deg ao abrir
- Search nos filtros: filtra itens em tempo real
- "Limpar filtros": desmarca todos os checkboxes
- "Selecionar todos": marca/desmarca todos no grupo

### 4. Revisar

Apos gerar o arquivo:
1. Leia o arquivo gerado para verificar se esta completo
2. Verifique se todos os imports (tokens.css, styles.css, fonts) estao corretos
3. Verifique se os caminhos dos assets (SVGs) estao corretos
4. Verifique se o JavaScript nao tem erros de sintaxe
5. Confirme que o arquivo funciona standalone (abrir direto no browser)

### 4.5. Validacao de Tokens (Constitution Check)

Rode uma verificacao automatica no HTML gerado para garantir conformidade com o Design System.

**O que verificar:**

1. **Cores** — Busque valores hexadecimais (`#xxx`, `#xxxxxx`) e `rgb()`/`rgba()` no `<style>`. Cada ocorrencia DEVE estar dentro de um `var(--token, fallback)` como fallback, ou ser `#fff`/`#000`/`transparent`. Cores soltas fora de `var()` sao violacao.
2. **Tipografia** — Verifique que `font-family` sempre usa `'Open Sans', sans-serif` e que `font-size`, `font-weight` e `line-height` usam tokens (`var(--font-size-*)`, `var(--font-weight-*)`, `var(--line-height-*)`).
3. **Espacamento** — Verifique que `padding`, `margin` e `gap` usam tokens (`var(--space-*)`) ou multiplos de 4px. Valores arbitrarios (ex: `13px`, `7px`) sao suspeitos.
4. **Sombras e bordas** — Verifique que `box-shadow` usa `var(--shadow-*)` e `border-radius` usa `var(--radius-*)`.
5. **Cores inline no JS** — Busque cores hardcoded em estilos inline definidos via JavaScript. Devem usar `var(--color-*)`.
6. **Componentes interativos (regra do grep)** — Antes de escrever QUALQUER classe de componente no HTML (botao, chip, card, link, etc.), rode a ferramenta `Grep` no `styles.css` com o nome exato da classe. Tres possiveis resultados:
   - **Match `.classe {`** → classe existe, pode usar.
   - **Sem match** → classe nao existe. Tres opcoes: (a) usar uma classe que existe, (b) criar a classe com estilo completo no `<style>` da pagina, (c) promover para `styles.css` global se for reutilizavel.
   - **Match em outro arquivo (.html)** → e classe page-specific de outro prototipo, NAO e global. Se quiser usar, replique o estilo no `<style>` da sua pagina ou promova para `styles.css`.

   NUNCA escreva uma classe sem fazer esse grep antes. Assumir que ela existe com base em memoria, em `componentes.md`, ou porque viu em outro prototipo, e violacao garantida — classes inventadas renderizam com estilo default do browser e isso e FAIL. Aplica-se tambem a classes mencionadas como exemplo nas proprias skills (`filtro-chip`, `title-btn`, `neg__save-btn`, etc.) — confirme antes de usar, listas em documentacao podem estar desatualizadas.
7. **Estrutura HTML (hierarquia DOM)** — Cada secao padrao do layout DEVE seguir a hierarquia de containers definida no `styles.css`. Classes estruturais fora da hierarquia correta perdem o `display: flex`, `gap`, `align-items` etc. e causam sobreposicao ou desalinhamento. Verifique que:
   - `section.filtros` → `.filtros__inner` → `.filtros__box` → `.filtros__left` (chips) + `.filtros__right` ("Limpar filtros" e filtros-salvos). Se o layout for simplificado (sem `.filtros__box`), os chips e o botao limpar ainda devem estar em containers flex separados — nunca soltos lado a lado dentro de `.filtros__inner`.
   - `section.cabecalho` → `.cabecalho__inner` → `.cabecalho__info` (contador) + `.cabecalho__buttons` (botoes de acao). NUNCA usar `.cabecalho__left`/`.cabecalho__right` — essas classes nao existem no `styles.css`.
   - `section.title-bar` → `.title-bar__left` (titulo) + `.title-bar__right` (botoes)
   - `section.big-numbers` → `.big-numbers__inner` → `.big-numbers__cards` → cards individuais
   - `section.grid` → `.grid__wrapper` → `table.grid__table`
   - **Regra geral**: Antes de usar qualquer classe `bloco__elemento` como container estrutural, grep no `styles.css` para confirmar que ela existe e tem layout (display, flex, gap). Se nao existir, use uma que exista ou crie com estilo completo no `<style>`.
   - Elementos interativos (botoes, chips) NUNCA devem ficar como filhos diretos de `.filtros__inner` ou `.cabecalho` — sempre dentro do sub-container correto.

**Como reportar:**

Gere uma tabela resumo no final do output:

```
Validacao de Tokens:
| Verificacao       | Status | Detalhes              |
|-------------------|--------|-----------------------|
| Cores             | PASS   | 0 violacoes           |
| Tipografia        | PASS   | Open Sans + tokens    |
| Espacamento       | WARN   | 1 valor fora de token |
| Sombras/Bordas    | PASS   | 0 violacoes           |
| Cores inline (JS) | PASS   | 0 violacoes           |
| Componentes       | PASS   | Todos usam classes DS |
| Estrutura HTML    | PASS   | Hierarquia DOM ok     |
```

- **PASS**: Nenhuma violacao encontrada
- **WARN**: Valor fora do padrao mas justificavel (ex: `2px` para border-width)
- **FAIL**: Violacao clara que precisa ser corrigida

Se houver FAIL: corrija automaticamente antes de reportar ao usuario.
Se houver WARN: reporte mas nao bloqueie.

### 5. Informar o usuario

Ao finalizar, informe:
- O arquivo criado e seu caminho
- Quais componentes foram implementados
- Quais interacoes estao funcionais
- O comando para publicar:
  ```
  git add $1.html
  git commit -m "feat: adiciona prototipo $1"
  git push origin main
  ```
- A URL publica: `https://marcoskip.github.io/infoprice-prototipos/$1.html`
