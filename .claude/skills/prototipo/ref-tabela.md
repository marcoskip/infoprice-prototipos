# Tabela / Grid — Producao vs Prototipo

Mapeamento do sistema de tabela do `app.infoprice.co` para classes HTML/CSS dos prototipos.

**Fonte producao:** `src/components/InfoTable/`, `src/components/TableHeading/`, `src/components/CustomHeaderCell/`, `src/pages/IPA/RevisaoPrecos/TableGerenciador.tsx`

---

## Componentes de Tabela

| React | Prototipo | Descricao |
|---|---|---|
| `InfoTable` (RSuite Table) | `.grid > .grid__wrapper > .grid__table` | Tabela principal |
| `InfoTable.Column` | `<col>` no `<colgroup>` | Definicao de largura |
| `InfoTable.HeaderCell` | `<th> .grid__th-content` | Cabecalho com sort/pref |
| `InfoTable.Cell` | `<td>` com `.grid__cell` | Celula de dados |
| `InfoTable.Pagination` | `.grid__pagination` | Barra de paginacao |
| `TableHeading` | `.cabecalho` | Toolbar acima da tabela |
| `CustomHeaderCell` | `.grid__pref-btn` + `.grid__pref-dropdown` | Header com popover |

### Props do InfoTable

| Prop | Valor Producao | Equivalente Prototipo |
|---|---|---|
| `headerHeight` | 46px | Height do `<th>` |
| `rowHeight` | 62px | Height do `<tr>` |
| `autoHeight` | true | Grid preenche espaco restante |
| `minHeight` | 600px | — |

---

## Colunas do Gerenciador de Precos

| # | Coluna | Largura Prod. | Largura Proto. | Cell | Conteudo |
|---|---|---|---|---|---|
| 1 | Checkbox | 60px | 40px | `<input type="checkbox">` | Selecao de linha |
| 2 | Produto | flexGrow=2, min 140px | `<col>` flex | ProductCell | cod + familia + nome + chips |
| 3 | Loja/Cluster | 100px | 70-80px | StoreCell | Texto ou cluster + chip lojas |
| 4 | Estoque | 120px | 108px | StockCell | Icone unidades.svg + valor + dias + data |
| 5 | PMZ e Custos | 88px | 90px | PMZCell | Valor formatado BRL |
| 6 | Margem Objetiva | 78px | 80px | MarginObjCell | Icone margem + percentual |
| 7 | Embalagem | 64px | 50px | PackagingCell | Numero + "un" |
| 8 | PMC | 124px | 110px | PMCCell | Valor + chip % + data (condicional) |
| 9 | Preco Vigente | 124px | 120px | PrecoVigenteCell | Valor + margem + CPI indicators |
| 10 | Preco Concorrente | 127px | 104px | CompetitorCell | Valor + media + link "Abrir" |
| 11 | Preco Sugerido | 132px | 108px | PrecoSugeridoCell | CurrencyInput editavel + variacao + status |
| 12 | CPI | 116px | 108px | CpiCell | CurrencyInput editavel + variacao |
| 13 | Margem | 116px | 108px | MargemCell | CurrencyInput editavel + variacao |
| 14 | Previsao | 140px | 100px | ForecastCell | Botao "Calcular" ou valor |
| 15 | Menu | 26px | 50px | ExpandCell | Botoes expand (atacado/oferta) |

---

## Header cells

### Sort button (todas as colunas sortable)

```html
<th>
  <div class="grid__th-content">
    <span>Nome da Coluna</span>
    <button class="grid__sort-btn" data-sort="double">
      <img src="assets/grid/double.svg" alt="" />
    </button>
  </div>
</th>
```

Ciclo: double → down → up → double

### Preference button (colunas com opcoes de ordenacao)

```html
<button class="grid__pref-btn" data-pref="produto">
  <img src="assets/grid/preferences.svg" alt="" />
</button>
<div class="grid__pref-dropdown" id="pref-produto">
  <div class="grid__pref-dropdown__title">Ordenar por</div>
  <label class="grid__pref-dropdown__item">
    <input type="radio" name="pref-produto" value="codigo" /> Codigo do produto
  </label>
</div>
```

Colunas com preference: Produto, Preco sugerido, CPI, Margem

---

## Paginacao

```html
<div class="grid__pagination">
  <div class="grid__pagination-left">
    <span class="grid__pagination-val">20</span>
    <span class="material-icons-outlined">expand_less</span>
    <span class="grid__pagination-label">/ pagina</span>
    <span class="grid__pagination-sep"></span>
    <span class="grid__pagination-label">total: 20</span>
  </div>
  <div class="grid__pagination-right">
    <div class="grid__pagination-nav">
      <span class="material-icons-outlined">first_page</span>
      <span class="material-icons-outlined">chevron_left</span>
    </div>
    <div id="gridPaginationPages">
      <button class="grid__pagination-btn is-active">1</button>
      <button class="grid__pagination-btn">2</button>
    </div>
    <div class="grid__pagination-nav">
      <span class="material-icons-outlined">chevron_right</span>
      <span class="material-icons-outlined">last_page</span>
    </div>
  </div>
</div>
```

---

## Expanded Rows (producao)

Na producao, linhas podem ser expandidas para mostrar:
- **WHOLESALE** — precos de atacado
- **OFFER** — precos de oferta
- **COMPETITORS** — precos de concorrentes detalhados

No prototipo, usar botoes no menu column (col 15) para indicar essas opcoes.

---

## Regras do Grid (prototipo)

- Header: background `--color-gray-100`, texto 10px bold uppercase `--color-gray-700`
- NUNCA border-bottom ou border-top entre linhas (unica borda: `grid__wrapper` ao redor e `th` border-bottom)
- Checkbox: SEMPRE a 16px da margem esquerda (padding-left da primeira celula)
- Inputs numericos: 116px de largura, colunas min 128px no colgroup
- `table-layout: fixed` com `<colgroup>` para larguras
- `.grid { overflow: visible }` + `.grid__wrapper { overflow-y: auto }` para largura consistente
