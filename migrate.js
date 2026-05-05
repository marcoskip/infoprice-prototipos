/**
 * Migra design-system.html + styles.css monoliticos para estrutura
 * por componente (design-system/components/<categoria>/<nome>/).
 *
 * Uso: node migrate.js
 * Output: pasta design-system/ na raiz do projeto.
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DS_HTML = fs.readFileSync(path.join(ROOT, 'design-system.html'), 'utf8');
const STYLES = fs.readFileSync(path.join(ROOT, 'styles.css'), 'utf8');
const OUT = path.join(ROOT, 'design-system');

// ────────────────────────────────────────────────────────────────
// Extrair <style> e <script> do design-system.html para reutilizar
// no layout dos previews individuais
// ────────────────────────────────────────────────────────────────

function extractShowcaseAssets() {
  const styleMatch = DS_HTML.match(/<style>([\s\S]*?)<\/style>/);
  const scriptMatch = DS_HTML.match(/<script>([\s\S]*?)<\/script>/);
  return {
    css: styleMatch ? styleMatch[1] : '',
    js: scriptMatch ? scriptMatch[1] : '',
  };
}

function writeShowcaseAssets() {
  ensureDir(OUT);
  const { css, js } = extractShowcaseAssets();
  fs.writeFileSync(path.join(OUT, 'showcase.css'), css);
  fs.writeFileSync(path.join(OUT, 'showcase.js'), js);
}

// ────────────────────────────────────────────────────────────────
// 1) Mapear cada section ID → categoria via sidebar nav
// ────────────────────────────────────────────────────────────────

function buildCategoryMap() {
  const map = {};
  // Cada bloco <div class="ds__nav-section"> tem um title + lista de links
  const navSectionRegex = /<div class="ds__nav-section">([\s\S]*?)<\/div>\s*(?=<div class="ds__nav-section"|<\/aside>)/g;
  for (const match of DS_HTML.matchAll(navSectionRegex)) {
    const block = match[1];
    const titleMatch = block.match(/<div class="ds__nav-section-title">([^<]+)<\/div>/);
    if (!titleMatch) continue;
    const title = titleMatch[1].trim();
    const ids = [...block.matchAll(/<a class="ds__nav-link" href="#([^"]+)"/g)].map(m => m[1]);
    for (const id of ids) map[id] = title;
  }
  return map;
}

// ────────────────────────────────────────────────────────────────
// 2) Extrair cada section do design-system.html
// ────────────────────────────────────────────────────────────────

function extractSections() {
  const sections = [];
  const sectionRegex = /<section class="ds__section" id="([^"]+)">([\s\S]*?)<\/section>/g;
  for (const match of DS_HTML.matchAll(sectionRegex)) {
    const id = match[1];
    const inner = match[2];
    const titleMatch = inner.match(/<h2 class="ds__section-title">([^<]+)<\/h2>/);
    const descMatch = inner.match(/<p class="ds__section-desc">([\s\S]*?)<\/p>/);
    sections.push({
      id,
      title: titleMatch ? titleMatch[1].trim() : id,
      desc: descMatch ? descMatch[1].replace(/\s+/g, ' ').trim() : '',
      html: inner.trim(),
    });
  }
  return sections;
}

// ────────────────────────────────────────────────────────────────
// 3) Particionar styles.css usando os headers /* ── X ─── */
// ────────────────────────────────────────────────────────────────

function partitionCSS() {
  const blocks = [];
  const lines = STYLES.split('\n');
  let current = { header: 'global', start: 0, content: [] };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const headerMatch = line.match(/^\/\* ── ([^─]+?) ──+\s*\*?\/?/);
    if (headerMatch) {
      // fecha bloco anterior
      if (current.content.length > 0) {
        blocks.push({ header: current.header, content: current.content.join('\n') });
      }
      current = { header: headerMatch[1].trim(), content: [line] };
    } else {
      current.content.push(line);
    }
  }
  if (current.content.length > 0) {
    blocks.push({ header: current.header, content: current.content.join('\n') });
  }
  return blocks;
}

// ────────────────────────────────────────────────────────────────
// 4) Mapear blocos de CSS para componentes (heuristica)
// ────────────────────────────────────────────────────────────────

