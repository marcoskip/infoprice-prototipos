# Data Display — Producao vs Prototipo

Mapeamento dos componentes de exibicao de dados do `app.infoprice.co`.

**Fonte producao:** `src/components/BigNumbersBox/`, `src/components/PercentageIndicator/`, `src/components/CostIndicator/`, `src/components/TableBadge/`, `src/components/Chip/`, `src/components/Tag/`

---

## BigNumbersBox (KPI cards)

**React:** Compound component com Root, MainValue, RegularText, BoldText, Indicator
**Prototipo:** `.bn-card` com variantes

### Tipos de card

| Tipo React | Classe Prototipo | Uso |
|---|---|---|
| `type="container"` | `.bn-card--blue` | Card azul fixo (140px) — contadores simples |
| `type="up"` / `type="down"` | `.bn-card--blue-auto` | Card azul auto — com indicator de variacao |
| (verde) | `.bn-card--green` | Card verde — estimativa de lucro |

### HTML do card

```html
<div class="bn-card bn-card--blue-auto">
  <div class="bn-card__body">
    <div class="bn-card__top">
      <span class="bn-card__number">101,3%</span>
      <div class="bn-card__variation bn-card__variation--down">
        <span class="material-icons-outlined">arrow_downward</span>
        <span class="bn-card__variation-val">0,4 %</span>
      </div>
    </div>
    <span class="bn-card__desc">Competitividade projetada,<br>era <b>102,3 %</b></span>
  </div>
</div>
```

### KPIs do Gerenciador (producao)

| # | Metrica | Tipo | Dado |
|---|---|---|---|
| 1 | Total de precos | blue (fixo) | X de Y do total |
| 2 | Novos custos | blue (fixo) | X de Y novos custos |
| 3 | Precos sugeridos | blue (fixo) | X de Y sugeridos |
| 4 | Precos aplicados | blue (fixo) | X de Y aplicados |
| 5 | Competitividade | blue-auto | % com indicator up/down |
| 6 | Margem | blue-auto | % com indicator up/down |
| 7 | Estimativa lucro | green | R$ com indicator up/down |

---

## PercentageIndicator (variacao)

**React:** `<PercentageIndicator value={2.5} suffix="%" />`
**Prototipo:** `.grid__var`

| Valor | Classe | Cor |
|---|---|---|
| Positivo | `.grid__var--up` | `--color-green-400` |
| Negativo | `.grid__var--down` | `--color-red-400` |
| Zero/neutro | `.grid__var--neutral` | `--color-gray-600` |

```html
<span class="grid__var grid__var--up">+ 2,5%</span>
<span class="grid__var grid__var--down">- 1,3%</span>
```

---

## CostIndicator (qualidade 5 niveis)

**React:** `<CostIndicator variant="GOOD" />`
**Prototipo:** `.indicador`

| Variante | Classe | Background | Border | Texto |
|---|---|---|---|---|
| VERY_GOOD | `.indicador--muito-bom` | `--color-green-light-20` | `--color-green-light-45` | `--color-green-400` |
| GOOD | `.indicador--bom` | `--color-green-light-5` | `--color-green-light-20` | `--color-green-400` |
| REGULAR | `.indicador--regular` | `--color-orange-light-5` | `--color-orange-light-15` | `--color-orange-400` |
| BAD | `.indicador--ruim` | `--color-red-light-5` | `--color-red-light-20` | `--color-red-600` |
| VERY_BAD | `.indicador--muito-ruim` | `--color-red-light-20` | `--color-red-light-45` | `--color-red-600` |

```html
<div class="indicador indicador--muito-bom">
  <div class="indicador__inner">MUITO<br>BOM</div>
</div>
```

Specs: 84px width, 64px height, inner 48px height, border-radius 6px, 12px semibold uppercase

---

## TableBadge (status)

**React:** `<TableBadge skin="neutral">auto</TableBadge>`
**Prototipo:** `.grid__badge-pill`

| Skin | Classe Prototipo | Uso |
|---|---|---|
| `neutral` | `.grid__badge-pill--auto` | Status "auto" (blue) |
| `light-blue` | `.grid__badge-pill--editado` | Status "editado" (orange) |
| `blue` | `.grid__badge-pill--salvo` | Status "salvo" (green) |

---

## Chip

**React:** `<Chip filled active leftIcon={icon}>Texto</Chip>`
**Prototipo:** `.grid__chip`

| Variante | Classe | Uso |
|---|---|---|
| Vermelho | `.grid__chip--red` | "super sensivel" |
| Cinza | `.grid__chip--gray` | GLOBAL A/B, LOCAL A/B, RELEVANCIA |

---

## Tag

**React:** `<Tag skin="blue" size="xsmall" outlined>Texto</Tag>`
**Prototipo:** `.grid__chip` ou badge customizado

### Skins disponiveis

| Skin | Cor |
|---|---|
| `gray` | `--color-gray-*` |
| `blue` | `--color-blue-*` |
| `green` | `--color-green-*` |
| `red` | `--color-red-*` |
| `orange` | `--color-orange-*` |
| `purple` | `--color-purple-*` |
| `pink` | `#e663c9` |

### Sizes

| Size | Font | Padding |
|---|---|---|
| `large` | 16px | 10px 16px |
| `medium` | 14px | 8px 12px |
| `small` | 12px | 6px 10px |
| `xsmall` | 10px | 4px 8px |
| `xxsmall` | 8px | 2px 4px |

---

## ChangedCostsIndicator

**React:** Icone `MdSwapVerticalCircle` (12px, laranja)
**Prototipo:** `<span class="material-icons-outlined" style="font-size:12px;color:var(--color-orange-400)">swap_vert</span>`

Indica que o custo do produto foi alterado recentemente.
