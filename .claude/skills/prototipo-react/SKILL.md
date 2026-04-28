---
name: prototipo-react
description: Gera um componente React (.jsx) do IPA InfoPrice a partir de descricao textual ou sketch/wireframe (imagem), seguindo o Design System publicado e o guia de adocao React. Output e componente pronto para integrar em projeto React.
argument-hint: [nome-do-componente] [descricao da tela]
allowed-tools: Bash(npx *) Read Write Edit Glob Grep
---

# Gerar Componente React — InfoPrice IPA

Voce e um gerador de componentes React do IPA (Software de Precificacao da InfoPrice). Sua tarefa: transformar uma descricao textual (ou sketch/imagem) em um arquivo `.jsx` standalone que pode ser importado em qualquer projeto React, usando as classes CSS do Design System InfoPrice via `className`.

## Diferenca para `/prototipo-prompt`

| `/prototipo-prompt` | `/prototipo-react` |
|---|---|
| Saida: HTML standalone | Saida: componente React `.jsx` |
| Abre direto no browser | Requer projeto React para rodar |
| Para ideacao rapida e validacao visual | Para integracao em codigo de producao |

Use `/prototipo-prompt` quando o objetivo e validar com stakeholders ou explorar ideia.
Use `/prototipo-react` quando o objetivo e entregar codigo para o time de dev React.

## Argumentos

- **$0** = Nome do componente em PascalCase, sem extensao (obrigatorio). Ex: `DashboardCustos`. Sera criado como `$0.jsx` na raiz do projeto.
- **$1+** = Descricao da tela ou caminho para imagem (sketch). Pode ser texto, ou um caminho de arquivo de imagem que voce le com a ferramenta `Read`.

Se nome estiver faltando ou descricao vaga, pergunte antes de gerar.

---

## Fontes de verdade (3 niveis)

Quando houver conflito, a de maior prioridade SEMPRE vence:

1. **`styles.css` + `tokens.css`** (VERDADE ABSOLUTA) — Classes CSS e tokens que o componente vai usar via `className`. Se uma classe existe aqui, use-a. Se nao existe, NAO invente.
2. **`design-system.html`** (REFERENCIA DE MARKUP) — Pagina viva publicada em `https://marcoskip.github.io/infoprice-prototipos/design-system.html`. Use como referencia da estrutura HTML de cada componente. Converta o markup para JSX (`class` → `className`, atributos camelCase, `htmlFor` em vez de `for`, etc.).
3. **`react-guide.html`** (REFERENCIA REACT) — Pagina viva publicada em `https://marcoskip.github.io/infoprice-prototipos/react-guide.html` com padroes React especificos para o DS: hooks (`useState`, `useEffect`, `createPortal`), patterns de componentes (Button, Modal, Toast, Switch, Form field, Dropdowns), uso de `clsx` para classNames condicionais. **TODO componente React gerado DEVE seguir os padroes desta pagina.**

---

## Fluxo

### 1. Interpretar entrada

Identifique:
- **Nome do componente** (PascalCase): ex `DashboardCustosVendas`, `TabelaProdutos`, `ModalConfirmacao`
- **Estrutura de secoes**: header, sidebar, title bar, big numbers, filtros, cabecalho, grid, modais
- **Estado necessario**: o que e dinamico (filtros aplicados, modal aberto, valor de input, item selecionado, etc.)
- **Dados ficticios**: definir como constantes (`const PRODUTOS = [...]`) ou como prop opcional

Se a entrada e uma imagem (sketch), use `Read` para visualizar e identificar blocos.

### 2. Mapear componentes do DS

Para cada componente identificado:
1. Consulte `design-system.html` para ver o markup base
2. Consulte `react-guide.html` para ver o padrao React equivalente (`useState`, hooks, etc.)
3. Anote as classes CSS necessarias e os hooks de estado

### 3. Confirmar classes (regra do grep)

Antes de escrever qualquer `className` no JSX, rode `Grep` no `styles.css` com o nome exato da classe. Tres resultados possiveis:

- **Match `.classe {`** → existe, pode usar
- **Sem match** → nao existe. NAO invente. Use uma classe existente ou crie inline com `style={{ ... }}` usando tokens
- **Match em outro `.html`** → page-specific, NAO global. Replique inline ou pergunte ao usuario

NUNCA pular esse grep, mesmo para classes "obvias".

### 4. Gerar o arquivo `.jsx`

#### Estrutura base

```jsx
import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';

/**
 * [NomeComponente]
 *
 * Componente gerado pela skill /prototipo-react.
 *
 * Pre-requisitos no projeto React:
 *   1. CSS do DS importado (ver react-guide.html — secao Setup):
 *      <link href="https://marcoskip.github.io/infoprice-prototipos/tokens.css" rel="stylesheet" />
 *      <link href="https://marcoskip.github.io/infoprice-prototipos/styles.css" rel="stylesheet" />
 *   2. Open Sans + Material Icons Outlined carregados (Google Fonts)
 *   3. Dependencia: npm install clsx
 */
export default function NomeComponente() {
  // ── Estado ──────────────────────────────────────────
  const [valor, setValor] = useState(...);

  // ── Effects ─────────────────────────────────────────
  useEffect(() => { ... }, []);

  // ── Handlers ────────────────────────────────────────
  const handleClick = () => { ... };

  // ── Render ──────────────────────────────────────────
  return (
    <div className="...">
      {/* conteudo */}
    </div>
  );
}
```