// Mapa manual: header do styles.css → ID do componente
const CSS_TO_COMPONENT = {
  'Header': 'header',
  'Lado esquerdo': 'header',
  'Lado direito': 'header',
  'Dropdowns (base compartilhada)': 'header-dropdowns',
  'Dropdown de produtos': 'header-dropdowns',
  'Dropdown de usuário': 'header-dropdowns',
  'Sidebar': 'sidebar',
  'Title Bar': 'title-bar',
  'Title bar — botões': 'title-bar',
  'Title bar — dropdowns': 'title-dropdown',
  'Big Numbers': 'big-numbers-card',
  'Tooltips': 'tooltips',
  'Filtros': 'filtro-chips',
  'Chip (pill button)': 'filtro-chips',
  'Filtro dropdown (base)': 'filtro-dropdowns',
  'Cabecalho (toolbar da tabela)': 'cabecalho',
  'Composed button (Base + Drop)': 'composed-buttons',
  'Composed button tooltip': 'composed-buttons',
  'Composed button dropdown': 'composed-buttons',
  'APLICAR PREÇO (twin button)': 'aplicar-btn',
  'Grid (tabela de dados)': 'grid',
  'Indicador (5 estados)': 'indicadores',
  'Botao primario global (Salvar, Aplicar, Confirmar)': 'botoes',
  'Switch': 'switch',
  'Radio': 'radio',
  'Checkbox': 'checkbox',
  'Badge generico': 'badge-generic',
  'Tag generico': 'tag-generic',
  'MessageBox (inline)': 'message-box',
  'Toast (popup overlay)': 'toast',
  'Base': 'botoes',
  'Tamanhos (default = large)': 'botoes',
  'Type: Primary (filled blue por padrao)': 'botoes',
  'Type: Secondary (filled blue padrao + variantes red/gray/white)': 'botoes',
  'Type: Link (text-only, sem padding/border, com icone opcional)': 'botoes',
  'Twin button (split: main action + drop trigger)': 'botoes',
  'Modal': 'modal',
  'Navbar (sub-navegacao em abas)': 'navbar',
  'SelectPicker': 'select-picker',
  'Context Menu': 'context-menu',
  'DatePicker': 'date-picker',
  'HourPicker': 'hour-picker',
  'Form field generico': 'form-field',
  'Searchbar': 'searchbar',
  'Nav button': 'nav-button',
};

function groupCSSByComponent() {
  const blocks = partitionCSS();
  const byComp = {};
  let baseCSS = '';
  for (const b of blocks) {
    if (b.header === 'global') {
      baseCSS += b.content + '\n';
      continue;
    }
    const compId = CSS_TO_COMPONENT[b.header];
    if (!compId) {
      console.warn(`[CSS] Header sem mapeamento: "${b.header}"`);
      continue;
    }
    byComp[compId] = (byComp[compId] || '') + b.content + '\n\n';
  }
  return { byComp, baseCSS };
}

// ────────────────────────────────────────────────────────────────
// 5) Mapear categoria do PT-BR para slug de pasta
// ────────────────────────────────────────────────────────────────

const CATEGORY_SLUG = {
  'Fundamentos': 'tokens',
  'Componentes básicos': 'basic',
  'Componentes compostos': 'compound',
  'Templates': 'templates',
  'Para devs': 'guidelines',
};

const TOKEN_IDS = new Set(['cores', 'tipografia', 'espacamento', 'radius', 'sombras', 'icones']);
const GUIDELINE_IDS = new Set(['logo']);

function categorize(id, navCategory) {
  if (!navCategory) return null;
  // Tokens (Fundamentos só inclui tokens reais — o resto vai pra basic)
  if (navCategory === 'Fundamentos') {
    if (TOKEN_IDS.has(id)) return { type: 'token', folder: 'tokens' };
    if (GUIDELINE_IDS.has(id)) return { type: 'guideline', folder: 'guidelines' };
    return { type: 'component', folder: 'components/basic' };
  }
  if (navCategory === 'Componentes básicos') return { type: 'component', folder: 'components/basic' };
  if (navCategory === 'Componentes compostos') return { type: 'component', folder: 'components/compound' };
  if (navCategory === 'Templates') return { type: 'template', folder: 'templates' };
  return null;
}

