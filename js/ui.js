// Bean Box — rendering, input, menus, cookbook and the main loop.
'use strict';

const $ = (id) => document.getElementById(id);
const view = $('view'), glowCanvas = $('glow'), stage = $('stage');
view.width = glowCanvas.width = W;
view.height = glowCanvas.height = H;
const ctx = view.getContext('2d'), gctx = glowCanvas.getContext('2d');
const img = ctx.createImageData(W, H), buf = new Uint32Array(img.data.buffer);
const gimg = gctx.createImageData(W, H), gbuf = new Uint32Array(gimg.data.buffer);
const BG = pack(5, 5, 7), SPARKC = pack(255, 236, 140);

const ui = {
  cat: 'minerals', left: ID.sand, right: ID.erase, brush: 4, square: false, replace: false,
  paused: false, stepOnce: false, speed: 1, heatView: false, glow: true, fieldView: false,
  drawing: 0, last: null, lineStart: null, mouse: { x: -1, y: -1, inside: false }, hoverText: '',
};

// ---------- Colour lookup tables ----------
function gradient(stops, lo, hi, n) {
  const out = new Uint32Array(n), dim = new Uint32Array(n);
  for (let k = 0; k < n; k++) {
    const T = lo + (hi - lo) * k / (n - 1);
    let s = 0;
    while (s < stops.length - 2 && T > stops[s + 1][0]) s++;
    const [t1, c1] = stops[s], [t2, c2] = stops[s + 1];
    const f = Math.max(0, Math.min(1, (T - t1) / (t2 - t1)));
    const a = hexRGB(c1), b = hexRGB(c2);
    const r = a[0] + (b[0] - a[0]) * f, g = a[1] + (b[1] - a[1]) * f, bl = a[2] + (b[2] - a[2]) * f;
    out[k] = pack(r | 0, g | 0, bl | 0);
    dim[k] = pack(r * 0.3 | 0, g * 0.3 | 0, bl * 0.3 | 0);
  }
  return [out, dim];
}
const HEAT_LO = -200, HEAT_HI = 1500, HEAT_N = 1024;
const [HEAT, HEAT_DIM] = gradient([
  [-200, '#1a0050'], [-50, '#0030ff'], [0, '#00a0ff'], [22, '#00b060'], [60, '#a0e000'],
  [100, '#ffe000'], [200, '#ff8000'], [400, '#ff2000'], [800, '#ff60b0'], [1500, '#ffffff'],
], HEAT_LO, HEAT_HI, HEAT_N);
const heatIdx = (T) => { const k = ((T - HEAT_LO) / (HEAT_HI - HEAT_LO) * (HEAT_N - 1)) | 0; return k < 0 ? 0 : k >= HEAT_N ? HEAT_N - 1 : k; };
const [FIELDC] = gradient([[0, '#05050a'], [0.3, '#2a0a50'], [1.5, '#6a20c0'], [5, '#c060ff'], [20, '#ffe0ff']], 0, 20, 256);
const [COMPASSC] = gradient([[0, '#ff3030'], [90, '#ffd030'], [180, '#30e0ff'], [270, '#a040ff'], [360, '#ff3030']], 0, 360, 360);
const [GLOWC] = gradient([[380, '#601000'], [600, '#d03000'], [900, '#ff9020'], [1400, '#fff0c0']], 380, 1400, 256);

function incandescent(c, T) {
  const k = Math.min(255, ((T - 380) / 1020 * 255) | 0), g = GLOWC[k];
  const f = Math.min(0.85, (T - 380) / 700);
  const r = (c & 255) * (1 - f) + (g & 255) * f, gg = ((c >> 8) & 255) * (1 - f) + ((g >> 8) & 255) * f, b = ((c >> 16) & 255) * (1 - f) + ((g >> 16) & 255) * f;
  return pack(r | 0, gg | 0, b | 0);
}

