# Tokens de Design — Producao vs Prototipo

Mapeamento entre os tokens do repo `app.infoprice.co` (SCSS/CSS) e o `tokens.css` dos prototipos.

**Fonte producao:** `src/style/abstracts/variables.scss`, `src/style/tokens.scss`, `src/style/typography.scss`

---

## Cores

| Token Producao (CSS var) | Token Prototipo (tokens.css) | Valor |
|---|---|---|
| `--white` | `--color-white` | #ffffff |
| `--black` | `--color-black` | #000000 |
| `--gray-100` | `--color-gray-100` | #f5f5f5 |
| `--gray-200` | `--color-gray-200` | #f4f4f4 |
| `--gray-300` | `--color-gray-300` | #eaeaea |
| `--gray-400` | `--color-gray-400` | #d3d3d3 |
| `--gray-500` | `--color-gray-500` | #bcbcbc |
| `--gray-600` | `--color-gray-600` | #959595 |
| `--gray-700` | `--color-gray-700` | #747474 |
| `--gray-800` | `--color-gray-800` | #505050 |
| `--gray-900` | `--color-gray-900` | #323232 |
| `--blue-400` | `--color-blue-400` | #378ef0 |
| `--blue-500` | `--color-blue-500` | #2680eb |
| `--blue-600` | `--color-blue-600` | #1473e6 |
| `--blue-700` | `--color-blue-700` | #0d66d0 |
| `--light-blue-5` | `--color-blue-light-5` | #f5f9fe |
| `--light-blue-45` | `--color-blue-light-45` | #a5ccf8 |
| `--green-400` | `--color-green-400` | #33ab84 |
| `--green-500` | `--color-green-500` | #2d9d78 |
| `--green-600` | `--color-green-600` | #268e6c |
| `--green-700` | `--color-green-700` | #12805c |
| `--red-400` | `--color-red-400` | #ec5b62 |
| `--red-500` | `--color-red-500` | #e34850 |
| `--red-600` | `--color-red-600` | #d7373f |
| `--red-700` | `--color-red-700` | #c9252d |
| `--orange-400` | `--color-orange-400` | #f29423 |
| `--orange-500` | `--color-orange-500` | #e68619 |
| `--orange-600` | `--color-orange-600` | #da7b11 |
| `--orange-700` | `--color-orange-700` | #cb6f10 |
| `--purple-400` | `--color-purple-400` | #9256d9 |
| `--purple-500` | `--color-purple-500` | #864ccc |
| `--purple-600` | `--color-purple-600` | #7a42bf |
| `--purple-700` | `--color-purple-700` | #6f38b1 |

---

## Tipografia

| Classe Producao | Equivalente Prototipo | Specs |
|---|---|---|
| `.font-size-400-semibold` | 20px semibold | 20px / 26px line-height / 600 |
| `.font-size-200-semibold` | 16px semibold | 16px / 20px line-height / 600 |
| `.font-size-100-semibold` | 14px semibold | 14px / 20px line-height / 600 |
| `.font-size-100-regular` | 14px regular | 14px / 20px line-height / 400 |
| `.font-size-100-bold` | 14px bold | 14px / 20px line-height / 700 |
| `.font-size-75-semibold` | 12px semibold | 12px / 18px line-height / 600 |
| `.font-size-75-regular` | 12px regular | 12px / 18px line-height / 400 |
| `.font-size-75-bold` | 10px bold uppercase | 12px / 18px line-height / 700 / uppercase |
| `.font-size-50-semibold` | 10px semibold | 10px / 14px line-height / 600 |
| `.font-size-50-regular` | 10px regular | 10px / 14px line-height / 400 |
| `.font-size-50-bold` | 10px bold uppercase | 10px / 12px line-height / 700 / uppercase |

**Font family:** `'Open Sans', 'Roboto', sans-serif`

**Font sizes (SCSS vars):** $font-size-8 (8px) a $font-size-24 (24px)

---

## Layout

| Token | Valor Producao | Valor Prototipo |
|---|---|---|
| `--header-height` | 57px | 52px |
| `--side-nav-width` | 56px | 52px |
| `--row-height` | 64px | ~62px |
| `--base-transition` | ease 250ms | ease 300ms |

**Breakpoints (SCSS):**
- `$breakpoints-xs`: 320px
- `$breakpoints-sm`: 576px
- `$breakpoints-md`: 768px
- `$breakpoints-lg`: 992px
- `$breakpoints-xl`: 1200px

---

## Sombras

| Nome | Valor | Uso |
|---|---|---|
| Shadow dropdown | `0px 3px 6px -4px rgba(0,0,0,0.12), 0px 6px 16px rgba(0,0,0,0.08), 0px 9px 28px 8px rgba(0,0,0,0.05)` | Dropdowns, menus, popovers |
| Shadow card | `0px 4px 4px rgba(0,0,0,0.12), 0px 0px 10px rgba(0,0,0,0.06)` | Modais, cards elevados |
| Shadow sidebar | `0 9px 28px 8px rgba(0,0,0,0.05), 0 6px 16px rgba(0,0,0,0.08), 0 3px 6px -4px rgba(0,0,0,0.12)` | Sidebar expandido |

---

## Border Radius (valores comuns)

| Valor | Uso |
|---|---|
| 4px | Botoes, inputs, chips |
| 6px | Cards, dropdowns, modais |
| 14px | Badges |
| 99999px / pill | Tags, badges arredondados |
| 50% | Elementos circulares |