// ────────────────────────────────────────────────────────────────
// 6) Gerar arquivos
// ────────────────────────────────────────────────────────────────

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

// Decodifica entidades HTML basicas dos blocos <pre><code>
function decodeEntities(s) {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

// Extrai todos os snippets de codigo canonicos da section
function extractCanonicalMarkup(sectionHtml) {
  const snippets = [];
  // Cada ds__component pode ter um nome (variante) e um bloco de codigo
  const componentRegex = /<div class="ds__component"[^>]*>([\s\S]*?)<\/div>\s*(?=<div class="ds__component"|$)/g;
  for (const m of sectionHtml.matchAll(componentRegex)) {
    const block = m[1];
    const nameMatch = block.match(/<span class="ds__component-name">([^<]+)<\/span>/);
    const codeMatch = block.match(/<pre><code>([\s\S]*?)<\/code><\/pre>/);
    if (codeMatch) {
      snippets.push({
        name: nameMatch ? nameMatch[1].trim() : '',
        code: decodeEntities(codeMatch[1]).trim(),
      });
    }
  }
  // Fallback: pega todos os <pre><code> da section
  if (snippets.length === 0) {
    const codeRegex = /<pre><code>([\s\S]*?)<\/code><\/pre>/g;
    for (const m of sectionHtml.matchAll(codeRegex)) {
      snippets.push({ name: '', code: decodeEntities(m[1]).trim() });
    }
  }
  return snippets;
}

function writeComponent(section, cat, css) {
  const baseDir = path.join(OUT, cat.folder, section.id);
  ensureDir(baseDir);

  // .md (especificacao)
  const md = `# ${section.title}

${section.desc || '(sem descrição)'}

## Markup canônico

Veja \`${section.id}.html\` — contém os snippets canônicos de cada variante (extraídos dos blocos \`<pre><code>\` do design-system.html).

## Estilos

Veja \`${section.id}.css\` para as classes CSS deste componente.

## React

(a fazer — adicionar \`${section.id}.react.tsx\` apenas se o componente exigir comportamento stateful complexo. Caso contrário, a skill \`/handoff\` gera React on-the-fly a partir do HTML)
`;
  fs.writeFileSync(path.join(baseDir, `${section.id}.md`), md);

  // .html — pagina standalone preview com mesmo layout do design-system.html (sem sidebar)
  // Skill extrai snippets canonicos parseando os <pre><code> blocks dentro
  // Caminhos relativos: components/<cat>/<id>/ → design-system/ (sobe N niveis)
  const upToDS = '../'.repeat(cat.folder.split('/').length + 1);   // ate design-system/
  const upToRoot = '../'.repeat(cat.folder.split('/').length + 2); // ate raiz do projeto
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>${section.title} — DS preview</title>
  <link rel="icon" type="image/x-icon" href="${upToRoot}assets/favicon.ico" />
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
  <link rel="stylesheet" href="${upToRoot}tokens.css" />
  <link rel="stylesheet" href="${upToRoot}styles.css" />
  <link rel="stylesheet" href="${upToDS}showcase.css" />
  <style>
    /* Override: layout sem sidebar (single-component preview) */
    body { background: var(--color-gray-50); }
    .ds__layout, .ds__main { margin-left: 0 !important; max-width: 1200px; }
    .ds__main { padding: 32px; }
    .ds__nav, .ds__nav-resize, .ds__hero { display: none !important; }
  </style>
</head>
<body>
  <main class="ds__main">
    <section class="ds__section" id="${section.id}">
${section.html}
    </section>
  </main>
  <script src="${upToDS}showcase.js"></script>
</body>
</html>
`;
  fs.writeFileSync(path.join(baseDir, `${section.id}.html`), html);

  // .css
  if (css) {
    fs.writeFileSync(path.join(baseDir, `${section.id}.css`), css.trim() + '\n');
  } else {
    fs.writeFileSync(path.join(baseDir, `${section.id}.css`), `/* CSS deste componente vive em styles.css base — split manual necessario */\n`);
  }
}

function writeToken(section) {
  const baseDir = path.join(OUT, 'tokens');
  ensureDir(baseDir);
  const md = `# ${section.title}

${section.desc || ''}

## Conteúdo do DS

\`\`\`html
${section.html}
\`\`\`
`;
  fs.writeFileSync(path.join(baseDir, `${section.id}.md`), md);
}

function writeGuideline(section) {
  const baseDir = path.join(OUT, 'guidelines');
  ensureDir(baseDir);
  fs.writeFileSync(
    path.join(baseDir, `${section.id}.md`),
    `# ${section.title}\n\n${section.desc}\n\n${section.html}\n`
  );
}

function writeTemplate(section) {
  const baseDir = path.join(OUT, 'templates', section.id);
  ensureDir(baseDir);
  // Mesmo wrapper standalone dos componentes (carrega tokens + styles + showcase)
  // De templates/<id>/ → design-system/ sobe 2; até a raiz sobe 3
  const upToDS = '../../';
  const upToRoot = '../../../';
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>${section.title} — DS preview</title>
  <link rel="icon" type="image/x-icon" href="${upToRoot}assets/favicon.ico" />
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
  <link rel="stylesheet" href="${upToRoot}tokens.css" />
  <link rel="stylesheet" href="${upToRoot}styles.css" />
  <link rel="stylesheet" href="${upToDS}showcase.css" />
  <style>
    body { background: var(--color-gray-50); }
    .ds__layout, .ds__main { margin-left: 0 !important; max-width: 1200px; }
    .ds__main { padding: 32px; }
    .ds__nav, .ds__nav-resize, .ds__hero { display: none !important; }
  </style>
</head>
<body>
  <main class="ds__main">
    <section class="ds__section" id="${section.id}">
${section.html}
    </section>
  </main>
  <script src="${upToDS}showcase.js"></script>
</body>
</html>
`;
  fs.writeFileSync(path.join(baseDir, `${section.id}.html`), html);
  fs.writeFileSync(
    path.join(baseDir, `${section.id}.md`),
    `# ${section.title}\n\n${section.desc}\n`
  );
}