// ---------- Rendering ----------
let partCount = 0;
function render() {
  const heat = ui.heatView, glow = ui.glow && !heat, fieldOn = ui.fieldView && !heat;
  if (glow) gbuf.fill(0);
  let count = 0;
  for (let i = 0; i < N; i++) {
    const t = type[i];
    if (t === 0) {
      if (fieldOn) { const b = fieldAt(i % W, (i / W) | 0), m = Math.hypot(fieldX[b], fieldY[b]); buf[i] = m > 0.02 ? FIELDC[Math.min(255, (m / 20 * 255) | 0)] : BG; }
      else buf[i] = heat ? HEAT_DIM[heatIdx(temp[i])] : BG;
      continue;
    }
    count++;
    const e = E[t];
    let c, lit = false;
    if (heat) c = HEAT[heatIdx(temp[i])];
    else if (e.firePal) {
      const f = e.lifeMin !== undefined ? life[i] / (e.lifeMin + e.lifeRange + 1) : 1;
      c = e.firePal[Math.max(0, Math.min(15, ((f * 15) | 0) + (shade[i] & 1)))];
    } else {
      c = e.pal[shade[i]];
      const ev = elec[i];
      if (e.compass) {
        const x = i % W, b = fieldAt(x, (i / W) | 0), fx = fieldX[b], fy = fieldY[b];
        if (fx * fx + fy * fy > 0.0009) c = COMPASSC[((Math.atan2(fy, fx) * 180 / Math.PI + 360) % 360) | 0];
      } else if (e.activePal && deviceActive(i, e)) { c = e.activePal[shade[i]]; lit = e.activeGlow; }
      else if (plasmaGlow[i] && CONDUCT[t]) { c = e.plasmaC || (ev && ev <= 3 ? SPARKC : e.powPal[shade[i]]); lit = true; }
      else { const T = temp[i]; if (T > 380 && ST[t] !== ST_GAS) c = incandescent(c, T); }
    }
    buf[i] = c;
    if (glow && (e.glow || lit || temp[i] > 520 || (plasmaGlow[i] && e.plasmaC))) gbuf[i] = c;
  }
  partCount = count;
  drawCursor();
  ctx.putImageData(img, 0, 0);
  if (glow) gctx.putImageData(gimg, 0, 0);
}
function mark(i) { const c = buf[i]; buf[i] = (((c & 0xfefefe) >>> 1) + 0x707070) | 0xff000000; }
function drawCursor() {
  const m = ui.mouse;
  if (!m.inside && !ui.lineStart) return;
  const r = ui.brush, inside = (dx, dy) => ui.square ? Math.abs(dx) <= r && Math.abs(dy) <= r : dx * dx + dy * dy <= r * r + r;
  if (ui.lineStart) linePoints(ui.lineStart, m, (x, y) => { if (inb(x, y)) mark(y * W + x); });
  for (let dy = -r - 1; dy <= r + 1; dy++) for (let dx = -r - 1; dx <= r + 1; dx++) {
    if (!inside(dx, dy)) continue;
    if (inside(dx + 1, dy) && inside(dx - 1, dy) && inside(dx, dy + 1) && inside(dx, dy - 1)) continue;
    const x = m.x + dx, y = m.y + dy;
    if (inb(x, y)) mark(y * W + x);
  }
}

function fit() {
  const sw = stage.clientWidth - 2, sh = stage.clientHeight - 2;
  let s = Math.min(sw / W, sh / H);
  if (s > 2) s = Math.floor(s * 2) / 2;
  const w = Math.max(1, Math.floor(W * s)), h = Math.max(1, Math.floor(H * s));
  for (const c of [view, glowCanvas]) { c.style.width = w + 'px'; c.style.height = h + 'px'; }
  glowCanvas.style.left = view.offsetLeft + 'px';
  glowCanvas.style.top = view.offsetTop + 'px';
}
window.addEventListener('resize', fit);

// ---------- Input ----------
function toGrid(ev) {
  const r = view.getBoundingClientRect();
  return { x: Math.floor((ev.clientX - r.left) / r.width * W), y: Math.floor((ev.clientY - r.top) / r.height * H) };
}
function linePoints(a, b, fn) {
  const dx = b.x - a.x, dy = b.y - a.y, n = Math.max(Math.abs(dx), Math.abs(dy), 1);
  for (let k = 0; k <= n; k++) fn(Math.round(a.x + dx * k / n), Math.round(a.y + dy * k / n));
}
function brushId() { return ui.drawing === 2 ? ui.right : ui.left; }
function paintAt(x, y) {
  const id = brushId();
  if (E[id].key === 'sample') { sampleAt(x, y); return; }
  paint(x, y, ui.brush, ui.square, id, ui.replace);
}
function strokeTo(p) {
  const id = brushId(), step = Math.max(1, Math.floor(ui.brush / 2));
  if (ui.last && E[id].state !== 'tool') {
    const dx = p.x - ui.last.x, dy = p.y - ui.last.y, n = Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / step);
    for (let k = 1; k < n; k++) paintAt(Math.round(ui.last.x + dx * k / n), Math.round(ui.last.y + dy * k / n));
  }
  ui.last = p;
}
function sampleAt(x, y) {
  if (!inb(x, y)) return;
  const t = type[y * W + x];
  if (t) { select(t, 1); ui.drawing = 0; }
}
view.addEventListener('pointerdown', (ev) => {
  ev.preventDefault();
  view.setPointerCapture(ev.pointerId);
  const p = toGrid(ev);
  ui.mouse = Object.assign(p, { inside: true });
  if (ev.button === 1) { sampleAt(p.x, p.y); return; }
  if (ev.button === 0 && !ev.shiftKey && inb(p.x, p.y) && E[type[p.y * W + p.x]].toggleId && E[ui.left].key !== 'erase') {
    const on = E[type[p.y * W + p.x]].key === 'switch';
    toggleAt(p.x, p.y);
    toast(on ? 'Switch on' : 'Switch off');
    return;
  }
  ui.drawing = ev.button === 2 ? 2 : 1;
  if (ev.shiftKey) { ui.lineStart = p; return; }
  ui.last = p;
  paintAt(p.x, p.y);
});
view.addEventListener('pointermove', (ev) => {
  const p = toGrid(ev);
  ui.mouse = Object.assign(p, { inside: true });
  if (ui.drawing && !ui.lineStart) strokeTo(p);
});
function endStroke(ev) {
  if (ui.lineStart && ui.drawing) {
    const p = toGrid(ev), step = Math.max(1, Math.floor(ui.brush / 2));
    let k = 0;
    linePoints(ui.lineStart, p, (x, y) => { if (k++ % step === 0) paintAt(x, y); });
    paintAt(p.x, p.y);
  }
  ui.lineStart = null; ui.drawing = 0; ui.last = null;
}
view.addEventListener('pointerup', endStroke);
view.addEventListener('pointercancel', endStroke);
view.addEventListener('pointerleave', (ev) => { if (!ui.drawing) ui.mouse.inside = false; });
view.addEventListener('contextmenu', (ev) => ev.preventDefault());
view.addEventListener('wheel', (ev) => { ev.preventDefault(); setBrush(ui.brush + (ev.deltaY < 0 ? 1 : -1)); }, { passive: false });

