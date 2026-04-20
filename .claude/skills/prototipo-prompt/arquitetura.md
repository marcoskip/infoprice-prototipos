# Arquitetura de Layout das Paginas

## Sistema de posicionamento

Todas as secoes usam `position: fixed` com coordenadas absolutas calculadas a partir do header (52px) e sidebar (52px colapsado / 220px expandido).

**REGRA OBRIGATORIA: Gap de 8px entre secoes**
Todas as secoes adjacentes devem ter exatamente **8px de espaco** entre si (bottom de uma secao ate o top da proxima).

**REGRA OBRIGATORIA: Largura consistente entre secoes**
Todas as secoes de conteudo devem ter SEMPRE a mesma largura visual. O `overflow` do Grid NUNCA deve ficar na secao `.grid` — deve ficar no `.grid__wrapper`, para que a scrollbar fique DENTRO do container branco e nao reduza a largura da secao em relacao as demais:

```css
.grid { overflow: visible; }
.grid__wrapper { height: 100%; overflow-y: auto; }
```

```
┌─────────────────────────────────────────────────┐
│  Header (height: 52px, top: 0, left: 0)        │
├──┬──────────────────────────────────────────────┤
│  │  Title Bar (height: 36px, top: 52px)         │
│  ├──────────────────────────────────────────────┤
│  │  Big Numbers (height: ~100px, top: 88px)     │
│S ├──────────────────────────────────────────────┤
│I │  Filtros (toggle, top: 188px)                │
│D ├──────────────────────────────────────────────┤
│E │  Cabecalho (top: ajusta com filtros)         │
│B ├──────────────────────────────────────────────┤
│A │                                              │
│R │  Grid (preenche o espaco restante)           │
│  │                                              │
└──┴──────────────────────────────────────────────┘
```

## Coordenadas por secao

| Secao | top | left | right | height | z-index |
|---|---|---|---|---|---|
| Header | 0 | 0 | 0 | 52px | 50 |
| Sidebar | 52px | 0 | — | calc(100vh - 52px) | 45 |
| Title Bar | 52px | 52px | 0 | 36px | 42 |
| Big Numbers | 88px | 52px | 0 | auto (~100px) | 40 |
| Filtros | 188px | 52px | 0 | auto | 42 |
| Cabecalho | depende de filtros | 52px | 0 | 40px | 41 |
| Grid | depende de cabecalho | 52px | 0 | ate bottom: 0 | 1 |

## Sidebar toggle

O sidebar alterna entre 52px (colapsado) e 220px (expandido). Ao alternar, TODAS as secoes abaixo do header devem atualizar seu `left`:

```javascript
const sidebar = document.getElementById('sidebar');
const seta = document.getElementById('sidebarSeta');
let sidebarExpanded = false;

seta.addEventListener('click', () => {
  sidebarExpanded = !sidebarExpanded;
  sidebar.classList.toggle('is-expanded', sidebarExpanded);
  seta.classList.toggle('is-flipped', sidebarExpanded);

  // Atualiza left de todas as secoes
  const newLeft = sidebarExpanded ? '220px' : '52px';
  document.querySelectorAll('.title-bar, .big-numbers, .filtros, .cabecalho, .grid')
    .forEach(el => el.style.left = newLeft);
});
```

CSS do sidebar:
```css
.sidebar {
  position: fixed;
  top: 52px;
  left: 0;
  width: 52px;
  height: calc(100vh - 52px);
  background: var(--color-white);
  border-right: 1px solid var(--color-gray-300);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: width 300ms ease;
  z-index: 45;
  overflow: hidden;
}

.sidebar.is-expanded { width: 220px; }
```

Transicao das secoes:
```css
.title-bar, .big-numbers, .filtros, .cabecalho, .grid {
  transition: left 300ms ease;
}
```

## Filtros toggle

O botao de filtros no cabecalho mostra/oculta a secao de filtros. Ao ocultar, as secoes abaixo (cabecalho e grid) sobem para preencher o espaco.

```javascript
const filtrosSection = document.querySelector('.filtros');
const filtrosToggle = document.getElementById('filtrosToggleBtn');
let filtrosVisible = true;

filtrosToggle.addEventListener('click', () => {
  filtrosVisible = !filtrosVisible;
  filtrosSection.style.display = filtrosVisible ? '' : 'none';

  // Recalcula top das secoes abaixo
  const cabecalhoTop = filtrosVisible ? '288px' : '188px';
  const gridTop = filtrosVisible ? '328px' : '228px';
  document.querySelector('.cabecalho').style.top = cabecalhoTop;
  document.querySelector('.grid').style.top = gridTop;
});
```

## Dropdown overlay

O header usa um overlay que escurece o fundo quando um dropdown esta aberto:

```html
<div class="dropdown-overlay" id="dropdownOverlay"></div>
```

```css
.dropdown-overlay {
  position: fixed;
  inset: 52px 0 0 0;
  background: rgba(0, 0, 0, 0.18);
  z-index: 49;
  opacity: 0;
  pointer-events: none;
  transition: opacity 140ms ease;
}

.dropdown-overlay.is-open {
  opacity: 1;
  pointer-events: auto;
}
```

## Padrao de closeAll

Toda pagina deve ter uma funcao `closeAll()` que fecha todos os dropdowns de todas as secoes:

```javascript
function closeAll() {
  // Header dropdowns
  document.querySelectorAll('.dropdown.is-open').forEach(d => d.classList.remove('is-open'));
  // Filtro dropdowns
  document.querySelectorAll('.filtro-dropdown.is-open').forEach(d => d.classList.remove('is-open'));
  document.querySelectorAll('.filtro-chip.is-open').forEach(c => c.classList.remove('is-open'));
  // Cabecalho dropdowns
  document.querySelectorAll('.composed-dropdown.is-open').forEach(d => d.classList.remove('is-open'));
  // Grid pref dropdowns
  document.querySelectorAll('.grid__pref-dropdown.is-open').forEach(d => d.classList.remove('is-open'));
  // Overlay
  document.getElementById('dropdownOverlay').classList.remove('is-open');
  // Reset aria-expanded
  document.querySelectorAll('[aria-expanded="true"]').forEach(el => el.setAttribute('aria-expanded', 'false'));
}

// Clicar fora fecha tudo
document.addEventListener('click', (e) => {
  if (!e.target.closest('.dropdown, .filtro-dropdown, .composed-dropdown, .grid__pref-dropdown, [aria-expanded], .filtro-chip, .composed-btn')) {
    closeAll();
  }
});
```

## Body e reset

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-family-base);
  background: var(--color-gray-50);
  display: flex;
  align-items: flex-start;
  min-height: 100vh;
}
```
