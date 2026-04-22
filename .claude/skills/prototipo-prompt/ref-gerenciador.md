# Estrutura do Gerenciador de Precos — Producao

Mapeamento completo da pagina principal do IPA conforme implementada em `app.infoprice.co`.

**Fonte producao:** `src/pages/IPA/RevisaoPrecos/`

---

## Hierarquia de Componentes

```
RevisaoPrecos (index.tsx)
├── Section 1 (fixed)
│   ├── GerenciadorHeader              → .title-bar
│   │   ├── Titulo                     → .title-bar__heading ("Gerenciador de precos")
│   │   ├── Data integracao            → .title-bar__badge ("Atualizado em DD/MM/YYYY, HH:MM")
│   │   ├── FixedLayoutToggle          → .title-btn--fixar (toggle layout fixo/scroll)
│   │   ├── Group By (Loja/Cluster)    → .title-btn + .title-dropdown (icone store)
│   │   └── Price By (Produto/Familia) → .title-btn + .title-dropdown (icone tree)
│   │
│   ├── BigNumbersArea                 → .big-numbers
│   │   ├── Total precos               → .bn-card--blue (X de Y do total)
│   │   ├── Novos custos               → .bn-card--blue (X de Y novos custos)
│   │   ├── Precos sugeridos           → .bn-card--blue (X de Y sugeridos)
│   │   ├── Precos aplicados           → .bn-card--blue (X de Y aplicados)
│   │   ├── Competitividade projetada  → .bn-card--blue-auto (% com indicator)
│   │   ├── Margem projetada           → .bn-card--blue-auto (% com indicator)
│   │   └── Estimativa de lucro        → .bn-card--green (R$ com indicator)
│   │
│   ├── NewFilterBox                   → .filtros
│   │   ├── Row 1: Produtos, Familia, Lojas, Clusters, Tipo loja,
│   │   │         Status preco, Segmentacao, Marca, Fornecedor
│   │   ├── Row 2: 01 Departamento, 02 Secao, 03 Grupo, 04 Sub-grupo
│   │   └── Actions: + Filtros, Limpar filtros, Filtros salvos
│   │
│   └── GerenciadorTableHeading        → .cabecalho
│       ├── Total resultados           → .cabecalho__info
│       ├── Quick Action Filters       → .composed-btn (6 tipos + derivados)
│       └── Aplicar preco              → .aplicar-btn
│
├── Section 2 (scrollable)
│   ├── TableGerenciador               → .grid
│   │   ├── 15 colunas (ver ref-tabela.md)
│   │   ├── Rows editaveis (preco sugerido, CPI, margem)
│   │   └── Expanded rows (atacado, oferta, concorrentes)
│   └── Pagination                     → .grid__pagination
│
└── Modals (portals)                   → ver ref-modais.md
```

---

## Quick Action Filters (Cabecalho)

Filtros rapidos na toolbar, equivalentes aos `composed-btn` no prototipo:

| # | Filtro Producao | Classe Prototipo | Funcao | Dropdown |
|---|---|---|---|---|
| 1 | Filtros toggle | `.composed-btn--solo` | Mostra/esconde filtros | Nao |
| 2 | NewCostsFilter | `.composed-btn` | Custos alterados nos ultimos X dias | Sim (input dias) |
| 3 | CpiDaysFilter | `.composed-btn` | Precos concorrentes dos ultimos X dias | Sim (input dias + checkboxes origem) |
| 4 | PriceVariationFilter | `.composed-btn` | Variacao de preco >= X% | Sim (input % + radios aumento/reducao) |
| 5 | CompetitivenessFilter | `.composed-btn` | Competitividade >= X% | Sim (input % + radios sugerido/vigente) |
| 6 | MarginFilter | `.composed-btn` | Margem >= X% | Sim (input % + radios sugerido/vigente) |
| 7 | Limits dropdown | `.composed-btn` | Limites quebrados/nao | Sim (radios) |
| 8 | Derivados toggle | `.composed-btn--solo` | Produtos derivados | Nao |
| 9 | Aplicar preco | `.aplicar-btn` | Botao principal | Sim (radios sugerido/vigente) |

---

## Estados de Exibicao

| Estado (Redux) | Opcoes | Efeito |
|---|---|---|
| `datapointExhibitionType` | PRODUCT, FAMILY, PRODUCT_CLUSTER, PRODUCT_CLUSTER_FAMILY | Muda colunas e agrupamento |
| `isLayoutFixed` | true/false | Alterna layout fixo (position fixed) e scroll |
| `filtersIsVisible` | true/false | Mostra/esconde filtros (recalcula tops) |
| `expandedRowKey` | HEADER, WHOLESALE, OFFER, COMPETITORS | Quais linhas expandidas |

### Comportamento no prototipo

- **PRODUCT** (padrao): coluna Loja mostra numero da loja
- **PRODUCT_CLUSTER**: coluna Loja mostra nome do cluster + chip "X LOJAS"
- **FAMILY**: agrupamento por familia, sem coluna de loja individual
- **isLayoutFixed**: no prototipo sempre usamos layout fixo
- **filtersIsVisible**: toggle via btnFiltrosToggle, recalcula `top` de cabecalho e grid

---

## Sort Keys

| Key | Variantes (pref dropdown) | Direcao |
|---|---|---|
| `productId` | productDescription, productFamilyId | ASC / DESC |
| `price` | priceRange | ASC / DESC |
| `cpi` | cpiRange | ASC / DESC |
| `newMargin` | newMarginRange | ASC / DESC |

No prototipo: sort buttons com ciclo `double → down → up → double` e pref dropdowns com radios.

---

## Fluxo de dados (producao)

1. **Carga inicial**: API busca datapoints com filtros default → Redux store
2. **Filtro**: usuario altera filtros → nova request → atualiza store + big numbers
3. **Edicao inline**: usuario edita preco/CPI/margem → blur → API salva → recalcula campos dependentes
4. **Aplicar preco**: usuario seleciona linhas → click "Aplicar preco" → API batch update
5. **Big numbers**: recalculados quando `shouldUpdateBigNumbers` = true (apos edicoes)

No prototipo: dados ficticios gerados via JS, edicoes sao visuais (mudam status de "auto" para "editado").

---

## Dependencias externas → Prototipo

| Biblioteca Producao | Equivalente Prototipo |
|---|---|
| RSuite (Table, Modal, Picker) | HTML/CSS nativo |
| Material UI Icons | Google Material Icons Outlined |
| FontAwesome | Nao utilizado |
| React Icons (Md*) | Material Icons Outlined |
| Highcharts | Nao aplicavel |
| TanStack Table | JavaScript vanilla |
| React Hook Form | HTML forms nativo |
| Radix UI (context menu) | HTML/CSS nativo |
| Redux + React Query | JavaScript vanilla (estado local) |
