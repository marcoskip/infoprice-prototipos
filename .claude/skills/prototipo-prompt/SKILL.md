---
name: prototipo-prompt
description: Gera um prototipo funcional HTML a partir de uma descricao textual, sem depender do Figma, seguindo o Design System InfoPrice e a arquitetura padrao do IPA
argument-hint: [nome-do-arquivo] [descricao da tela]
allowed-tools: Bash(npx *) Read Write Edit Glob Grep
---

# Gerar Prototipo a partir de Prompt

Voce e um gerador de prototipos funcionais do IPA (Software de Precificacao) da InfoPrice.
Sua tarefa: transformar uma descricao textual em um arquivo HTML interativo seguindo o Design System da InfoPrice.

## Argumentos

- **$0** = Nome do arquivo de saida, sem extensao (obrigatorio). O arquivo sera criado como `$0.html` na raiz do projeto.
- **$1 em diante** = Descricao da tela desejada (obrigatorio). Pode incluir: titulo da pagina, quais secoes incluir, quais dados mostrar, colunas da grid, cards de KPI, filtros, etc.

Se o nome do arquivo estiver faltando, pergunte ao usuario antes de prosseguir.
Se a descricao estiver vaga, pergunte detalhes antes de gerar.

---

## Passo a passo

### 1. Interpretar a descricao

Analise o que o usuario pediu e identifique quais componentes da biblioteca serao necessarios.
Leia o arquivo de referencia [../prototipo/componentes.md](../prototipo/componentes.md) para conhecer os componentes disponiveis.

Componentes que podem ser incluidos:
- **Header** — sempre incluir (top bar com logo, dropdowns de produtos e usuario)
- **Sidebar** — sempre incluir (menu lateral colapsavel com 5 modulos)
- **Title Bar** — incluir se o usuario especificar titulo ou botoes de acao
- **Big Numbers** — incluir se o usuario mencionar KPIs, metricas ou indicadores
- **Filtros** — incluir se o usuario mencionar filtros, busca ou segmentacao
- **Cabecalho** — incluir se o usuario mencionar botoes de acao avancada ou filtros compostos
- **Grid** — incluir se o usuario mencionar tabela, lista de dados ou colunas

Se o usuario nao especificar quais secoes, use o layout completo padrao (todas as secoes).

### 2. Definir os dados

Com base na descricao, defina:
- **Titulo da pagina** (para o title bar)
- **KPIs** (para big numbers): nome, valor, tipo de card (azul fixo, azul auto, verde), variacao se aplicavel
- **Filtros** (para a secao de filtros): quais chips e tipos de dropdown
- **Colunas da grid**: nome, largura, tipo de conteudo (texto, numero, input, %, R$, icone)
- **Dados ficticios**: gere ~20 linhas de dados realistas para o contexto descrito

Se o contexto for varejo/supermercado, use dados de produtos alimenticios, precos, lojas.
Se for outro contexto, adapte os dados mas mantenha o mesmo Design System.

### 3. Gerar o arquivo HTML

Crie o arquivo `$0.html` na raiz do projeto seguindo rigorosamente estas regras:

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
2. **Tokens do DS**: Sempre use as custom properties de `tokens.css` — nunca valores hardcoded para cores, fontes, espacamento, sombras ou border-radius
3. **Estilos compartilhados**: Importe `styles.css` e reutilize as classes existentes. Leia o arquivo `styles.css` para verificar quais classes ja existem antes de criar novas
4. **Zero dependencias externas**: Apenas HTML, CSS e JavaScript puro
5. **Assets remotos**: Use os SVGs hospedados em `https://marcoskip.github.io/infoprice-prototipos/assets/`. Consulte o componentes.md para ver os caminhos disponiveis
6. **Dados ficticios**: Gere ~20 linhas de dados via JavaScript quando houver tabela
7. **Semantica e acessibilidade**: Use `role`, `aria-*`, `tabindex` nos elementos interativos
8. **BEM naming**: Classes CSS seguem BEM (bloco__elemento--modificador)

#### Arquitetura de layout

Leia o arquivo de referencia [../prototipo/arquitetura.md](../prototipo/arquitetura.md) para o sistema de posicionamento fixo, sidebar toggle e filtros toggle.

Resumo:
- Todas as secoes usam `position: fixed` com coordenadas absolutas
- Sidebar toggle altera o `left` de todas as secoes (52px <-> 220px)
- Filtros toggle altera o `top` das secoes abaixo
- Grid ocupa o espaco restante com `overflow: auto`

#### Interatividade padrao

Para TODOS os dropdowns e elementos interativos:
- Apenas um dropdown aberto por vez
- Clicar fora fecha o dropdown aberto
- Overlay no header
- Transicoes: opacity + translateY (140ms ease) para header, direto para filtros
- Chevrons giram 180deg ao abrir
- Search filtra em tempo real
- "Limpar filtros" desmarca todos os checkboxes

#### Adaptacoes permitidas

Quando a descricao do usuario diverge do layout padrao do Gerenciador de Precos:

- **Colunas da grid**: adapte livremente o `<colgroup>`, headers e geracao de dados JS
- **KPIs**: adapte a quantidade, tipo (azul/verde), valores e descricoes dos cards
- **Filtros**: adapte os chips e tipos de dropdown ao contexto
- **Cabecalho**: adapte os botoes compostos ao contexto
- **Titulo**: adapte o texto e os botoes do title bar
- **Sidebar**: mantenha sempre os mesmos 5 modulos (e a estrutura padrao do IPA)
- **Header**: mantenha sempre o mesmo header (logo, produtos, usuario)

### 4. Revisar

Apos gerar o arquivo:
1. Leia o arquivo gerado para verificar se esta completo
2. Verifique se todos os imports estao corretos
3. Verifique se os caminhos dos assets estao corretos
4. Verifique se o JavaScript nao tem erros de sintaxe
5. Confirme que o arquivo funciona standalone

### 5. Informar o usuario

Ao finalizar, informe:
- O arquivo criado e seu caminho
- Quais componentes foram incluidos
- Quais dados ficticios foram gerados
- Quais interacoes estao funcionais
- O comando para publicar:
  ```
  git add $0.html
  git commit -m "feat: adiciona prototipo $0"
  git push origin main
  ```
- A URL publica: `https://marcoskip.github.io/infoprice-prototipos/$0.html`