document.addEventListener('keyup', (ev) => { if (ev.key === 'Delete' || ev.key === 'Backspace') ui.deleting = false; });
window.addEventListener('blur', () => { ui.deleting = false; });
function setBrush(r) { ui.brush = Math.max(0, Math.min(40, r)); updateSel(); }

document.addEventListener('keydown', (ev) => {
  if ((ev.ctrlKey || ev.metaKey) && (ev.key === 's' || ev.key === 'S')) { ev.preventDefault(); openSaves(); return; }
  if (ev.target.tagName === 'INPUT' || ev.target.tagName === 'TEXTAREA') { if (ev.key === 'Escape') ev.target.blur(); return; }
  const k = ev.key;
  if (k === 'Escape') closeModal();
  else if (k === 'Delete' || k === 'Backspace') {
    ev.preventDefault();
    const m = ui.mouse;
    if (ev.shiftKey && m.inside && inb(m.x, m.y) && type[m.y * W + m.x]) {
      const name = E[type[m.y * W + m.x]].name, n = removeConnected(m.x, m.y);
      toast('Removed ' + n.toLocaleString() + ' ' + name);
    } else ui.deleting = true;
  }
  else if (k === ' ') { ev.preventDefault(); togglePause(); }
  else if (k === 'f' || k === 'F') { ui.paused = true; ui.stepOnce = true; syncButtons(); }
  else if (k === 'h' || k === 'H') { ui.heatView = !ui.heatView; syncButtons(); }
  else if (k === 'g' || k === 'G') { ui.glow = !ui.glow; syncButtons(); }
  else if (k === 'm' || k === 'M') { ui.fieldView = !ui.fieldView; syncButtons(); }
  else if (k === 'r' || k === 'R') { ui.replace = !ui.replace; syncButtons(); }
  else if (k === '[' || k === '-') setBrush(ui.brush - 1);
  else if (k === ']' || k === '=' || k === '+') setBrush(ui.brush + 1);
  else if (k === 'Tab') { ev.preventDefault(); ui.square = !ui.square; syncButtons(); }
  else if (k === '/') { ev.preventDefault(); $('search').focus(); }
});

// ---------- Menus ----------
const catsEl = $('cats'), elsEl = $('els'), searchEl = $('search');
for (const [key, label, icon] of CATS) {
  const b = document.createElement('button');
  b.dataset.cat = key; b.title = label;
  b.innerHTML = icon + '<span>' + label.split(' ')[0] + '</span>';
  b.addEventListener('click', () => { ui.cat = key; searchEl.value = ''; renderTray(); });
  catsEl.appendChild(b);
}
function textColor(e) { return e.light ? '#141414' : '#f3f1ec'; }
function renderTray() {
  const q = searchEl.value.trim().toLowerCase();
  const list = E.filter(e => e.cat !== 'hidden' && !e.hidden && (q ? e.name.toLowerCase().includes(q) : e.cat === ui.cat && !e.nomenu));
  elsEl.innerHTML = '';
  for (const e of list) {
    const b = document.createElement('button');
    b.className = 'el' + (e.id === ui.left ? ' selL' : '') + (e.id === ui.right ? ' selR' : '');
    b.dataset.id = e.id;
    b.textContent = e.name;
    b.style.background = e.color;
    b.style.color = textColor(e);
    elsEl.appendChild(b);
  }
  if (!list.length) elsEl.innerHTML = '<span style="color:var(--dim);padding:4px">Nothing matches "' + q.replace(/[<&]/g, '') + '"</span>';
  for (const b of catsEl.children) b.classList.toggle('on', !q && b.dataset.cat === ui.cat);
}
function describe(e) {
  let s = e.name;
  if (e.desc) s += ' — ' + e.desc;
  return s;
}
elsEl.addEventListener('click', (ev) => { const b = ev.target.closest('.el'); if (b) select(+b.dataset.id, 1); });
elsEl.addEventListener('contextmenu', (ev) => { const b = ev.target.closest('.el'); if (b) { ev.preventDefault(); select(+b.dataset.id, 2); } });
elsEl.addEventListener('mouseover', (ev) => { const b = ev.target.closest('.el'); ui.hoverText = b ? describe(E[+b.dataset.id]) : ''; });
elsEl.addEventListener('mouseleave', () => { ui.hoverText = ''; });
searchEl.addEventListener('input', renderTray);

