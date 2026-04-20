# Biblioteca de Componentes — IPA InfoPrice

Referencia completa dos componentes implementados. Use as classes de `styles.css` sempre que possivel. Adicione `<style>` inline apenas para estilos especificos da pagina.

---

## 1. Header

Barra superior fixa, 52px de altura, full width.

### HTML

```html
<div class="dropdown-overlay" id="dropdownOverlay"></div>

<header class="header">

  <div class="header__left">
    <!-- Botao menu (quadrado azul) -->
    <button class="header__menu-btn" id="menuBtn" aria-label="Abrir menu de produtos" aria-expanded="false">
      <span class="material-icons-outlined">apps</span>
    </button>

    <!-- Dropdown de produtos -->
    <div class="dropdown product-dropdown" id="productDropdown" role="menu">
      <div class="product-dropdown__header">
        <span class="product-dropdown__title">Produtos</span>
      </div>
      <div class="product-dropdown__list">
        <div class="product-dropdown__item" role="menuitem" tabindex="0">
          <span class="product-tag product-tag--isa-active">ISA</span>
          <span class="product-dropdown__item-name">InfoPanel</span>
        </div>
        <div class="product-dropdown__item" role="menuitem" tabindex="0">
          <span class="product-tag product-tag--ipa-active">IPA</span>
          <span class="product-dropdown__item-name">Software de precificacao</span>
        </div>
        <!-- Itens desabilitados: adicione product-dropdown__item--disabled e aria-disabled="true" -->
      </div>
    </div>

    <!-- Logo + nome do produto -->
    <div class="header__brand">
      <img class="header__logo" src="https://marcoskip.github.io/infoprice-prototipos/assets/logo-principal.svg" alt="InfoPrice" />
      <div class="header__divider" aria-hidden="true"></div>
      <span class="header__product-name">IPA | Software de Precificacao</span>
    </div>
  </div>

  <div class="header__right">
    <button class="header__help-btn" aria-label="Ajuda">
      <span class="material-icons-outlined">help_outline</span>
    </button>

    <div class="header__user" id="userBtn" role="button" tabindex="0" aria-expanded="false">
      <span class="header__user-name">Ola, Marcus</span>
      <span class="material-icons-outlined">keyboard_arrow_down</span>
    </div>

    <!-- Dropdown de usuario -->
    <div class="dropdown user-dropdown" id="userDropdown" role="menu">
      <div class="user-dropdown__identity">
        <span class="user-dropdown__name">Marcus Roggero</span>
        <span class="user-dropdown__email">marcus@infoprice.co</span>
      </div>
      <div class="dropdown__divider"></div>
      <div class="user-dropdown__group">
        <div class="user-dropdown__item" role="menuitem" tabindex="0">
          <span class="material-icons-outlined">settings</span>
          <span class="user-dropdown__item-label">Configuracoes</span>
        </div>
        <div class="user-dropdown__item" role="menuitem" tabindex="0">
          <span class="material-icons-outlined">person_add</span>
          <span class="user-dropdown__item-label">
            Pessoas
            <span class="user-dropdown__badge">Convidar</span>
          </span>
        </div>
        <div class="user-dropdown__item" role="menuitem" tabindex="0">
          <span class="material-icons-outlined">help</span>
          <span class="user-dropdown__item-label">Base de conhecimento</span>
        </div>
      </div>
      <div class="dropdown__divider"></div>
      <div class="user-dropdown__group">
        <div class="user-dropdown__item user-dropdown__item--text-only" role="menuitem" tabindex="0">
          <span class="user-dropdown__item-label">Termos de uso e servicos</span>
        </div>
      </div>
      <div class="dropdown__divider"></div>
      <div class="user-dropdown__group">
        <div class="user-dropdown__item user-dropdown__item--text-only" role="menuitem" tabindex="0">
          <span class="user-dropdown__item-label">Sair</span>
        </div>
      </div>
    </div>
  </div>

</header>
```

### Specs

- Height: 52px, background: `--color-gray-300`
- Botao menu: 52x52px, background `--color-blue-400`, icone branco
- Logo: height 17px
- Divider: 1x24px, cor `--color-gray-500`
- Nome do produto: 14px semibold, `--color-gray-800`
- Dropdown: width 280px, border-radius 0 0 6px 6px, shadow `0px 2px 8px rgba(0,0,0,0.16)`
- Animacao: opacity + translateY(-6px), 140ms ease

