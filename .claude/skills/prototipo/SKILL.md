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
Leia o arquivo de referencia [componentes.md](componentes.md) para entender os componentes disponiveis e suas specs.
Consulte tambem [referencia-producao.md](referencia-producao.md) — um indice que aponta para 9 arquivos de referencia modulares (ref-tokens, ref-botoes, ref-filtros, ref-tabela, ref-inputs, ref-data-display, ref-navegacao, ref-modais, ref-gerenciador). Leia o indice e depois o arquivo especifico da categoria que precisa. Isso garante fidelidade ao produto real (`app.infoprice.co`).

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