function select(id, side) {
  if (side === 2) ui.right = id; else ui.left = id;
  for (const b of elsEl.children) {
    if (!b.dataset.id) continue;
    b.classList.toggle('selL', +b.dataset.id === ui.left);
    b.classList.toggle('selR', +b.dataset.id === ui.right);
  }
  ui.hoverText = describe(E[id]);
  updateSel();
}
function updateSel() {
  $('stSel').innerHTML = '<b class="l">L</b> ' + E[ui.left].name + '  <b class="r">R</b> ' + E[ui.right].name + '  · brush ' + ui.brush;
}

// ---------- Top bar ----------
const SPEEDS = [1, 2, 3, 0.5];
function togglePause() { ui.paused = !ui.paused; syncButtons(); }
function syncButtons() {
  $('btnPause').textContent = ui.paused ? 'Play' : 'Pause';
  $('btnPause').classList.toggle('on', ui.paused);
  $('btnHeat').classList.toggle('on', ui.heatView);
  $('btnGlow').classList.toggle('on', ui.glow);
  $('btnField').classList.toggle('on', ui.fieldView);
  $('btnReplace').classList.toggle('on', ui.replace);
  $('btnSpeed').textContent = ui.speed === 0.5 ? '½x' : ui.speed + 'x';
  $('btnShape').textContent = ui.square ? 'Square' : 'Round';
  glowCanvas.style.display = ui.glow && !ui.heatView ? '' : 'none';
}
$('btnPause').onclick = togglePause;
$('btnStep').onclick = () => { ui.paused = true; ui.stepOnce = true; syncButtons(); };
$('btnClear').onclick = () => { clearWorld(); toast('Kitchen wiped clean'); };
$('btnDemo').onclick = () => { buildDemo(); toast('Starter kitchen loaded. Erase the boards under the mint and the sodium.'); };
$('btnHeat').onclick = () => { ui.heatView = !ui.heatView; syncButtons(); };
$('btnGlow').onclick = () => { ui.glow = !ui.glow; syncButtons(); };
$('btnField').onclick = () => { ui.fieldView = !ui.fieldView; syncButtons(); };
$('btnReplace').onclick = () => { ui.replace = !ui.replace; syncButtons(); };
$('btnSpeed').onclick = () => { ui.speed = SPEEDS[(SPEEDS.indexOf(ui.speed) + 1) % SPEEDS.length]; syncButtons(); };
$('btnShape').onclick = () => { ui.square = !ui.square; syncButtons(); };
$('btnSaves').onclick = openSaves;
$('btnBook').onclick = openBook;
$('btnTable').onclick = openTable;
$('btnHelp').onclick = openHelp;

// ---------- Toasts & discoveries ----------
function toast(text, color) {
  const t = document.createElement('div');
  t.className = 'toast';
  if (color) { const i = document.createElement('i'); i.style.background = color; t.appendChild(i); }
  t.appendChild(document.createTextNode(text));
  $('toasts').appendChild(t);
  while ($('toasts').children.length > 4) $('toasts').firstChild.remove();
  setTimeout(() => t.remove(), 3200);
}
let saveKnownTimer = 0;
try {
  const saved = JSON.parse(localStorage.getItem('beanbox.known') || '[]');
  for (const k of saved) if (ID[k] !== undefined) known[ID[k]] = 1;
} catch (err) { /* fresh start */ }
function foundCount() { let n = 0; for (const id of PRODUCTS) if (known[id]) n++; return n; }
onDiscover = (id) => {
  const e = E[id];
  toast('New: ' + e.name + '  (' + foundCount() + '/' + PRODUCTS.size + ')', e.color);
  clearTimeout(saveKnownTimer);
  saveKnownTimer = setTimeout(() => {
    try { localStorage.setItem('beanbox.known', JSON.stringify(E.filter(x => known[x.id]).map(x => x.key))); } catch (err) { /* ignore */ }
  }, 1000);
};

// ---------- Modals ----------
const modal = $('modal');
function openModal(html) { $('modalBody').innerHTML = html; modal.hidden = false; }
function closeModal() { modal.hidden = true; }
$('modalClose').onclick = closeModal;
modal.addEventListener('click', (ev) => { if (ev.target === modal) closeModal(); });