---

## 2. Sidebar

Menu lateral colapsavel fixo a esquerda.

### HTML

```html
<aside class="sidebar" id="sidebar">
  <div class="sidebar__top">

    <div class="sidebar__item sidebar__item--active">
      <img src="https://marcoskip.github.io/infoprice-prototipos/assets/gerenciador-symbol.svg" alt="Gerenciador" class="sidebar__icon" />
      <span class="sidebar__label">Gerenciador</span>
      <span class="sidebar__tooltip">Gerenciador</span>
    </div>

    <div class="sidebar__item">
      <img src="https://marcoskip.github.io/infoprice-prototipos/assets/estrategia-symbol.svg" alt="Estrategia" class="sidebar__icon" />
      <span class="sidebar__label">Estrategia</span>
      <span class="sidebar__tooltip">Estrategia</span>
    </div>

    <div class="sidebar__item">
      <img src="https://marcoskip.github.io/infoprice-prototipos/assets/negociacoes-symbol.svg" alt="Negociacoes" class="sidebar__icon" />
      <span class="sidebar__label">Negociacoes Fornecedor</span>
      <span class="material-icons-outlined sidebar__item-chevron">keyboard_arrow_right</span>
      <span class="sidebar__tooltip">Negociacoes Fornecedor</span>
    </div>

    <div class="sidebar__item">
      <img src="https://marcoskip.github.io/infoprice-prototipos/assets/extracao-symbol.svg" alt="Extracao" class="sidebar__icon" />
      <span class="sidebar__label">Extracao de precos</span>
      <span class="sidebar__tooltip">Extracao de precos</span>
    </div>

    <div class="sidebar__item">
      <img src="https://marcoskip.github.io/infoprice-prototipos/assets/IA-symbol.svg" alt="IA" class="sidebar__icon" />
      <span class="sidebar__label">Precifique com IA</span>
      <span class="sidebar__tooltip">Precifique com IA</span>
    </div>

  </div>

  <div class="sidebar__bottom">
    <button class="sidebar__seta" id="sidebarSeta" aria-label="Expandir menu">
      <span class="material-icons-outlined">keyboard_arrow_right</span>
    </button>
  </div>
</aside>
```

### Specs

- Colapsado: width 52px / Expandido: width 220px
- Transicao: 300ms ease
- Background: `--color-white`, border-right: 1px solid `--color-gray-300`
- Icones: SVG custom hospedados em `https://marcoskip.github.io/infoprice-prototipos/assets/`
- Item ativo: background `--color-gray-100`, border-left 2px `--color-blue-400`
- Tooltips: aparecem apenas no estado colapsado, no hover
- Labels: aparecem apenas no estado expandido
- Botao seta: 55x37px, border-radius 6px, hover background `--color-gray-300`, icone gira 180deg (300ms)

---

## 3. Title Bar

Barra de titulo abaixo do header.

### HTML

```html
<section class="title-bar">
  <div class="title-bar__left">
    <span class="title-bar__heading">Gerenciador de precos</span>
    <span class="title-bar__badge">Atualizado em 01/07/2023, 13:42</span>
  </div>

  <div class="title-bar__right">

    <!-- Fixar (toggle) -->
    <div class="title-btn-wrapper">
      <button class="title-btn title-btn--fixar" id="fixarBtn" aria-pressed="false">
        <svg class="title-btn__icon" width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 0H1.16667C0.845833..." fill="currentColor" />
        </svg>
        <span>Fixar</span>
      </button>
      <span class="tooltip tooltip--below">Alternar a exibicao do layout fixo</span>
    </div>

    <!-- Loja (dropdown) -->
    <div class="title-btn-wrapper">
      <button class="title-btn" id="lojaBtn" aria-expanded="false">
        <svg class="title-btn__icon" ...>...</svg>
        <span>Loja</span>
        <span class="material-icons-outlined title-btn__chevron">keyboard_arrow_down</span>
      </button>
      <span class="tooltip tooltip--above">Agrupar por</span>
      <div class="title-dropdown" id="lojaDropdown" role="menu">
        <div class="title-dropdown__item" role="menuitem">Loja</div>
        <div class="title-dropdown__item" role="menuitem">Cluster de lojas</div>
      </div>
    </div>

    <!-- Produto (dropdown) -->
    <div class="title-btn-wrapper">
      <button class="title-btn" id="produtoBtn" aria-expanded="false">
        <svg class="title-btn__icon" ...>...</svg>
        <span>Produto</span>
        <span class="material-icons-outlined title-btn__chevron">keyboard_arrow_down</span>
      </button>
      <span class="tooltip tooltip--below">Precificar por</span>
      <div class="title-dropdown" id="produtoDropdown" role="menu">
        <div class="title-dropdown__item" role="menuitem">Produto</div>
        <div class="title-dropdown__item" role="menuitem">Familia</div>
      </div>
    </div>

  </div>
</section>
```

