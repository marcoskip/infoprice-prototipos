---
name: handoff
description: Converte um prototipo HTML do IPA InfoPrice em componente React (.tsx) pronto para producao. Le o HTML existente (gerado por /prototipo-prompt), identifica componentes do Design System usados, e gera codigo React equivalente — usando .react.tsx canonico quando existe, ou conversao automatica HTML→JSX quando nao.
argument-hint: [caminho-do-prototipo.html] [nome-do-componente-react]
allowed-tools: Bash(npx *) Bash(start *) Bash(open *) Bash(xdg-open *) Bash(curl *) Bash(mkdir *) Bash(test *) Bash(if *) Read Write Edit Glob Grep
---

# Handoff: Prototipo HTML → Componente React (IPA InfoPrice)

Voce converte um prototipo HTML aprovado pelos stakeholders em um componente
React (`.tsx`) pronto pra integrar em producao. O input e um arquivo HTML
(geralmente gerado pela skill `/prototipo-prompt`); o output e um arquivo
`.tsx` standalone que pode ser importado em qualquer projeto React.

## Argumentos

- **$0** = Caminho do prototipo HTML de entrada (obrigatorio). Ex: `recrie.html`,
  `prototipos/dashboard.html`.
- **$1** = Nome do componente React em PascalCase, sem extensao (obrigatorio).
  Ex: `DashboardCustos`, `TelaFornecedores`. Sera criado como `$1.tsx` na raiz.

Se faltar argumento, pergunte antes de gerar.

---

## ⚠️ LEI PRINCIPAL DA SKILL

**NENHUM componente pode ser convertido sem antes ser conferido no DS.**

Antes de converter qualquer markup com classe BEM do IPA, voce DEVE:

1. **Localizar o componente no DS** — em `MODE=new`, cada componente tem
   `${DS_PATH}/components/<cat>/<id>/<id>.html` (HTML canonico) e
   opcionalmente `<id>.react.tsx` (React canonico). Em `MODE=legacy`,
   consulte `${DS_PATH}/design-system.html`.
2. **Preferir `.react.tsx` canonico quando existe** — copia o componente React
   pre-escrito (qualidade controlada, especialmente em components com estado).
3. **Auto-converter quando NAO existe `.react.tsx`** — aplicar as regras de
   conversao HTML→JSX deste SKILL.md, mantendo classes BEM, comportamento e
   acessibilidade do original.
4. **Confirmar via grep** que cada `className` literal usado existe no DS.

**Componentes novos so podem ser criados se NAO existirem no DS** (mesma
regra do `/prototipo-prompt`).

**O que conta como QUEBRA do DS (proibido):**

- Substituir um componente do DS por uma reescrita "limpa" em React.
  Use as classes do DS como sao.
- Inventar nomes de classes ou variantes.
- Inventar componentes React que nao tem equivalente no DS.

---

## Fontes de verdade (3 niveis)

Quando houver conflito, a de maior prioridade SEMPRE vence:

1. **`<id>.react.tsx`** (FONTE REACT CANONICA, quando existe) — em
   `${DS_PATH}/components/<cat>/<id>/<id>.react.tsx`. Componentes complexos
   stateful (Modal, Dropdown, SelectPicker) tem essa fonte; simples (Button,
   Badge) podem nao ter.
2. **`<id>.html` + `<id>.css`** (FONTE HTML+CSS) — referencia da estrutura DOM
   e classes BEM. Use pra auto-conversao quando `.react.tsx` nao existe.
3. **`react-guide.html`** (PADROES REACT) — em `${DS_PATH}/dist/` ou
   `${DS_PATH}/react-guide.html`. Convencoes gerais: hooks (`useState`,
   `useEffect`, `createPortal`), `clsx` para className condicional, patterns
   de eventos, etc.

---

## Fluxo

### 0. Localizar fontes do DS (`DS_PATH` + `MODE`)

**Antes de qualquer Read/Grep**, determine onde os arquivos do DS estao
acessiveis. Detecte com `Glob`/`Bash`:

| Verificacao                               | Resultado                                  |
| ----------------------------------------- | ------------------------------------------ |
| `./design-system/components/` existe      | `MODE=new`, `DS_PATH=./design-system/`     |
| `./DSBridge/design-system/components/`    | `MODE=new`, `DS_PATH=./DSBridge/design-system/` |
| `./styles.css` na raiz                    | `MODE=legacy`, `DS_PATH=./`                |
| `./DSBridge/styles.css`                   | `MODE=legacy`, `DS_PATH=./DSBridge/`       |

Em `MODE=legacy`, **avise o usuario** que `.react.tsx` por componente nao
existe (vai usar 100% auto-conversao).

### 1. Ler o prototipo HTML de entrada

`Read $0`. Mapeie:

- **Estrutura DOM**: `<header>`, `<aside>`, `<section>`, `<main>` etc.
- **Componentes do DS usados**: classes BEM (ex: `.btn--primary`, `.grid__table`,
  `.filtro-chip`, `.composed-btn`).
- **Estado dinamico**: `is-open`, `is-active`, `is-checked`, etc. → vai virar
  `useState`.
- **Event handlers**: `onclick`, `addEventListener` → vai virar `onClick`,
  `useEffect` ou refs.
- **Mock data**: arrays/objects no `<script>` (ex: `const PRODUTOS = [...]`)
  → vai pra constantes no topo do componente.
- **CSS page-specific**: regras dentro de `<style>` que nao sao do DS → vai
  pra style block CSS-in-JS (`<style>` JSX) ou arquivo CSS adjacente.

### 2. Mapear cada componente DS encontrado

Para cada componente identificado no Passo 1:

1. `Glob ${DS_PATH}/components/*/<id>/` para descobrir a categoria
2. Verifique se existe `${DS_PATH}/components/<cat>/<id>/<id>.react.tsx`
3. **Se existe** → marque `STRATEGY=lookup` (usar React canonico, importar via path)
4. **Se nao existe** → marque `STRATEGY=convert` (auto-conversao HTML→JSX)

**Componentes com `.react.tsx` canonico ja escritos** (atualize esta lista
conforme novos forem promovidos pra Fase 3):

| Componente              | Path                                                                         | API resumida                                                                       |
| ----------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `modal`                 | `components/compound/modal/modal.react.tsx`                                  | `<Modal isOpen onClose title size footer>...</Modal>`                              |
| `toast`                 | `components/compound/toast/toast.react.tsx`                                  | `<ToastContainer />` + `toast.success({...})` API global                           |
| `header-dropdowns`      | `components/compound/header-dropdowns/header-dropdowns.react.tsx`            | `useHeaderDropdowns()` hook + `<ProductDropdown>` + `<UserDropdown>`               |
| `select-picker`         | `components/basic/select-picker/select-picker.react.tsx`                     | `<SelectPicker options value onChange searchable multiple />`                       |
| `date-picker`           | `components/basic/date-picker/date-picker.react.tsx`                         | `<DatePicker mode="single|range" value onChange />`                                 |

Para esses, o handoff deve **importar** o componente em vez de re-converter o HTML:

```tsx
import Modal from '@ds/components/compound/modal/modal.react';
// ou path relativo ao seu projeto, ex:
// import Modal from '../../design-system/components/compound/modal/modal.react';

<Modal isOpen={open} onClose={() => setOpen(false)} title="Confirmar">
  Conteudo...
</Modal>
```

Componentes nao listados acima caem no `STRATEGY=convert`.

### 3. Conversao HTML → JSX (regras mecanicas)

**REGRA CRITICA: preserve URLs absolutas do input.** Se o HTML original usa
`https://marcoskip.github.io/infoprice-prototipos/assets/logo.svg` em
`<img src="...">`, o `.tsx` deve usar a MESMA URL — nao "atualize" pra um CDN
diferente. Extraia a base como const (`const ASSETS_BASE = 'https://...'`)
no topo do arquivo, mas preservando o dominio do input.

Quando `STRATEGY=convert`, aplique estas substituicoes:

| HTML                      | JSX                                                      |
| ------------------------- | -------------------------------------------------------- |
| `class="..."`             | `className="..."`                                        |
| `for="..."`               | `htmlFor="..."`                                          |
| `tabindex="..."`          | `tabIndex={...}`                                         |
| `readonly`                | `readOnly`                                               |
| `maxlength`               | `maxLength`                                              |
| `<input>` (sem fechamento)| `<input />`                                              |
| `<br>`                    | `<br />`                                                 |
| `<!-- comentario -->`     | `{/* comentario */}`                                     |
| `style="x: y; z: w"`      | `style={{ x: 'y', z: 'w' }}` (camelCase props)          |
| `data-foo="x"`            | `data-foo="x"` (mantem hifen)                           |
| `aria-foo="x"`            | `aria-foo="x"` (mantem hifen)                           |
| Boolean attrs (`disabled`)| `disabled` ou `disabled={true}`                          |
| Event `onclick="fn()"`    | `onClick={fn}`                                           |
| `&nbsp;`                  | `{' '}` ou `&nbsp;` em texto literal               |

### 4. Estado e hooks

Para cada padrao identificado no input:

| Padrao HTML                          | Padrao React                                        |
| ------------------------------------ | --------------------------------------------------- |
| Toggle de classe `is-open` em click  | `const [open, setOpen] = useState(false);`<br>`onClick={() => setOpen(o => !o)}` |
| `aria-expanded="true/false"`         | `aria-expanded={open}`                              |
| Lista mockada renderizada via JS     | `const [items] = useState(MOCK_DATA);`<br>`{items.map(item => <Row key={item.id} {...item}/>)}` |
| Filtro/search                        | `const [query, setQuery] = useState('');`<br>`const filtered = items.filter(...)` |
| Click fora pra fechar dropdown       | `useEffect(() => { addEventListener('click', closeAll); return () => removeEventListener(...) }, [])` |
| Modal/Toast com portal               | `createPortal(<Modal>, document.body)` (de `react-dom`) |

### 5. Estrutura do arquivo `.tsx` gerado

```tsx
// $1.tsx
import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
// import { createPortal } from 'react-dom'; // se usar Modal/Toast/Portal

// ─── Mock data (extraido do <script> do prototipo) ──────────────
const MOCK_DATA = [
  // ...
];

// ─── Tipos (opcional, se TS estrito) ─────────────────────────────
type Item = { id: string; nome: string; /* ... */ };

// ─── Componente ─────────────────────────────────────────────────
export default function $1() {
  // Estado
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  // Effects
  useEffect(() => {
    // ...
  }, []);

  // Handlers
  const handleClick = () => setOpen(o => !o);

  // Render
  return (
    <>
      {/* Markup convertido */}
      <header className="header">...</header>
      <main>...</main>
    </>
  );
}
```

### 6. Validar (Constitution Check)

Apos gerar, rode 7 verificacoes:

| #   | Verificacao            | Como rodar                                                                                                                          |
| --- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **JSX valido**         | Grep por `class=`, `for=`, `tabindex=` no `.tsx` (deve ser zero — todas convertidas pra `className`, `htmlFor`, `tabIndex`)         |
| 2   | **Cores via tokens**   | Grep `#[0-9a-fA-F]{3,6}` no `.tsx`. Excecao: `#fff`, `#000`, `transparent`. Use classes do DS ou `var(--color-*)`                   |
| 3   | **Imports corretos**   | `react` (named imports de hooks), `clsx`. Adicionar `react-dom` apenas se usar `createPortal`. Sem libs extras.                     |
| 4   | **Classes existem**    | Para cada `className` literal, grep em `${DS_PATH}/dist/styles.css` (NEW) ou `${DS_PATH}/styles.css` (LEGACY). Sem match = FAIL     |
| 5   | **Hooks com regras**   | `useState`/`useEffect`/`useRef`/`useContext` no top-level. Custom hooks comecam com `use*`                                          |
| 6   | **Acessibilidade**     | `aria-label` em botoes icon-only, `role` em divs custom interativas, `tabIndex` em divs/spans clicaveis, `htmlFor` em labels       |
| 7   | **Export e nome**      | `export default function $1()` (nome PascalCase, casa com nome do arquivo)                                                          |

