// Local design preview. Reads the same product sources as New Arrivals.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const root = path.resolve(__dirname, '..');
const production = process.argv.includes('--publish');
const read = p => fs.readFileSync(path.join(root, p), 'utf8').replace(/^\uFEFF/, '');
const esc = s => String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const models = fs.readdirSync(path.join(root, 'new-arrivals/images'), { withFileTypes: true })
  .filter(d => d.isDirectory() && fs.existsSync(path.join(root, 'new-arrivals/images', d.name, 'collection.json')))
  .map(d => ({ id: d.name, ...JSON.parse(read(`new-arrivals/images/${d.name}/collection.json`)) }))
  .sort((a, b) => (b.order || 0) - (a.order || 0) || b.id.localeCompare(a.id));

const cards = [];
function quote(en, zh, tone, label = 'A MOMENT TO KEEP') {
  return `<article class="home-tile quote-tile ${tone}"><div class="tile-content"><span class="tile-kicker">${label}</span><div><p class="tile-poem">${esc(en)}</p><p class="tile-zh" lang="zh-CN">${esc(zh)}</p></div><span class="tile-foot">WOOOHU · LITTLE NOTES</span></div></article>`;
}
models.forEach((model, i) => {
  const entry = model.images.find(image => image.file === model.cover) || model.images[0];
  const src = `new-arrivals/images/${encodeURIComponent(model.id)}/${encodeURIComponent(model.cover)}`;
  const href = `new-arrivals/${encodeURIComponent(model.id)}/index.html`;
  cards.push(`<article class="home-tile product-tile"><a class="tile-content" href="${href}"><div class="tile-photo"><img src="${src}" alt="${esc(entry.alt || model.category || model.title)}" width="800" height="800" ${i > 3 ? 'loading="lazy"' : ''}><span class="photo-link">View style ↗</span></div><div class="tile-caption"><div class="tile-meta"><span>${esc(model.category || 'SELECTED FOOTWEAR')}</span><span>${esc(model.title)}</span></div><h2>${esc(entry.en)}</h2><p class="tile-zh" lang="zh-CN">${esc(entry.zh)}</p></div></a></article>`);
  if (i === 0) cards.push(quote('A little beauty, with every step.', '每一步，都有一点美好。', 'sand', 'THE WOOOHU WAY'));
  if (i === 3) cards.push(quote('There is beauty in going slowly.', '慢慢走，也有慢慢走的风景。', 'sage'));
  if (i === 6) cards.push(`<article class="home-tile journal-tile cream"><a class="tile-content" href="https://wooohu.com/blog/feet-matter/"><span class="tile-kicker">NOTES ON FEET / 01</span><div><h2 class="tile-poem">Feet matter.</h2><p class="tile-zh" lang="zh-CN">脚，很重要。</p><p class="journal-summary">Thoughts on feet, walking,<br>and the shoes we make.</p></div><span class="tile-foot">READ THE NOTE ↗</span></a></article>`);
  if (i === 10) cards.push(quote('Keep a little light for the everyday.', '给寻常日子，留一点光。', 'ink'));
  if (i === 13) cards.push(`<article class="home-tile journal-tile sand"><a class="tile-content" href="https://wooohu.com/blog/choosing-womens-sandals-slides-supplier/"><span class="tile-kicker">NOTES ON FEET / 02</span><div><h2 class="tile-poem">A conversation.<br>A collection.</h2><p class="tile-zh" lang="zh-CN">从一次沟通，到一份共同的期待。</p><p class="journal-summary">Choosing a sandals &amp; slides supplier.<br>Questions worth asking.</p></div><span class="tile-foot">READ THE SOURCING NOTE ↗</span></a></article>`);
});
// Keep a small selection from the original homepage; no unverified model links.
for (const [n, en, zh] of [[3, 'A simpler kind of elegance.', '简单，也有自己的优雅。'], [8, 'Let the afternoon take its time.', '让午后，慢慢经过。'], [15, 'Leave a little room for colour.', '给生活，留一点色彩。'], [20, 'Some moments are worth staying for.', '有些时刻，值得停留。']]) {
  cards.push(`<article class="home-tile archive-tile"><a class="tile-content" href="images/${n}.jpg" target="_blank" rel="noopener noreferrer" aria-label="Enlarge photograph from the WOOOHU archive"><div class="tile-photo"><img src="images/${n}.jpg" alt="Footwear photograph from the WOOOHU collection archive" width="800" height="800" loading="lazy"><span class="photo-link">Enlarge photograph ↗</span></div><div class="tile-caption"><span class="tile-kicker">FROM THE WOOOHU ARCHIVE</span><h2>${en}</h2><p class="tile-zh" lang="zh-CN">${zh}</p></div></a></article>`);
}
const middle = `<main class="home-journal" id="story-grid"><div class="journal-heading"><div><p class="journal-overline">FOOTWEAR · EVERYDAY BEAUTY · LITTLE NOTES</p><h1>Beautiful things, in their own time.</h1></div><p class="journal-heading-note">Selected styles. Quiet thoughts.<br>Something new to discover.</p></div><div class="journal-waterfall">${cards.join('\n')}</div><div class="journal-end"><span>More shapes. More possibilities.</span><a href="new-arrivals/index.html">Explore all styles ↗</a></div></main>`;
let source = read('scripts/home-shell.html');
const header = source.match(/<nav>[\s\S]*?<\/nav>/)[0];
const bottom = source.slice(source.indexOf('<section class="contact-final"'), source.indexOf('<script>\n'));
source = source.replace(/<div class="story-container" id="story-grid">[\s\S]*?<\/div>/, middle);
source = source.replace(/<script>\s*\/\/ 诗词库[\s\S]*?<\/script>/, '');
if (!production) {
  source = source.replace('<link rel="canonical"', '<meta name="robots" content="noindex, nofollow">\n    <link rel="canonical"');
  source = source.replace('<script defer src="assets/analytics.js"></script>', '');
  source = source.replace(/<title>[\s\S]*?<\/title>/, '<title>Homepage Preview | WOOOHU</title>');
}
const asset = production ? 'home-journal' : 'home-preview';
const version = extension => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, `assets/${asset}.${extension}`))).digest('hex').slice(0, 12);
source = source.replace('</head>', `<link rel="stylesheet" href="assets/${asset}.css?v=${version('css')}"><script defer src="assets/${asset}.js?v=${version('js')}"></script>\n</head>`);
if (!source.includes(header) || !source.includes('<section class="contact-final"')) throw new Error('Page shell was altered');
const target = production ? 'index.html' : 'home-preview.html';
fs.writeFileSync(path.join(root, target), source);
console.log(`Generated ${target}: ${models.length} model cards, ${cards.length} total cards. Header/footer copied unchanged.`);
