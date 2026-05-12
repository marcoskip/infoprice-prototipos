# Tipografia

Escala de estilos de texto do InfoPrice. Fonte canonica: Figma › Design System › Text styles (node `2950-18673`).

## Nomenclatura

`.text-{tamanho-figma}-{peso}[-upper]`

- **Tamanho** segue o nome interno do Figma (25, 50, 75, 100, 200, 400, 600), nao o alias (xs, sm, md...).
- **Peso**: `light`, `regular`, `semibold`, `bold`.
- **`-upper`**: variante com `text-transform: uppercase` (eyebrow, badges, labels superiores).

## Tabela completa

| Classe                       | Tamanho | Line-height | Peso     | Uso tipico                                              |
| ---------------------------- | ------- | ----------- | -------- | ------------------------------------------------------- |
| `.text-600-light`            | 24px    | 32px        | 300      | Titulo principal de pagina (H1 de cartao)               |
| `.text-400-semibold`         | 20px    | 26px        | 600      | Titulo de secao / card grande                           |
| `.text-400-light`            | 20px    | 26px        | 300      | Numero KPI (big-number)                                 |
| `.text-200-semibold`         | 16px    | 20px        | 600      | Subtitulo de card / titulo de bloco interno             |
| `.text-100-bold`             | 14px    | 20px        | 700      | Destaque inline em corpo de texto                       |
| `.text-100-bold-upper`       | 14px    | 20px        | 700      | Eyebrow grande (raro)                                   |
| `.text-100-semibold`         | 14px    | 20px        | 600      | Label de campo / opcao selecionada de radio             |
| `.text-100-regular`          | 14px    | 20px        | 400      | Corpo de texto padrao / label nao selecionada           |
| `.text-75-bold-upper`        | 12px    | 18px        | 700      | Eyebrow forte                                           |
| `.text-75-semibold-upper`    | 12px    | 18px        | 600      | Eyebrow padrao (titulo de coluna na grid, secao do menu)|
| `.text-75-regular-upper`     | 12px    | 18px        | 400      | Eyebrow secundaria                                      |
| `.text-75-bold`              | 12px    | 16px        | 700      | Destaque em texto auxiliar                              |
| `.text-75-semibold`          | 12px    | 16px        | 600      | Label menor de campo                                    |
| `.text-75-regular`           | 12px    | 16px        | 400      | Helper text / texto auxiliar (radio helper, etc)        |
| `.text-50-bold-upper`        | 10px    | 12px        | 700      | Tag / badge forte                                       |
| `.text-50-semibold-upper`    | 10px    | 12px        | 600      | Tag / badge padrao                                      |
| `.text-50-regular-upper`     | 10px    | 12px        | 400      | Tag / badge leve                                        |
| `.text-50-semibold`          | 10px    | 14px        | 600      | Microtexto destacado                                    |
| `.text-50-regular`           | 10px    | 14px        | 400      | Microtexto (caption)                                    |
| `.text-25-semibold-upper`    | 8px     | 10px        | 600      | Microtag (uso muito raro)                               |
| `.text-25-regular`           | 8px     | 10px        | 400      | Microtexto extremo (uso raro)                           |

## Regras de uso

1. **Use as utility classes em vez de hardcode**: nunca escreva `font-size: 14px` na pagina; aplique `.text-100-regular`.
2. **Combine com BEM**: a utility class pode coexistir com classes BEM do componente (ex: `<span class="config-card__title text-200-semibold">`).
3. **NAO usar para componentes que ja tem tipografia propria**: botoes, inputs e tags ja tem regras de fonte embutidas; nao sobrescreva com utility classes.
4. **Eyebrow vs Titulo**: eyebrow (texto pequeno acima do titulo) usa variante `-upper`. Titulo de secao usa `.text-200-semibold` ou `.text-400-semibold`.
5. **Radio/Checkbox label**: label nao-selecionada = `.text-100-regular`, label selecionada = `.text-100-semibold` (controlado pelo CSS do proprio radio).
6. **Helper text**: `.text-75-regular` (12px / 16px / regular) com cor `--color-gray-600`.

## Exemplos

```html
<!-- Titulo de pagina (H1 de cartao) -->
<h1 class="text-600-light">Configuracoes globais</h1>

<!-- Eyebrow + titulo de secao -->
<div class="card-section">
  <span class="text-75-semibold-upper" style="color: var(--color-gray-600)">
    Outliers
  </span>
  <h2 class="text-200-semibold">Tratamento de outliers</h2>
</div>

<!-- Big number -->
<div class="big-number">
  <span class="text-75-regular">Total de produtos</span>
  <span class="text-400-light">12.483</span>
</div>

<!-- Helper de campo -->
<label class="text-100-semibold">Margem minima</label>
<span class="text-75-regular" style="color: var(--color-gray-600)">
  Valor expresso em percentual sobre o preco de custo.
</span>
```

## Notas

- A nomenclatura `text-{N}-{peso}` espelha exatamente o nome do estilo no Figma (`font-size-100-semibold` no Figma → `.text-100-semibold` no codigo). Isso facilita o handoff entre design e dev.
- Para tipografia de botoes, use as classes BEM do componente botoes (`.btn`, `.btn--sm`, etc), que ja aplicam os tokens `--font-size-btn-*`.
- Headings de display (H1=56px, H2=48px, H3=40px) tem tokens proprios em `tokens.css` mas nao tem utility class — sao usados via tag `<h1>`/`<h2>`/`<h3>` semantica com CSS do contexto.