function chip(id, reveal) {
  const e = E[id];
  if (!reveal && PRODUCTS.has(id) && !known[id]) return '<span class="chip unk">???</span>';
  return '<span class="chip" style="background:' + e.color + ';color:' + textColor(e) + '">' + e.name + '</span>';
}
function buildRecipes() {
  const out = [], plus = '<span class="op">+</span>', arrow = '<span class="op">→</span>';
  const results = (ra, rb, spawn) => [ra, rb, spawn].filter(k => k && k !== '=' && ID[k] !== undefined).map(k => ID[k]);
  const temps = (r) => (r.tmin !== undefined ? ' at ' + r.tmin + '°C+' : '') + (r.tmax !== undefined ? ' below ' + r.tmax + '°C' : '');
  for (const r of BB.rx) {
    if (!(r.c > 0) || ID[r.a] === undefined || ID[r.b] === undefined) continue;
    out.push({ ins: [ID[r.a], ID[r.b]], outs: results(r.ra, r.rb, r.spawn), op: plus, note: temps(r) + (r.boom ? ' 💥' : '') });
  }
  for (const r of BB.stir) {
    if (!(r.c > 0) || ID[r.a] === undefined) continue;
    const ins = r.b ? [ID[r.a], ID[r.b]] : [ID[r.a]];
    out.push({ ins, outs: results(r.ra, r.rb, r.spawn), op: plus, tool: 'Stir', note: temps(r) });
  }
  for (const c of BB.chop) if (ID[c.a] !== undefined) out.push({ ins: [ID[c.a]], outs: results(c.to, null, c.spawn), op: plus, tool: 'Chop', note: '' });
  for (const e of E) {
    if (e.hotTo !== undefined && e.hotTo > 0) out.push({ ins: [e.id], outs: [e.hotTo].concat(e.hotSp ? [e.hotSp] : []), tool: 'Heat ' + e.hotT + '°C', note: '' });
    if (e.coldTo !== undefined && e.coldTo > 0) out.push({ ins: [e.id], outs: [e.coldTo], tool: 'Chill ' + e.coldT + '°C', note: '' });
  }
  return out.filter(r => r.outs.length);
}
let RECIPES = null;
const GENERAL_RULES = [
  'Strong acids dissolve metals that sit above hydrogen in the reactivity series, giving off hydrogen and leaving a coloured salt solution. Nitric acid also eats copper and silver (brown NO2). Only aqua regia dissolves gold and platinum.',
  'Acids fizz out CO2 from carbonates: limestone, marble, chalk, seashells, eggshells, pearls, baking soda and malachite. Acids and bases neutralise each other into salt water and heat.',
  'A more reactive metal pushes a less reactive one out of its salt solution: iron in copper sulfate plates out copper, copper in silver nitrate grows silver.',
  'Lithium, sodium, potassium and cesium react with anything watery, from water to juice, making lye and hydrogen. The lower in the group, the bigger the bang. Calcium, strontium and barium fizz gently; hot magnesium does too.',
  'Metal dust, salt crystals and solutions colour flames: lithium and strontium red, sodium yellow, potassium lilac, calcium orange, copper and barium green.',
  'Strong bases turn fats into soap and glycerin, eat aluminum and zinc, and dissolve food. Sulfuric acid chars food and sugar. Hydrofluoric acid etches glass and sand. Toxic gases and liquids kill ants, flies, worms and mold.',
  'Electricity flows through metals, graphite, salt water, acids and noble gases. It splits water into hydrogen and oxygen, lights neon, heats tungsten and nichrome, sparks flammable things and electroplates metal out of salt solutions.',
  'Radiation passes through most things but lead and concrete stop it. It turns quartz smoky, topaz blue and kills living things.',
  'Fluorine attacks almost everything, even water and glass. Iridium, osmium, rhodium and ruthenium resist every acid; tantalum, niobium, zirconium and hafnium give in only to hydrofluoric acid.',
  'Magnets pull iron, steel, nickel, cobalt, magnetite and ferrofluid toward them and hold them on. Heat a magnet past its Curie point and it lets go. Electromagnets work only while powered, superconducting magnets only below -250°C. Bismuth, pyrolytic graphite and chilled superconductors are pushed away and can float. Mu-metal blocks fields; a strong field magnetises steel.',
  'Metals melt, and molten metals mix into alloys: copper and tin make bronze, copper and zinc brass, gold and silver electrum. Ores and oxides heated with charcoal smelt into molten metal.',
];
function openBook() {
  RECIPES = RECIPES || buildRecipes();
  openModal('<h2>Cookbook</h2><p>' + RECIPES.length + ' recipes across ' + E.filter(e => !e.hidden && e.cat !== 'hidden' && e.cat !== 'tools').length +
    ' elements. You have discovered <b>' + foundCount() + ' of ' + PRODUCTS.size + '</b> results. Undiscovered results show as ???.</p>' +
    '<h3>General chemistry</h3><div class="rules">' + GENERAL_RULES.map(t => '<p>' + t + '</p>').join('') + '</div><h3>Recipes</h3>' +
    '<div class="bookbar"><input id="bookq" type="search" placeholder="Filter by ingredient"><label><input type="checkbox" id="bookreveal"> Reveal everything</label></div>' +
    '<div id="booklist"></div>');
  const q = $('bookq'), rv = $('bookreveal');
  const draw = () => {
    const s = q.value.trim().toLowerCase(), reveal = rv.checked;
    const rows = [];
    for (const r of RECIPES) {
      if (s && !r.ins.concat(reveal ? r.outs : r.outs.filter(id => known[id])).some(id => E[id].name.toLowerCase().includes(s))) continue;
      rows.push('<div class="rec">' + r.ins.map(id => chip(id, true)).join('<span class="op">+</span>') +
        (r.tool ? '<span class="op">+ ' + r.tool + '</span>' : '') + '<span class="op">→</span>' +
        r.outs.map(id => chip(id, reveal)).join(' ') + (r.note ? '<span class="op">' + r.note + '</span>' : '') + '</div>');
      if (rows.length > 3000) break;
    }
    $('booklist').innerHTML = rows.join('') || '<p>No recipes use that.</p>';
  };
  q.addEventListener('input', draw); rv.addEventListener('change', draw);
  draw();
  q.focus();
}
function tablePos(z) {
  if (z === 1) return [1, 1];
  if (z === 2) return [1, 18];
  if (z <= 18) { const p = z <= 10 ? 2 : 3, o = z - (p === 2 ? 2 : 10); return [p, o <= 2 ? o : o + 10]; }
  if (z <= 54) { const p = z <= 36 ? 4 : 5; return [p, z - (p === 4 ? 18 : 36)]; }
  const p = z <= 86 ? 6 : 7, o = z - (p === 6 ? 54 : 86);
  if (o <= 2) return [p, o];
  if (o <= 17) return [p + 3, o];
  return [p, o - 14];
}
function openTable() {
  let cells = '';
  BB.periodic.forEach(([sym, key], k) => {
    const z = k + 1, [row, col] = tablePos(z), e = key && E[ID[key]];
    const style = 'grid-row:' + row + ';grid-column:' + col + ';' + (e ? 'background:' + e.color + ';color:' + textColor(e) : '');
    cells += e
      ? '<button class="pt" data-id="' + e.id + '" style="' + style + '" title="' + z + ' ' + e.name + '"><small>' + z + '</small>' + sym + '</button>'
      : '<span class="pt off" style="' + style + '" title="' + z + ': only a few atoms have ever existed"><small>' + z + '</small>' + sym + '</span>';
  });
  openModal('<h2>Periodic Table</h2><p>Click an element to draw with it. Elements 1 to 96 are all here with their real melting points, densities and reactions. ' +
    'The greyed-out ones past curium have only ever been made a few atoms at a time.</p><div class="ptable">' + cells + '</div>');
  $('modalBody').querySelector('.ptable').addEventListener('click', (ev) => {
    const b = ev.target.closest('button.pt');
    if (!b) return;
    const e = E[+b.dataset.id];
    ui.cat = e.cat; searchEl.value = ''; renderTray(); select(e.id, 1); closeModal();
  });
}
// ---------- Saves ----------
// Kitchens are kept in this browser's storage (several named slots plus an autosave) and can be
// copied out as a save code, gzip-compressed and base64-encoded, for backups or sharing.
const SAVE_KEY = 'beanbox.saves';
function readSlots() {
  try {
    const list = JSON.parse(localStorage.getItem(SAVE_KEY) || '[]');
    const old = localStorage.getItem('beanbox.save');
    if (old) { list.push({ name: 'Old save', time: Date.now(), data: 'BB1:' + old }); localStorage.removeItem('beanbox.save'); localStorage.setItem(SAVE_KEY, JSON.stringify(list)); }
    return list;
  } catch (err) { return []; }
}
function writeSlots(list) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(list)); return true; } catch (err) { return false; }
}
function toB64(buf) {
  const u = new Uint8Array(buf);
  let s = '';
  for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000));
  return btoa(s);
}
function fromB64(str) {
  const s = atob(str), u = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i);
  return u;
}
async function packSave() {
  const json = serialize();
  if (!window.CompressionStream) return 'BB1:' + json;
  const stream = new Blob([json]).stream().pipeThrough(new CompressionStream('gzip'));
  return 'BB2:' + toB64(await new Response(stream).arrayBuffer());
}
async function unpackSave(code) {
  code = code.trim();
  if (code.startsWith('BB2:')) {
    const stream = new Blob([fromB64(code.slice(4))]).stream().pipeThrough(new DecompressionStream('gzip'));
    return new Response(stream).text();
  }
  return code.startsWith('BB1:') ? code.slice(4) : code;
}
function thumbnail() {
  const c = document.createElement('canvas');
  c.width = W / 2; c.height = H / 2;
  const g = c.getContext('2d');
  g.imageSmoothingEnabled = false;
  g.drawImage(view, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', 0.75);
}
async function loadCode(code, label) {
  try {
    deserialize(await unpackSave(code));
    toast('Loaded ' + label);
    return true;
  } catch (err) {
    toast('That save could not be read. Check that the whole code was pasted.');
    return false;
  }
}
async function saveSlot(name, auto) {
  const data = await packSave(), list = readSlots().filter(x => auto ? !x.auto : x.name !== name);
  list.unshift({ name, time: Date.now(), thumb: thumbnail(), data, auto: !!auto });
  if (!writeSlots(list)) { if (!auto) toast('Browser storage is full or blocked. Delete an old save, or copy a save code instead.'); return false; }
  return true;
}
const esc = (t) => String(t).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
function renderSlots() {
  const list = readSlots(), box = $('slotList');
  if (!box) return;
  box.innerHTML = list.length ? list.map((x, k) =>
    '<div class="slot" data-k="' + k + '">' + (x.thumb ? '<img alt="" src="' + x.thumb + '">' : '<div class="nothumb"></div>') +
    '<div class="slotinfo"><b>' + esc(x.auto ? 'Autosave' : x.name) + '</b><span>' + new Date(x.time).toLocaleString() + '</span></div>' +
    '<div class="slotbtns"><button data-act="load">Load</button>' + (x.auto ? '' : '<button data-act="over">Overwrite</button>') +
    '<button data-act="del">Delete</button></div></div>').join('')
    : '<p>No saved kitchens yet. Name this one and press Save.</p>';
}
function openSaves() {
  openModal('<h2>Saves</h2><p>Saves stay in this browser, along with an autosave every minute. Copy a save code to back a kitchen up or move it to another device.</p>' +
    '<div class="savebar"><input id="saveName" type="text" maxlength="40" placeholder="Name this kitchen"><button id="saveNew">Save</button></div>' +
    '<div id="slotList" class="slots"></div>' +
    '<h3>Save codes</h3><div class="savebar"><button id="copyCode">Copy save code</button><button id="loadCodeBtn">Load pasted code</button></div>' +
    '<textarea id="codeBox" rows="3" placeholder="Paste a save code here, then press Load pasted code"></textarea>');
  renderSlots();
  const name = $('saveName');
  name.value = 'Kitchen ' + new Date().toLocaleDateString();
  $('saveNew').onclick = async () => {
    const n = name.value.trim() || 'Untitled kitchen';
    if (await saveSlot(n, false)) { toast('Saved "' + n + '"'); renderSlots(); }
  };
  $('slotList').onclick = async (ev) => {
    const btn = ev.target.closest('button'), row = ev.target.closest('.slot');
    if (!btn || !row) return;
    const list = readSlots(), k = +row.dataset.k, slot = list[k];
    if (!slot) return;
    if (btn.dataset.act === 'load') { if (await loadCode(slot.data, '"' + (slot.auto ? 'Autosave' : slot.name) + '"')) closeModal(); }
    else if (btn.dataset.act === 'over') { if (await saveSlot(slot.name, false)) { toast('Updated "' + slot.name + '"'); renderSlots(); } }
    else if (btn.dataset.act === 'del') {
      if (btn.dataset.confirm) { list.splice(k, 1); writeSlots(list); renderSlots(); toast('Save deleted'); }
      else { btn.dataset.confirm = '1'; btn.textContent = 'Really delete?'; }
    }
  };
  $('copyCode').onclick = async () => {
    const code = await packSave(), box = $('codeBox');
    box.value = code;
    try { await navigator.clipboard.writeText(code); toast('Save code copied (' + Math.round(code.length / 1024) + ' KB)'); }
    catch (err) { box.focus(); box.select(); toast('Code shown below. Select it and copy.'); }
  };
  $('loadCodeBtn').onclick = async () => {
    const code = $('codeBox').value;
    if (!code.trim()) { toast('Paste a save code into the box first'); return; }
    if (await loadCode(code, 'pasted kitchen')) closeModal();
  };
}
async function autosave() {
  if (!modal.hidden || particleCount() === 0) return;
  await saveSlot('Autosave', true);
}
setInterval(autosave, 60000);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') autosave(); });

function openHelp() {
  openModal('<h2>How to cook</h2><div class="help-grid">' +
    '<kbd>Left drag</kbd><span>Draw the left (red) element</span>' +
    '<kbd>Right drag</kbd><span>Draw the right (blue) element, the Eraser by default</span>' +
    '<kbd>Shift + drag</kbd><span>Draw a straight line</span>' +
    '<kbd>Middle click</kbd><span>Pick up the element under the cursor</span>' +
    '<kbd>Delete</kbd><span>Hold to erase under the cursor; Shift + Delete removes the whole connected piece</span>' +
    '<kbd>Click a Switch</kbd><span>Flip it on or off</span>' +
    '<kbd>Wheel</kbd> <span>Brush size (also <kbd>[</kbd> <kbd>]</kbd>)</span>' +
    '<kbd>Space</kbd><span>Pause / play</span><kbd>F</kbd><span>Step one frame</span>' +
    '<kbd>M</kbd><span>Magnetic field view</span><kbd>H</kbd><span>Heat view</span><kbd>G</kbd><span>Fire glow</span><kbd>R</kbd><span>Replace mode (paint over things)</span>' +
    '<kbd>Ctrl + S</kbd><span>Saves</span><kbd>Tab</kbd><span>Round / square brush</span><kbd>/</kbd><span>Search elements</span></div>' +
    '<h3>Getting started</h3><p>Build a pan out of Steel Pan on top of a Burner, add Cooking Oil and Popcorn Kernels, and watch them pop. ' +
    'Dry beans soak in water, then cook once the water boils. Cooked beans release Bean Gas — keep it away from flames. ' +
    'Use Stir to whip cream, emulsify mayo and mash potatoes; use Chop to crack eggs, grind wheat and juice fruit. ' +
    'Yeast eats sugar and makes dough rise. A Grease Fire hates water: smother it with salt or baking soda instead.</p>' +
    '<h3>Chemistry and electricity</h3><p>Try acids on metals, sodium in water, metal dust in a flame, an iron nail in copper sulfate, or a Battery touching Copper Wire that runs into a glass tube of Neon. ' +
    'Stir Rust with Aluminum Dust for thermite and light it with burning magnesium. Smelt ores by heating them with Charcoal. Use the Zap tool to electrify things directly. ' +
    'The Cookbook lists the general chemistry rules plus every specific recipe.</p>' +
    '<h3>Power and gas</h3><p>Electric appliances (burners, oven coil, fridge and freezer coils, blast chiller, microwave, induction hob, stirrer) only work while powered: touch them to a Battery or Wall Outlet or run Copper Wire from one. They glow while on. ' +
    'Everything that carries current glows while powered. Put a Switch in a wire and click it to turn things on and off. A Gas Ring starts unlit: light it with the Lighter or any flame, and put it out with water.</p>' +
    '<h3>Ant colonies</h3><p>Fill a glass tank with Soil, drop in a Queen Ant and some Ants, and leave food on top. Workers dig tunnels, pile dirt into an anthill and carry food down; the queen digs a den and lays eggs that hatch into more workers.</p>' +
    '<h3>Magnets</h3><p>Drop Iron Filings near a Neodymium Magnet and they jump to it. Chill a Superconductor with Liquid Nitrogen and it floats over a magnet. ' +
    'Wire an Electromagnet to a Battery for a magnet you can switch off. An Induction Hob heats steel and cast-iron pans but not copper or glass. Field view (M) shows where the field reaches; a Field Compass shows which way it points.</p>' +
    '<h3>Temperatures</h3><p>Everything carries heat. Metal pans spread it, glass and the counter block it. Switch on Heat view to see it. ' +
    'Most foods cook between 60 and 200°C and burn past about 230°C.</p>');
}

// ---------- Main loop ----------
let fpsFrames = 0, fpsTime = performance.now(), fps = 60, halfTick = 0;
function hoverInfo() {
  if (ui.hoverText) return ui.hoverText;
  const m = ui.mouse;
  if (!m.inside || !inb(m.x, m.y)) return '';
  const i = m.y * W + m.x, t = type[i];
  return (t ? E[t].name : 'Air') + ' · ' + temp[i].toFixed(1) + '°C';
}
function loop(now) {
  if (ui.drawing && !ui.lineStart && ui.mouse.inside) paintAt(ui.mouse.x, ui.mouse.y);
  if (ui.deleting && ui.mouse.inside) applyTool('erase', ui.mouse.x, ui.mouse.y, ui.brush, ui.square);
  if (!ui.paused) {
    if (ui.speed < 1) { if (++halfTick % 2 === 0) step(); }
    else for (let s = 0; s < ui.speed; s++) step();
  } else if (ui.stepOnce) { step(); ui.stepOnce = false; }
  render();
  fpsFrames++;
  if (now - fpsTime > 500) {
    fps = Math.round(fpsFrames * 1000 / (now - fpsTime)); fpsFrames = 0; fpsTime = now;
    $('stInfo').textContent = fps + ' fps · ' + partCount.toLocaleString() + ' parts · ' + foundCount() + '/' + PRODUCTS.size + ' found';
  }
  $('stHover').textContent = hoverInfo();
  requestAnimationFrame(loop);
}

renderTray();
updateSel();
syncButtons();
fit();
requestAnimationFrame(() => { fit(); requestAnimationFrame(loop); });
setTimeout(() => toast('Welcome to Bean Box. Pick an element and start drawing, or press Demo for a starter kitchen.'), 400);