### Specs

- Position: fixed, top: 52px, left: 52px, right: 0, height: 36px
- Background: transparente (mostra gray-50 da pagina)
- Padding: 0 16px
- Titulo: 14px semibold, `--color-gray-900`
- Badge: background `--color-green-400`, texto branco, 10px bold uppercase, border-radius pill
- Botoes: background `--color-gray-300`, radius 4px, height 26px, 12px semibold `--color-gray-700`
- Hover: background `--color-gray-400`
- Fixar ativo: cor `--color-blue-500` no icone e texto
- Tooltips: background `--color-gray-900`, radius 6px, texto branco 12px, sem animacao
- Dropdowns: top calc(100% + 2px), border 1px `--color-gray-300`, shadow elevation
- **REGRA: icones obrigatorios nos botoes e links da title bar** — todo botao e link de acao da title bar DEVE ter um icone. NUNCA criar um botao ou link de acao sem icone.

### Mapa de icones dos botoes

| Botao | Icone | Tipo |
|---|---|---|
| Fixar | Pino (pin) | SVG inline (`title-btn__icon`, `fill="currentColor"`) |
| Loja / Cluster | Loja (store) | SVG inline (`title-btn__icon`, `fill="currentColor"`) |
| Produto | Hierarquia (tree) | SVG inline (`title-btn__icon`, `fill="currentColor"`) |

### Mapa de icones dos links de acao

| Link | Icone | Material Icons |
|---|---|---|
| Criar negociacao com arquivo | `upload_file` | Upload de arquivo |
| Abrir negociacoes salvas | `folder_open` | Abrir pasta/salvos |

Para links de acao, usar Material Icons Outlined com `font-size:14px; vertical-align:middle; margin-right:2px`:
```html
<a class="title-bar__action-link" href="#">
  <span class="material-icons-outlined" style="font-size:14px;vertical-align:middle;margin-right:2px">upload_file</span>
  Criar negociacao com arquivo
</a>
```

### Regra de consistencia

- Botoes com funcao de agrupamento por loja/cluster SEMPRE usam o icone de **loja (store)**
- Botoes com funcao de agrupamento por produto/familia SEMPRE usam o icone de **hierarquia (tree)**
- Botoes de toggle (fixar) usam icones especificos da funcao (pino)
- Links de acao usam **Material Icons Outlined** a 14px alinhados ao texto
- Quando um novo botao ou link for criado e nao houver icone mapeado, sugira um icone que represente a funcao seguindo o padrao visual correspondente (SVG para botoes, Material Icons para links)

---

## 4. Big Numbers

Faixa de KPI cards.

### HTML

```html
<section class="big-numbers">
  <div class="big-numbers__inner">
    <div class="big-numbers__cards">

      <!-- Card azul fixo (140px) -->
      <div class="bn-card bn-card--blue">
        <div class="bn-card__body">
          <div class="bn-card__top">
            <span class="bn-card__number" data-value="3645">3.645</span>
          </div>
          <span class="bn-card__desc">de <b data-value="3645">3.645</b> do<br>total de precos</span>
        </div>
      </div>

      <!-- Card azul auto (largura livre) com variacao -->
      <div class="bn-card bn-card--blue-auto">
        <div class="bn-card__body">
          <div class="bn-card__top">
            <span class="bn-card__number" data-value="101.3">101,3%</span>
            <div class="bn-card__variation bn-card__variation--down">
              <span class="material-icons-outlined">arrow_downward</span>
              <span class="bn-card__variation-val" data-value="-0.4">0,4 %</span>
            </div>
          </div>
          <span class="bn-card__desc">Competitividade projetada,<br>era <b data-value="102.3">102,3 %</b></span>
        </div>
      </div>

      <!-- Card verde com variacao -->
      <div class="bn-card bn-card--green">
        <div class="bn-card__body">
          <div class="bn-card__top">
            <span class="bn-card__number" data-value="392000">+ R$ 392mil</span>
            <div class="bn-card__variation bn-card__variation--up">
              <span class="material-icons-outlined">arrow_upward</span>
              <span class="bn-card__variation-val" data-value="0.1">0,1 %</span>
            </div>
          </div>
          <span class="bn-card__desc">Estimativa de<br>diferenca no lucro</span>
        </div>
      </div>

    </div>
  </div>
</section>
```

