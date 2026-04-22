# Inputs de Preco — Producao vs Prototipo

Mapeamento dos componentes de input do `app.infoprice.co` para classes HTML/CSS dos prototipos.

**Fonte producao:** `src/components/CurrencyInput/`, `src/components/CustomNumberInput/`, `src/components/InputCurrency/`, `src/components/InfoInput/`

---

## CurrencyInput (principal)

**React:** `<CurrencyInput value={5.99} precision={2} skin="gray" />`
**Prototipo:** `.grid__form-field` + `.grid__form-input`

### Props

| Prop | Tipo | Default | Descricao |
|---|---|---|---|
| `value` | number | 0 | Valor numerico |
| `precision` | number | 0 | Casas decimais |
| `thousandSeparator` | string | `.` | Separador de milhares |
| `decimalSeparator` | string | `,` | Separador decimal |
| `allowNegative` | boolean | true | Permite negativos |
| `selectOnFocus` | boolean | — | Seleciona texto ao focar |
| `skin` | string | `gray` | Skin visual (gray/blue/red) |

### HTML no prototipo

**Com prefixo R$:**
```html
<div class="grid__form-field grid__form-field--blue">
  <span class="grid__form-prefix">R$</span>
  <input type="text" class="grid__form-input" value="5,99" />
</div>
```

**Com sufixo %:**
```html
<div class="grid__form-field">
  <input type="text" class="grid__form-input" value="25,3" />
  <span class="grid__form-suffix grid__form-suffix--gray">%</span>
</div>
```

---

## CustomNumberInput

**React:** `<CustomNumberInput value="10,5" allowNegative={false} />`
**Prototipo:** Mesmo HTML do CurrencyInput, 1 casa decimal

---

## InputCurrency (legacy)

**React:** `<InputCurrency value={5.99} skin="gray" />`
Wrapper antigo, mesmo visual que CurrencyInput.

---

## InfoInput (compound, formularios)

**React:** Sistema de subcomponentes para formularios completos
**Prototipo:** Usar HTML forms nativo quando necessario

Subcomponentes:
- `InputBox.Label` → `<label>`
- `InputBox.Input` → `<input>`
- `InputBox.Select` → `<select>` ou dropdown customizado
- `InputBox.Numeric` → CurrencyInput com prefix/suffix
- `InputBox.Error` → `<span>` com mensagem de erro
- `InputBox.Addon` → `.grid__form-prefix` / `.grid__form-suffix`
- `InputBox.Toggle` → toggle switch
- `InputBox.Radio` → radio buttons

---

## Skins visuais

| Skin | Border | Background | Uso |
|---|---|---|---|
| `gray` (default) | `--color-gray-300` | `--color-white` | Estado normal |
| `blue` (editado) | `--color-blue-400` | `--color-blue-light-5` | Valor foi alterado pelo usuario |
| `red` (erro/limite) | `--color-red-400` | `#fef7f7` | Limite quebrado ou erro |

### CSS no prototipo

```css
/* Default */
.grid__form-field { border: 1px solid var(--color-gray-300); }

/* Editado */
.grid__form-field--blue { border-color: var(--color-blue-400); background: var(--color-blue-light-5); }

/* Erro */
.grid__form-field--red { border-color: var(--color-red-400); background: #fef7f7; }

/* Focus */
.grid__form-input:focus { border-color: var(--color-blue-400); box-shadow: var(--shadow-focus); }
```

---

## Interacoes

| Evento | Comportamento |
|---|---|
| **Enter** | Move foco para o mesmo campo na proxima linha |
| **Focus** | Seleciona todo o texto do input |
| **Blur** | Salva valor + recalcula margem/CPI |
| **Valor alterado** | Muda skin de gray para blue + status de "auto" para "editado" |

---

## Regra de largura (prototipo)

- Todos os inputs numericos na mesma linha: **116px** de largura
- Colunas do `<colgroup>` com inputs: minimo **128px** (116 + 6px padding cada lado)
- Classe: `.grid__form-field { width: 116px; }`
