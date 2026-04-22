# Filtros — Producao vs Prototipo

Mapeamento do sistema de filtros do `app.infoprice.co` para classes HTML/CSS dos prototipos.

**Fonte producao:** `src/components/NewFilterBox/`, `src/components/FilterSection/`, `src/components/CheckPicker/`, `src/components/CustomFilter/`

---

## Container de Filtros

| React | Prototipo | Descricao |
|---|---|---|
| `NewFilterBox` | `.filtros > .filtros__inner > .filtros__box` | Container principal |
| Row 1 (filtros padrao) | `.filtros__row` | Linha de chips de filtro |
| Row 2 (categorias) | `.filtros__row` | Linha de chips hierarquicos (01, 02, 03, 04) |
| Coluna direita | `.filtros__right` | + Filtros, Limpar, Salvos |

---

## Tipos de Filtro

### CheckPill (checkbox multi-select)

**React:** `<FilterSection type="check" searchable data={items} />`
**Prototipo:** `.filtro-chip` + `.filtro-dropdown`

```html
<div class="filtro-chip-wrapper">
  <button class="filtro-chip" data-filtro="nome">
    <span>Label</span>
    <span class="material-icons-outlined filtro-chip__chevron">keyboard_arrow_down</span>
  </button>
  <div class="filtro-dropdown" id="filtro-nome">
    <div class="filtro-dropdown__search">
      <span class="material-icons-outlined">search</span>
      <input type="text" class="filtro-dropdown__search-input" placeholder="Buscar..." />
    </div>
    <div class="filtro-dropdown__list">
      <label class="filtro-dropdown__item"><input type="checkbox" /><span>Item</span></label>
    </div>
  </div>
</div>
```

### SelectPill (radio single-select)

**React:** `<FilterSection type="select" data={items} />`
**Prototipo:** Mesmo HTML, mas com `<input type="radio">` no lugar de checkbox.

### AsyncCheckPill (busca async + paste)

**React:** `<AsyncCheckPill pasteValues searchable />`
**Prototipo:** CheckPill + link "Colar lista de codigos"

```html
<div class="filtro-dropdown__search">
  <span class="material-icons-outlined">search</span>
  <input type="text" class="filtro-dropdown__search-input" placeholder="Buscar..." />
  <span class="filtro-dropdown__paste-link">Colar lista de codigos</span>
</div>
```

Usado em: Produtos, Familia

### Grupos colapsaveis

**React:** Dropdown com `GroupHeader` colapsaveis
**Prototipo:** `.filtro-dropdown__group-header` + `.filtro-dropdown__group-items`

```html
<div class="filtro-dropdown__group-header">
  <span class="filtro-dropdown__group-title">Grupo</span>
  <span class="material-icons-outlined filtro-dropdown__group-arrow">keyboard_arrow_down</span>
</div>
<div class="filtro-dropdown__group-items">
  <label class="filtro-dropdown__item"><input type="checkbox" /><span>Item</span></label>
</div>
```

Usado em: Status de preco, Segmentacao

### Select all (footer)

**React:** `<FilterSelectAll />`
**Prototipo:** `.filtro-dropdown__footer`

```html
<div class="filtro-dropdown__footer">
  <label class="filtro-dropdown__item"><input type="checkbox" /><span>Selecionar todos</span></label>
</div>
```

Usado em: Lojas

### Empty state

```html
<div class="filtro-dropdown__empty">Nenhum item encontrado</div>
```

Usado em: Marca, Fornecedor (inicialmente vazio)

---

## Chips de Acao

| Funcao | Classe | HTML |
|---|---|---|
| + Filtros | `.filtro-chip--add` | `<button class="filtro-chip filtro-chip--add">+ Filtros</button>` |
| Limpar filtros | `.filtro-chip--clear` | `<button class="filtro-chip filtro-chip--clear">Limpar filtros</button>` |
| Filtros salvos | `.filtro-chip--action` | `<button class="filtro-chip filtro-chip--action">Filtros salvos</button>` |

---

## Chips hierarquicos (Row 2)

Prefixo numerico para indicar nivel da hierarquia:

```html
<button class="filtro-chip" data-filtro="departamento">
  <span class="filtro-chip__prefix">01</span>
  <span>Departamento</span>
  <span class="material-icons-outlined filtro-chip__chevron">keyboard_arrow_down</span>
</button>
```

Niveis: 01 Departamento, 02 Secao, 03 Grupo, 04 Sub-grupo

---

## Filtros padrao do Gerenciador

### Row 1
| Filtro | Tipo | Busca | Paste | Select All | Grupos |
|---|---|---|---|---|---|
| Produtos | AsyncCheckPill | sim | sim | nao | nao |
| Familia | AsyncCheckPill | sim | sim | nao | nao |
| Lojas | CheckPill | sim | nao | sim | nao |
| Clusters | CheckPill | sim | nao | nao | nao |
| Tipo loja | CheckPill | sim | nao | nao | nao |
| Status de preco | CheckPill | nao | nao | nao | sim (Regular, Oferta) |
| Segmentacao | CheckPill | nao | nao | nao | sim (Sensibilidade, Curva ABC) |
| Marca | CheckPill | sim | nao | nao | nao (vazio) |
| Fornecedor | CheckPill | sim | nao | nao | nao (vazio) |

### Row 2
| Filtro | Tipo | Busca |
|---|---|---|
| 01 Departamento | CheckPill | sim |
| 02 Secao | CheckPill | sim |
| 03 Grupo | CheckPill | sim |
| 04 Sub-grupo | CheckPill | sim |

---

## Estados visuais dos filtros

| Estado | Background | Texto | Border |
|---|---|---|---|
| Default | `--color-gray-100` | `--color-gray-700` | nenhum |
| Has value | `--color-blue-light-5` | `--color-blue-400` | nenhum |
| Error | `#fef7f7` | `--color-red-600` | nenhum |
| Disabled | `--color-gray-100` | `--color-gray-500` | nenhum |
| Open | `--color-gray-100` | `--color-gray-900` | nenhum |