### Specs

- Position: fixed, top: 88px, left: 52px, right: 0, z-index: 40
- Secao: transparente, padding 4px 16px
- Inner: background white, border-radius 6px, padding 12px
- Cards: height 68px, padding 4px 8px, border-radius 6px
- Azul fixo: width 140px, border 1px `#d7e8fc`, background `#f5f9fe`
- Azul auto: sem width definido, mesmas cores
- Verde: border 1.5px `--color-green-400`, background `#f5fbf9`
- Numero: 20px semibold `--color-gray-900`
- Descricao: 12px regular `--color-gray-600`
- Variacao up: `--color-green-500` / down: `--color-red-600`

---

## 5. Filtros

Barra de chips pill com dropdowns.

### HTML (estrutura resumida)

```html
<section class="filtros">
  <div class="filtros__inner">
    <div class="filtros__box">

      <div class="filtros__left">
        <!-- Linha 1 -->
        <div class="filtros__row">
          <!-- Chip com dropdown search + checkbox -->
          <div class="filtro-chip-wrapper">
            <button class="filtro-chip" data-filtro="produtos">
              <span>Produtos</span>
              <span class="material-icons-outlined filtro-chip__chevron">keyboard_arrow_down</span>
            </button>
            <div class="filtro-dropdown" id="filtro-produtos">
              <div class="filtro-dropdown__search">
                <span class="material-icons-outlined">search</span>
                <input type="text" class="filtro-dropdown__search-input" placeholder="Buscar produtos..." />
              </div>
              <div class="filtro-dropdown__list">
                <label class="filtro-dropdown__item"><input type="checkbox" /><span>Item 1</span></label>
                <!-- mais itens -->
              </div>
            </div>
          </div>
          <!-- Mais chips... -->
        </div>

        <!-- Linha 2 (chips numerados) -->
        <div class="filtros__row">
          <div class="filtro-chip-wrapper">
            <button class="filtro-chip filtro-chip--numbered" data-filtro="departamento">
              <span class="filtro-chip__prefix">01</span>
              <span>Departamento</span>
              <span class="material-icons-outlined filtro-chip__chevron">keyboard_arrow_down</span>
            </button>
            <div class="filtro-dropdown" id="filtro-departamento">...</div>
          </div>
        </div>
      </div>

      <div class="filtros__right">
        <div class="filtros__right-top">
          <button class="filtro-chip" data-filtro="mais-filtros">+ Filtros</button>
          <button class="filtro-chip" id="limparFiltros">Limpar filtros</button>
        </div>
        <div class="filtros__right-bottom">
          <button class="filtro-chip" data-filtro="filtros-salvos">Filtros salvos</button>
        </div>
      </div>

    </div>
  </div>
</section>
```

### Tipos de dropdown

| Tipo | Estrutura |
|---|---|
| **Search + checkbox** | search input + lista de checkboxes (padrao) |
| **Search + "Colar lista"** | search + link "Colar lista de codigos" + checkboxes (Produtos, Familia) |
| **Search + "Selecionar todos"** | search + checkboxes + footer com "Selecionar todos" (Lojas) |
| **Grupos colapsaveis** | headers clicaveis que expandem/recolhem grupos (Status, Segmentacao) |
| **Search + vazio** | search + "Nenhum item encontrado" (Marca, Fornecedor) |
| **Checkbox simples** | apenas checkboxes sem search (+ Filtros) |

### Specs

- Position: fixed, top: 188px, left: 52px, right: 0, z-index: 42
- Padding: 0 16px
- Inner: background white, border-radius 6px, padding 12px
- Box: border 1px `--color-gray-300`, border-radius 6px, padding 12px
- Chips: height 32px, padding 0 12px, border-radius 18px (pill), background `--color-gray-100`
- Hover: background `--color-gray-300`
- Aberto: background `--color-gray-300`, chevron gira 180deg
- Chips numerados: prefixo 12px bold `--color-gray-600` uppercase
- Coluna direita: width 240px

