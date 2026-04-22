# Navegacao — Producao vs Prototipo

Mapeamento dos componentes de navegacao do `app.infoprice.co`.

**Fonte producao:** `src/components/NavBar/`, `src/components/Layout/`, `src/components/PageLayout/`

---

## Header (NavBar)

**React:** `<NavBar />` com subcomponentes
**Prototipo:** `.header`

| Elemento | Classe Prototipo |
|---|---|
| Container | `.header` (fixed, top 0, height 52px, z-index 50) |
| Esquerda | `.header__left` |
| Menu produtos | `.header__menu-btn` + `.dropdown.product-dropdown` |
| Logo | `.header__brand > .header__logo` |
| Divider | `.header__divider` |
| Produto nome | `.header__product-name` |
| Direita | `.header__right` |
| Ajuda | `.header__help-btn` |
| Usuario | `.header__user` + `.dropdown.user-dropdown` |

### Dropdown de produtos

```html
<div class="dropdown product-dropdown" id="productDropdown" role="menu">
  <div class="product-dropdown__header">
    <span class="product-dropdown__title">Produtos</span>
  </div>
  <div class="product-dropdown__list">
    <div class="product-dropdown__item" role="menuitem">
      <span class="product-tag product-tag--ipa-active">IPA</span>
      <span class="product-dropdown__item-name">Software de precificacao</span>
    </div>
    <!-- item disabled -->
    <div class="product-dropdown__item product-dropdown__item--disabled" aria-disabled="true">
      <span class="product-tag product-tag--disabled">IPA</span>
      <span class="product-dropdown__item-name">Simulador de demanda <span class="material-icons-outlined">lock</span></span>
    </div>
  </div>
</div>
```

### Dropdown de usuario

```html
<div class="dropdown user-dropdown" id="userDropdown" role="menu">
  <div class="user-dropdown__identity">
    <span class="user-dropdown__name">Nome</span>
    <span class="user-dropdown__email">email@infoprice.co</span>
  </div>
  <div class="dropdown__divider"></div>
  <div class="user-dropdown__group">
    <div class="user-dropdown__item"><span class="material-icons-outlined">settings</span><span>Configuracoes</span></div>
    <div class="user-dropdown__item"><span class="material-icons-outlined">person_add</span><span>Pessoas <span class="user-dropdown__badge">Convidar</span></span></div>
    <div class="user-dropdown__item"><span class="material-icons-outlined">help</span><span>Base de conhecimento</span></div>
  </div>
</div>
```

### Overlay

```html
<div class="dropdown-overlay" id="dropdownOverlay"></div>
```

Ativado quando dropdown do header esta aberto (z-index 49, background rgba(0,0,0,0.18)).

---

## Sidebar

**React:** Sidebar customizado com items de navegacao
**Prototipo:** `.sidebar`

| Elemento | Classe |
|---|---|
| Container | `.sidebar` (fixed, top 52px, left 0, width 52px/220px) |
| Item ativo | `.sidebar__item.sidebar__item--active` |
| Item normal | `.sidebar__item` |
| Icone | `.sidebar__icon` (SVG asset) |
| Label | `.sidebar__label` (visivel quando expandido) |
| Tooltip | `.sidebar__tooltip` (visivel quando colapsado, hover) |
| Seta expand | `.sidebar__seta` (bottom) |

### Modulos do sidebar (sempre os mesmos 5)

| # | Modulo | Icone asset |
|---|---|---|
| 1 | Gerenciador | `assets/gerenciador-symbol.svg` |
| 2 | Estrategia | `assets/estrategia-symbol.svg` |
| 3 | Negociacoes Fornecedor | `assets/negociacoes-symbol.svg` |
| 4 | Extracao de precos | `assets/extracao-symbol.svg` |
| 5 | Precifique com IA | `assets/IA-symbol.svg` |

### Toggle

- Colapsado: width 52px, so icones + tooltips no hover
- Expandido: width 220px, icones + labels
- Transicao: `width 300ms ease`
- Ao expandir: atualiza `left` de todas as secoes (52px → 220px)

---

## Title Bar

**React:** `GerenciadorHeader`
**Prototipo:** `.title-bar`

| Elemento | Classe |
|---|---|
| Container | `.title-bar` (fixed, top 52px, left 52px, right 0) |
| Esquerda | `.title-bar__left` |
| Titulo | `.title-bar__heading` |
| Badge data | `.title-bar__badge` |
| Direita | `.title-bar__right` |
| Botoes | `.title-btn` com SVG `title-btn__icon` |
| Dropdowns | `.title-dropdown` |
| Links de acao | `.title-bar__action-link` com Material Icon |

---

## Cabecalho (Table Heading)

**React:** `GerenciadorTableHeading` + `GerenciadorQuickActionFilters`
**Prototipo:** `.cabecalho`

| Elemento | Classe |
|---|---|
| Container | `.cabecalho` (fixed, ajusta com filtros) |
| Info texto | `.cabecalho__info` |
| Botoes area | `.cabecalho__buttons` |
| Botao composto | `.composed-btn` |
| Botao solo | `.composed-btn--solo` |
| Dropdown composto | `.composed-dropdown` |
| Aplicar preco | `.aplicar-btn` |

---

## Layout (paginas)

**React:** `<Layout.Header>`, `<Layout.Body>`, `<Layout.Section>`
**Prototipo:** Secoes com `position: fixed` + coordenadas absolutas

No prototipo, NAO usamos um sistema de layout flexivel — cada secao tem posicao fixa calculada. Ver arquitetura.md para coordenadas.