Reporte em tabela. **PASS / WARN / FAIL** — corrija FAILs antes de entregar.

### 7. Informar o usuario

Ao finalizar:

- Caminho do `.tsx` criado
- Lista de componentes DS encontrados e estrategia aplicada (lookup vs convert)
- Pre-requisitos do projeto React:
  ```
  npm install clsx
  ```
  + CSS do DS (`tokens.css` + `styles.css`) carregados no `<head>` do projeto.
  + **OVERRIDE OBRIGATORIO no `index.css` (ou root CSS) do projeto consumidor**:
    o `styles.css` do DS define `body { display: flex; align-items: flex-start }`
    porque os prototipos HTML legados sobrescrevem isso inline. Em projeto React,
    sem esse override, o layout fixed full-width quebra (header nao vai ate
    o fim, secoes desalinham). Adicione:
    ```css
    body { display: block; min-height: 100vh; width: 100%; }
    #root { width: 100%; min-height: 100vh; }
    ```
- Como importar:
  ```tsx
  import $1 from './$1';
  function App() { return <$1 />; }
  ```
- Tabela de validacao
- **Pontos para o dev**: liste o que ele precisa plugar (ex: dados reais via
  API em vez do mock, callbacks de submit, integracao com router, etc.)

---

## Convencoes do IPA — patterns React

### Header com dropdowns

```tsx
const [productOpen, setProductOpen] = useState(false);
const [userOpen, setUserOpen] = useState(false);

const closeAll = () => { setProductOpen(false); setUserOpen(false); };

return (
  <header className="header">
    <button
      className="header__menu-btn"
      aria-expanded={productOpen}
      onClick={() => { closeAll(); setProductOpen(o => !o); }}
    >
      <span className="material-icons-outlined">apps</span>
    </button>
    {productOpen && <div className="dropdown product-dropdown is-open">...</div>}
  </header>
);
```

### Sidebar com toggle

```tsx
const [expanded, setExpanded] = useState(false);
const sidebarLeft = expanded ? '220px' : '52px';

useEffect(() => {
  document.querySelectorAll('.title-bar, .filtros, .cabecalho, .grid')
    .forEach(el => (el as HTMLElement).style.left = sidebarLeft);
}, [expanded]);
```

### Grid com filtros

```tsx
const [filterStatus, setFilterStatus] = useState<Set<string>>(new Set());
const [search, setSearch] = useState('');

const filtered = ITEMS.filter(item => {
  if (filterStatus.size > 0 && !filterStatus.has(item.status)) return false;
  if (search && !item.nome.toLowerCase().includes(search.toLowerCase())) return false;
  return true;
});
```

### Modal/Toast (portal)

```tsx
import { createPortal } from 'react-dom';

const [open, setOpen] = useState(false);

return open
  ? createPortal(
      <div className="modal modal--open" role="dialog">...</div>,
      document.body
    )
  : null;
```

### Click fora pra fechar dropdown

```tsx
useEffect(() => {
  const handler = (e: MouseEvent) => {
    if (!(e.target as Element).closest('.filtro-dropdown, .filtro-chip, [data-keep-open]')) {
      closeAll();
    }
  };
  document.addEventListener('click', handler);
  return () => document.removeEventListener('click', handler);
}, []);
```

---

## Resumo do fluxo (TL;DR)

0. **Detecta `MODE` (new|legacy) e `DS_PATH`**
1. Le o prototipo HTML em `$0`
2. Identifica componentes DS usados (classes BEM) + estado + handlers + mock data
3. Para cada componente: existe `.react.tsx`? lookup : auto-converte
4. Aplica regras mecanicas de conversao HTML→JSX
5. Mapeia estado/handlers para hooks (useState/useEffect/useRef)
6. Gera `.tsx` com mock data como const, hooks, JSX convertido, export default
7. Valida 7 pontos. Corrige FAILs. Reporta WARNs.
8. Entrega arquivo + tabela de validacao + instrucoes pro dev (o que plugar)
