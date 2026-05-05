/**
 * Build pipeline do Design System.
 *
 * Le os arquivos por componente em design-system/components/** e produz:
 *   design-system/dist/styles.css       (bundle de todos os components.css)
 *   design-system/dist/design-system.html (showcase agregado, com sidebar)
 *   design-system/dist/tokens.css        (copia da fonte)
 *
 * Roda manualmente: node build.js
 * Tambem roda automaticamente via GitHub Action no push.
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DS = path.join(ROOT, 'design-system');
const DIST = path.join(DS, 'dist');
const COMPONENTS = path.join(DS, 'components');

function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }

// ────────────────────────────────────────────────────────────────
// 1) Bundle CSS
// ────────────────────────────────────────────────────────────────

function listComponentDirs(category) {
  const catDir = path.join(COMPONENTS, category);
  if (!fs.existsSync(catDir)) return [];
  return fs.readdirSync(catDir)
    .map(name => path.join(catDir, name))
    .filter(p => fs.statSync(p).isDirectory())
    .sort();
}

function readComponentCSS(compDir) {
  const id = path.basename(compDir);
  const cssPath = path.join(compDir, `${id}.css`);
  if (!fs.existsSync(cssPath)) return '';
  return fs.readFileSync(cssPath, 'utf8');
}

function buildStyles() {
  const parts = [];

  // Base (reset + body globais)
  const basePath = path.join(DS, 'base.css');
  if (fs.existsSync(basePath)) {
    parts.push('/* ── Base (reset + body) ──────────────────────── */');
    parts.push(fs.readFileSync(basePath, 'utf8').trim());
    parts.push('');
  }

  // Componentes basicos primeiro, compostos depois (ordem do cascade)
  for (const category of ['basic', 'compound']) {
    const comps = listComponentDirs(category);
    if (comps.length === 0) continue;
    parts.push(`/* ════════════ ${category.toUpperCase()} ════════════ */`);
    for (const compDir of comps) {
      const id = path.basename(compDir);
      const css = readComponentCSS(compDir);
      if (!css.trim()) continue;
      parts.push(css.trim());
      parts.push('');
    }
  }

  return parts.join('\n') + '\n';
}

// ────────────────────────────────────────────────────────────────
// 2) Extrair conteudo da <section> de cada preview standalone
// ────────────────────────────────────────────────────────────────

function extractSectionContent(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf8');
  const m = html.match(/<section class="ds__section" id="[^"]+">([\s\S]*?)<\/section>/);
  return m ? m[1].trim() : '';
}