---

## 6. Cabecalho de Resultados

Barra de acoes avancadas entre filtros e grid.

### HTML (estrutura resumida)

```html
<section class="cabecalho">
  <div class="cabecalho__inner">

    <!-- Toggle filtros -->
    <div class="cabecalho__left">
      <button class="cabecalho__filtros-toggle" id="filtrosToggleBtn">
        <img src="https://marcoskip.github.io/infoprice-prototipos/assets/cabecalho/icon-filtros.svg" alt="" />
        <span>Filtros</span>
      </button>
    </div>

    <!-- Botoes compostos -->
    <div class="cabecalho__right">

      <!-- Botao composto: base (icone) + drop (chevron) -->
      <div class="composed-btn" id="btnCustos">
        <button class="composed-btn__base">
          <img src="https://marcoskip.github.io/infoprice-prototipos/assets/cabecalho/icon-custos.svg" alt="Custos" />
        </button>
        <button class="composed-btn__drop" data-dropdown="dd-custos">
          <span class="material-icons-outlined">keyboard_arrow_down</span>
        </button>
        <span class="composed-btn__tooltip">Filtrar novos custos</span>
        <div class="composed-dropdown" id="dd-custos">
          <!-- conteudo do dropdown -->
        </div>
      </div>

      <!-- Botao solo (sem dropdown) -->
      <div class="composed-btn composed-btn--solo" id="btnDerivados">
        <button class="composed-btn__base">
          <img src="https://marcoskip.github.io/infoprice-prototipos/assets/cabecalho/icon-derivados.svg" alt="Derivados" />
        </button>
        <span class="composed-btn__tooltip">Filtrar produtos derivados</span>
      </div>

      <!-- Botao Aplicar preco (verde, destaque) -->
      <div class="aplicar-btn" id="aplicarPrecoBtn">
        <button class="aplicar-btn__main">Aplicar preco</button>
        <button class="aplicar-btn__drop" data-dropdown="dd-aplicar">
          <span class="material-icons-outlined">keyboard_arrow_down</span>
        </button>
        <div class="composed-dropdown composed-dropdown--right" id="dd-aplicar">
          <label class="composed-dropdown__item"><input type="radio" name="aplicar" checked /><span>Aplicar preco sugerido</span></label>
          <label class="composed-dropdown__item"><input type="radio" name="aplicar" /><span>Aplicar preco vigente</span></label>
        </div>
      </div>

    </div>
  </div>
</section>
```

### Botoes compostos disponiveis

| # | ID | Icone SVG | Tooltip | Dropdown |
|---|---|---|---|---|
| 1 | filtrosToggle | icon-filtros.svg | — | Toggle visibilidade filtros |
| 2 | btnCustos | icon-custos.svg | Filtrar novos custos | Input numerico (N dias) |
| 3 | btnConcorrentes | icon-concorrentes.svg | Filtrar precos concorrentes | Checkbox (MPDV, infopanel, externo) + input |
| 4 | btnAlteracoes | icon-alteracoes.svg | Filtrar por Alteracao | Radio + input % |
| 5 | btnCompetitividade | MdEmojiEvents.svg | Filtrar por Competitividade | Radio + input % |
| 6 | btnMargem | icon-margem.svg | Filtrar por Margem | Radio + input % |
| 7 | btnLimites | icon limites.svg | Filtrar limites | Radio (quebrados/nao quebrados) |
| 8 | btnDerivados | icon-derivados.svg | Filtrar produtos derivados | Solo (sem dropdown) |
| 9 | aplicarPreco | — | — | Radio (sugerido/vigente) |

### Specs

- Botao base: 32x32px, border-radius 4px, hover background `--color-gray-200`
- Botao drop: 20x32px, border-radius 0 4px 4px 0, hover `--color-gray-200`
- Tooltip: position absolute, top calc(100% + 4px), background `--color-gray-900`, texto branco 12px
- Dropdown composto: min-width 240px, background white, border 1px `--color-gray-300`, shadow elevation
- Aplicar preco: background `--color-green-400`, texto branco, hover `--color-green-500`

---

## 7. Grid de Dados

Tabela de dados com layout fixo.