// ────────────────────────────────────────────────────────────────
// EXECUTA
// ────────────────────────────────────────────────────────────────

console.log('=== Migração do Design System ===\n');

writeShowcaseAssets();
console.log('showcase.css + showcase.js extraídos\n');

const catMap = buildCategoryMap();
const sections = extractSections();
const { byComp: cssByComp, baseCSS } = groupCSSByComponent();

// Salva o CSS base (reset + body) num arquivo separado
fs.writeFileSync(path.join(OUT, 'base.css'), baseCSS.trim() + '\n');
console.log('base.css salvo (reset + body globais)\n');

console.log(`Sections HTML: ${sections.length}`);
console.log(`Categorias mapeadas: ${Object.keys(catMap).length}`);
console.log(`CSS particionado em ${Object.keys(cssByComp).length} componentes\n`);

const stats = { tokens: 0, basic: 0, compound: 0, templates: 0, guidelines: 0, skipped: 0 };

for (const section of sections) {
  const navCat = catMap[section.id];
  const cat = categorize(section.id, navCat);

  // templates-intro é texto introdutório, vira README dentro de templates/
  if (section.id === 'templates-intro') {
    ensureDir(path.join(OUT, 'templates'));
    fs.writeFileSync(
      path.join(OUT, 'templates', 'README.md'),
      `# ${section.title}\n\n${section.desc}\n`
    );
    stats.guidelines++;
    continue;
  }

  if (!cat) {
    console.warn(`[SKIP] ${section.id} (categoria desconhecida: ${navCat})`);
    stats.skipped++;
    continue;
  }

  if (cat.type === 'token') {
    writeToken(section);
    stats.tokens++;
  } else if (cat.type === 'guideline') {
    writeGuideline(section);
    stats.guidelines++;
  } else if (cat.type === 'template') {
    writeTemplate(section);
    stats.templates++;
  } else {
    const css = cssByComp[section.id] || '';
    writeComponent(section, cat, css);
    if (cat.folder.endsWith('basic')) stats.basic++;
    else stats.compound++;
  }
}

console.log('\n=== Resultado ===');
console.log(`tokens:     ${stats.tokens}`);
console.log(`basic:      ${stats.basic}`);
console.log(`compound:   ${stats.compound}`);
console.log(`templates:  ${stats.templates}`);
console.log(`guidelines: ${stats.guidelines}`);
console.log(`skipped:    ${stats.skipped}`);
console.log(`\nOutput em: ${OUT}/`);