function readMd(mdPath) {
  if (!fs.existsSync(mdPath)) return { title: '', desc: '' };
  const raw = fs.readFileSync(mdPath, 'utf8');
  const titleMatch = raw.match(/^#\s+(.+)$/m);
  return { title: titleMatch ? titleMatch[1].trim() : '' };
}

// ────────────────────────────────────────────────────────────────
// 3) Gerar showcase agregado (design-system.html)
// ────────────────────────────────────────────────────────────────

function buildShowcase() {
  // Carrega CSS e JS do showcase
  const showcaseCss = fs.readFileSync(path.join(DS, 'showcase.css'), 'utf8');
  const showcaseJs = fs.readFileSync(path.join(DS, 'showcase.js'), 'utf8');

  // Coleta componentes por categoria
  const data = {
    tokens: collectTokens(),
    basic: collectComponents('basic'),
    compound: collectComponents('compound'),
    templates: collectTemplates(),
    guidelines: collectGuidelines(),
  };

  // Sidebar nav
  const navHtml = `
    <div class="ds__nav-section">
      <div class="ds__nav-section-title">Para devs</div>
      <a class="ds__nav-link" href="https://infoprice.github.io/produto-ux/DSBridge/react-guide.html" target="_blank" style="display:flex;align-items:center;gap:4px">
        Guia React
        <span class="material-icons-outlined" style="font-size:12px;color:var(--color-gray-500)">open_in_new</span>
      </a>
    </div>
    <div class="ds__nav-section">
      <div class="ds__nav-section-title">Fundamentos</div>
${data.tokens.map(t => `      <a class="ds__nav-link" href="#${t.id}">${t.title}</a>`).join('\n')}
    </div>
    <div class="ds__nav-section">
      <div class="ds__nav-section-title">Componentes básicos</div>
${data.basic.map(c => `      <a class="ds__nav-link" href="#${c.id}">${c.title}</a>`).join('\n')}
    </div>
    <div class="ds__nav-section">
      <div class="ds__nav-section-title">Componentes compostos</div>
${data.compound.map(c => `      <a class="ds__nav-link" href="#${c.id}">${c.title}</a>`).join('\n')}
    </div>
    <div class="ds__nav-section">
      <div class="ds__nav-section-title">Templates</div>
${data.templates.map(t => `      <a class="ds__nav-link" href="#${t.id}">${t.title}</a>`).join('\n')}
    </div>`;

  // Sections do main
  const sectionsHtml = [
    ...data.tokens,
    ...data.basic,
    ...data.compound,
    ...data.templates,
  ].map(item => `    <section class="ds__section" id="${item.id}">
${item.content}
    </section>`).join('\n\n');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>InfoPrice — Design System</title>
  <link rel="icon" type="image/x-icon" href="../../assets/favicon.ico" />
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
  <link rel="stylesheet" href="../../tokens.css" />
  <link rel="stylesheet" href="styles.css" />
  <style>
${showcaseCss}
  </style>
</head>
<body>
  <aside class="ds__nav" id="dsNav">
    <div class="ds__nav-search-wrapper">
      <div class="searchbar searchbar--small" id="dsSearch">
        <span class="material-icons-outlined searchbar__icon">search</span>
        <input type="text" class="searchbar__input" placeholder="Buscar componente..." />
        <button class="searchbar__clear" id="dsSearchClear" aria-label="Limpar busca">
          <span class="material-icons-outlined">close</span>
        </button>
      </div>
    </div>
${navHtml}
  </aside>

  <div class="ds__nav-resize" id="dsNavResize" role="separator" aria-orientation="vertical" aria-label="Redimensionar menu lateral" tabindex="0"></div>

  <main class="ds__main">
    <header class="ds__hero">
      <div class="ds__hero-eyebrow">InfoPrice</div>
      <h1 class="ds__hero-title">Design System</h1>
      <p class="ds__hero-subtitle">
        Página gerada automaticamente a partir dos componentes em <code>design-system/components/</code>.
        Atualize qualquer componente individual e a build regenera este arquivo.
      </p>
    </header>

${sectionsHtml}
  </main>

  <script>
${showcaseJs}
  </script>
</body>
</html>
`;
}

function collectTokens() {
  const dir = path.join(DS, 'tokens');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace('.md', ''))
    .sort()
    .map(id => {
      const md = readMd(path.join(dir, `${id}.md`));
      return { id, title: md.title || id, content: `<h2 class="ds__section-title">${md.title || id}</h2>\n      <p class="ds__section-desc">Token documentado em <code>design-system/tokens/${id}.md</code>.</p>` };
    });
}

function collectComponents(category) {
  const dirs = listComponentDirs(category);
  return dirs.map(dir => {
    const id = path.basename(dir);
    const html = path.join(dir, `${id}.html`);
    const md = readMd(path.join(dir, `${id}.md`));
    const content = fs.existsSync(html) ? extractSectionContent(html) : '';
    return { id, title: md.title || id, content };
  });
}

function collectTemplates() {
  const dir = path.join(DS, 'templates');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .map(name => path.join(dir, name))
    .filter(p => fs.statSync(p).isDirectory())
    .map(d => {
      const id = path.basename(d);
      const html = path.join(d, `${id}.html`);
      const md = readMd(path.join(d, `${id}.md`));
      const content = fs.existsSync(html) ? extractSectionContent(html) : '';
      return { id, title: md.title || id, content };
    });
}

function collectGuidelines() {
  const dir = path.join(DS, 'guidelines');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace('.md', ''));
}

// ────────────────────────────────────────────────────────────────
// EXECUTA
// ────────────────────────────────────────────────────────────────

console.log('=== Build do Design System ===\n');

ensureDir(DIST);

// 1) Bundle styles.css
const styles = buildStyles();
fs.writeFileSync(path.join(DIST, 'styles.css'), styles);
console.log(`✓ dist/styles.css (${styles.length.toLocaleString()} bytes)`);

// 2) Copia tokens.css
const tokensSrc = path.join(ROOT, 'tokens.css');
if (fs.existsSync(tokensSrc)) {
  fs.copyFileSync(tokensSrc, path.join(DIST, 'tokens.css'));
  console.log(`✓ dist/tokens.css (copy)`);
}

// 3) Showcase agregado
const showcase = buildShowcase();
fs.writeFileSync(path.join(DIST, 'design-system.html'), showcase);
console.log(`✓ dist/design-system.html (${showcase.length.toLocaleString()} bytes)`);

console.log('\nBuild concluído.');