### HTML (estrutura)

```html
<section class="grid" id="gridSection">
  <div class="grid__wrapper">
    <table class="grid__table">
      <colgroup>
        <col style="width:40px">   <!-- checkbox -->
        <col>                       <!-- produto (flex) -->
        <col style="width:70px">   <!-- loja -->
        <col style="width:108px">  <!-- estoque -->
        <col style="width:90px">   <!-- pmz -->
        <col style="width:80px">   <!-- margem obj -->
        <col style="width:50px">   <!-- emb -->
        <col style="width:110px">  <!-- pmc -->
        <col style="width:120px">  <!-- preco vigente -->
        <col style="width:104px">  <!-- preco concorrente -->
        <col style="width:108px">  <!-- preco sugerido -->
        <col style="width:108px">  <!-- cpi -->
        <col style="width:108px">  <!-- margem -->
        <col style="width:100px">  <!-- previsao -->
        <col style="width:50px">   <!-- menu -->
      </colgroup>
      <thead>
        <tr>
          <th><input type="checkbox" class="grid__check" id="gridCheckAll" /></th>
          <th>
            <div class="grid__th-content">
              <span>Produto</span>
              <!-- Preferencia de ordenacao (colunas com config) -->
              <button class="grid__pref-btn" data-pref="produto"><img src="https://marcoskip.github.io/infoprice-prototipos/assets/grid/preferences.svg" alt="" /></button>
              <div class="grid__pref-dropdown" id="pref-produto">
                <div class="grid__pref-dropdown__title">Ordenar por</div>
                <label class="grid__pref-dropdown__item"><input type="radio" name="pref-produto" value="codigo" /> Codigo do produto</label>
                <label class="grid__pref-dropdown__item"><input type="radio" name="pref-produto" value="descricao" /> Descricao do produto</label>
              </div>
              <!-- Sort button -->
              <button class="grid__sort-btn" data-sort="double"><img src="https://marcoskip.github.io/infoprice-prototipos/assets/grid/double.svg" alt="" /></button>
            </div>
          </th>
          <!-- Coluna simples (sem pref) -->
          <th><div class="grid__th-content"><span>Loja</span><button class="grid__sort-btn" data-sort="double"><img src="https://marcoskip.github.io/infoprice-prototipos/assets/grid/double.svg" alt="" /></button></div></th>
          <!-- ... mais colunas -->
        </tr>
      </thead>
      <tbody id="gridBody"></tbody>
    </table>

    <!-- Paginacao -->
    <div class="grid__pagination">
      <div class="grid__pagination-left">
        <span class="grid__pagination-val">20</span>
        <span class="material-icons-outlined" style="font-size:16px;color:var(--color-blue-400)">expand_less</span>
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
          <button class="grid__pagination-btn is-active" data-page="1">1</button>
          <button class="grid__pagination-btn" data-page="2">2</button>
          <button class="grid__pagination-btn" data-page="3">3</button>
          <button class="grid__pagination-btn" data-page="...">...</button>
          <button class="grid__pagination-btn" data-page="9999">9999</button>
        </div>
        <div class="grid__pagination-nav">
          <span class="material-icons-outlined">chevron_right</span>
          <span class="material-icons-outlined">last_page</span>
        </div>
      </div>
    </div>
  </div>
</section>
```

### Colunas com dropdown de preferencia

| Coluna | Opcoes de ordenacao |
|---|---|
| Produto | Codigo, Descricao, Codigo da familia |
| Preco sugerido | Preco sugerido, Variacao de preco |
| CPI | Nova competitividade, Variacao de competitividade |
| Margem | Nova margem, Variacao de margem |

### Geracao de dados via JS