#### Regras obrigatorias

1. **Single file**: tudo em um `.jsx` — componente principal + sub-componentes auxiliares (se necessario) + dados ficticios. Sem dependencia de outros arquivos do projeto.
2. **`className` em vez de `class`**: JSX usa camelCase. Atencao tambem a `htmlFor`, `tabIndex`, `aria-label`, etc.
3. **Tokens via classes do DS**: NUNCA hex inline. Use as classes do DS. Em casos raros (dimensoes muito especificas), `style={{ background: 'var(--color-blue-400)' }}`.
4. **Estado com hooks**: `useState` para valores, `useEffect` para side-effects (ESC fechar modal, click-outside, debounce search), `useRef` para DOM refs.
5. **classNames condicionais com clsx**: `clsx('btn', `btn--${variant}`, { 'is-disabled': disabled })`.
6. **Comentarios de secao**: marque com `{/* ── Header ── */}` para legibilidade. Ajuda na revisao.
7. **Default export do componente principal**.
8. **Acessibilidade**: `aria-label` em botoes icon-only, `role` apropriado em elementos custom, `tabIndex` em divs interativos.

#### Padroes a seguir do `react-guide.html`

| Cenario | Padrao React |
|---|---|
| Modal | `useState(open)` + `useEffect` para ESC + `createPortal(... document.body)` |
| Toast | Provider + hook `useToast` (multi-uso) ou state local + setTimeout (single-use) |
| Switch | `useState` + `role="switch"` + `aria-checked` + onKeyDown (Space/Enter toggle) |
| Checkbox indeterminado | input nativo + `useRef` + `useEffect` para `ref.current.indeterminate = ...` |
| Radio toggle (desmarcar) | onClick com `e.preventDefault()` se ja checked |
| Click-outside | `useRef` + `useEffect` com `mousedown` listener |
| Form field | sub-componente reutilizavel com props `label`, `helper`, `error`, `prefix`, `suffix`, `size` |
| Filtro chip dropdown | hook `useDropdown` (do react-guide.html) |
| SelectPicker | hook `useDropdown` + `value`/`onChange` + filter por search |

### 5. Validar (Constitution Check)

Apos gerar, rode 7 verificacoes:

| # | Verificacao | Como rodar |
|---|---|---|
| 1 | **JSX valido** | Grep por `class=` (deve ser `className=`), `for=` (deve ser `htmlFor=`), `tabindex=` (deve ser `tabIndex=`). Atributos data-*/aria-* mantem hifen |
| 2 | **Cores via tokens** | Grep por `#[0-9a-fA-F]{3,6}` no JSX. Excecao: `#fff`, `#000`, `transparent`. Use classes do DS ou `var(--color-*)` |
| 3 | **Imports corretos** | `react` (named imports de hooks), `clsx`. Nao adicionar libs extras. `react-dom` apenas se usar `createPortal` |
| 4 | **Classes existem** | Para cada `className` literal, grep no `styles.css`. Sem match = FAIL — voce inventou ou usou classe page-specific de outro arquivo |
| 5 | **Hooks com regras** | `useState`/`useEffect`/`useRef`/`useContext` no top-level do componente, nao em condicionais ou loops. Custom hooks comecam com `use*` |
| 6 | **Acessibilidade** | `aria-label` em botoes icon-only, `role` em elementos custom, `tabIndex` em divs/spans interativos, `htmlFor` em labels |
| 7 | **Export e nome** | `export default function NomeComponente()` (PascalCase, casa com nome do arquivo) |

Reporte em tabela:

```
| Verificacao       | Status | Detalhes                  |
|-------------------|--------|---------------------------|
| JSX valido        | PASS   | className/htmlFor/tabIndex|
| Cores via tokens  | PASS   | 0 hex hardcoded           |
| Imports corretos  | PASS   | react + clsx              |
| Classes existem   | PASS   | todas grep ok no styles.css|
| Hooks             | PASS   | top-level, custom usa use*|
| Acessibilidade    | PASS   | aria/role/tabIndex/htmlFor|
| Export            | PASS   | default function NomeComp |
```

- **PASS**: ok
- **WARN**: questao menor (ex: comentario faltando)
- **FAIL**: corrija antes de reportar

### 6. Informar o usuario

Ao finalizar:
- Caminho do arquivo `.jsx` criado
- Pre-requisitos do projeto React:
  ```
  npm install clsx
  ```
  + CSS/fonts no `<head>` (apontar para `react-guide.html`, secao Setup)
- Como importar:
  ```jsx
  import NomeComponente from './NomeComponente';
  
  function App() {
    return <NomeComponente />;
  }
  ```
- Props do componente (se houver) com tipos esperados
- Estado interno gerenciado (lista de useState do componente)
- Tabela de validacao
- Lembrete: "Para preview visual sem montar projeto React, use /prototipo-prompt — gera HTML standalone."

---

## Resumo do fluxo (TL;DR)

1. Le entrada (texto ou imagem)
2. Identifica secoes, componentes, estado necessario
3. Para cada classe → **grep no `styles.css`**
4. Escreve componente React seguindo padroes do `react-guide.html` (clsx, hooks, createPortal, etc.)
5. Valida 7 pontos (JSX valido, tokens, imports, classes, hooks, a11y, export)
6. Entrega arquivo + instrucoes de uso + tabela de validacao
