# Botoes — Producao vs Prototipo

Mapeamento dos componentes de botao do `app.infoprice.co` para classes HTML/CSS dos prototipos.

**Fonte producao:** `src/components/ButtonPrimary/`, `src/components/ButtonSecondary/`, `src/components/LinkButton/`, `src/components/ButtonLeftIcon/`

---

## ButtonPrimary

**React:** `<ButtonPrimary skin="blue" size="medium" theme="filled" />`
**Prototipo:** `.title-btn`, `.aplicar-btn__main`, ou botao customizado com skin

### Props

| Prop | Valores | Default |
|---|---|---|
| `theme` | `filled`, `ghost` | `filled` |
| `size` | `large`, `medium`, `small`, `xsmall` | `medium` |
| `skin` | `gray`, `blue`, `green`, `red`, `orange`, `purple`, `pink` | `blue` |
| `isLoading` | boolean | false |
| `fullWidth` | boolean | false |
| `disabled` | boolean | false |

### Skins → CSS

| Skin | Background | Hover | Texto |
|---|---|---|---|
| `blue` | `--color-blue-400` | `--color-blue-500` | `--color-white` |
| `gray` | `--color-gray-300` | `--color-gray-400` | `--color-gray-700` |
| `green` | `--color-green-400` | `--color-green-500` | `--color-white` |
| `red` | `--color-red-400` | `--color-red-500` | `--color-white` |
| `orange` | `--color-orange-400` | `--color-orange-500` | `--color-white` |
| `purple` | `--color-purple-400` | `--color-purple-500` | `--color-white` |

**REGRA DO PROTOTIPO:** botoes primarios de acao (Aplicar, Salvar, Exportar) SEMPRE usam `blue`, nunca `green`.

### Sizes → CSS

| Size | Padding | Font |
|---|---|---|
| `large` | 10px 16px | 16px / 22px |
| `medium` | 8px 12px | 14px / 20px |
| `small` | 6px 10px | 12px / 28px |
| `xsmall` | 4px 8px | 10px / 16px |

### Theme ghost

Background transparente, border 1px solid na cor do skin, texto na cor do skin.

---

## ButtonSecondary

**React:** `<ButtonSecondary theme="gray" size="md" />`
**Prototipo:** `.composed-btn__base`

### Props

| Prop | Valores | Default |
|---|---|---|
| `theme` | `blue`, `red`, `gray` | `gray` |
| `size` | `lg`, `md`, `sm`, `xs` | `md` |

---

## SecondaryButton

**React:** `<SecondaryButton skin="blue" icon={<Icon />} />`
**Prototipo:** Botao com icone inline

### Props

| Prop | Valores | Default |
|---|---|---|
| `skin` | `blue`, `red`, `gray` | `gray` |
| `icon` | ReactNode | — |

---

## ButtonLeftIcon

**React:** `<ButtonLeftIcon text="Cluster" icon={<SvgIcon />} />`
**Prototipo:** `.title-btn` com `<svg class="title-btn__icon">`

Todos os botoes da title bar DEVEM ter icone SVG inline (ver componentes.md, secao Title Bar).

---

## LinkButton

**React:** `<LinkButton>Texto</LinkButton>`
**Prototipo:** `.title-bar__action-link`, `.title-bar__link`

Links de acao usam Material Icons Outlined a 14px antes do texto.

---

## Aplicar Preco (botao composto)

**React:** `AppyPricesButton` (botao split com dropdown)
**Prototipo:** `.aplicar-btn` com `.aplicar-btn__main` + `.aplicar-btn__drop`

```html
<div class="aplicar-btn">
  <button class="aplicar-btn__main">Aplicar preco</button>
  <button class="aplicar-btn__drop">
    <span class="material-icons-outlined">keyboard_arrow_down</span>
  </button>
  <div class="composed-dropdown composed-dropdown--right">
    <!-- opcoes -->
  </div>
</div>
```