```javascript
const PRODUTOS = [
  { cod: '1026313', nome: 'LINGUICA SEARA 215G FININHA', familia: '2631' },
  { cod: '1026314', nome: 'SALSICHA PERDIGAO 500G', familia: '2631' },
  // ... ~20 produtos de supermercado
];

function randomBetween(min, max) { return (Math.random() * (max - min) + min).toFixed(2); }

const tbody = document.getElementById('gridBody');
PRODUTOS.forEach(p => {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input type="checkbox" class="grid__check" /></td>
    <td>
      <div class="grid__product">
        <img src="https://marcoskip.github.io/infoprice-prototipos/assets/grid/cod familia.svg" class="grid__product-fam" />
        <div>
          <span class="grid__product-code">${p.cod}</span>
          <span class="grid__product-name">${p.nome}</span>
        </div>
      </div>
    </td>
    <td>${Math.floor(Math.random() * 50) + 1}</td>
    <!-- ... mais celulas -->
  `;
  tbody.appendChild(tr);
});
```

### Specs

- `table-layout: fixed` com `<colgroup>` para larguras
- Header: background `--color-gray-100`, texto 10px bold uppercase `--color-gray-700`
- Sort btn: 16x16px com icone double.svg
- Pref btn: 16x16px com icone preferences.svg
- Linhas: padding-left 16px obrigatorio (primeira celula), hover background `--color-gray-50`, NUNCA usar border-bottom ou border-top entre linhas do grid (nenhum `td` ou `tr` deve ter border — a unica borda permitida e a do `grid__wrapper` ao redor da tabela e o `border-bottom` do `th` separando header do body)
- Checkbox: styled nativo, SEMPRE a 16px da margem esquerda da linha (usar padding-left da primeira celula, nunca sobrescrever com inline style)
- Input (preco sugerido): border 1px `--color-gray-300`, focus border `--color-blue-400` + shadow-focus
- **REGRA: inputs numericos na mesma linha devem ter a mesma largura, prioritariamente 116px** (`.grid__form-field { width: 116px; }`). As colunas do `<colgroup>` que contem inputs devem ter no minimo 128px (116px input + 6px padding de cada lado) para evitar sobreposicao
- Paginacao: height 40px, fundo branco, border-top 1px `--color-gray-200`
- Pagina ativa: background `--color-blue-400`, texto branco, border-radius 4px

---

## 8. Botoes primarios (Aplicar, Salvar, Exportar)

Botoes de acao principal da pagina. SEMPRE usar a cor principal da InfoPrice.

### Regra de cores

| Estado | Background | Texto |
|---|---|---|
| Habilitado | `--color-blue-400` | `--color-white` |
| Hover | `--color-blue-500` | `--color-white` |
| Desabilitado | `--color-blue-light-45` | `--color-white` |

### Specs

- padding: 6px 16px
- border-radius: `--radius-sm`
- font-size: `--font-size-sm`, font-weight: bold, uppercase
- NUNCA usar verde ou outra cor para botoes primarios — a cor principal e sempre Blue-400

---

## 9. Coluna Estoque (variante com icone)

Sempre que a variante de estoque for utilizada no grid, ela DEVE incluir o icone `unidades.svg` antes do valor numerico.

### HTML

```html
<div class="grid__estoque-line1">
  <img src="assets/grid/unidades.svg" alt="">
  <span class="grid__val-main">${valor}</span>
</div>
```

### Regra

- O icone `unidades.svg` e OBRIGATORIO na variante de estoque — nunca exibir apenas o numero sem o icone
- O `<img>` deve vir ANTES do `<span>` com o valor
- Path do icone: `assets/grid/unidades.svg` (ou URL absoluta do GitHub Pages: `https://marcoskip.github.io/infoprice-prototipos/assets/grid/unidades.svg`)

---

## 10. Coluna Cluster (variante com chip de lojas)

Sempre que um Cluster for exibido no grid, ele DEVE vir acompanhado de um chip indicando o numero de lojas pertencentes ao cluster.

### HTML

```html
<td>
  <div class="neg__cluster-cell">
    <span class="neg__cluster-name">${cluster.nome}</span>
    <span class="neg__cluster-lojas">${cluster.lojas} LOJAS</span>
  </div>
</td>
```

### CSS

```css
.neg__cluster-cell {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}
.neg__cluster-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-700);
  white-space: nowrap;
}
.neg__cluster-lojas {
  display: inline-flex;
  align-items: center;
  padding: 0 4px;
  border-radius: 3px;
  background: var(--color-blue-light-15);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: var(--color-blue-400);
  text-transform: uppercase;
  white-space: nowrap;
  line-height: 14px;
}
```

### Regra

- O chip de lojas e OBRIGATORIO sempre que um Cluster for exibido — nunca mostrar apenas o nome do cluster sem o chip
- O chip segue o mesmo estilo visual dos badges azuis (blue-light-15 background, blue-400 texto, uppercase)
- Layout: nome do cluster em cima, chip de lojas embaixo (flex-direction: column)
