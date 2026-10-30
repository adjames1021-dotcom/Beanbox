// Bean Box — falling-sand simulation: movement, heat, reactions and special behaviours.
'use strict';

const W = 384, H = 216, N = W * H, AMBIENT = 22;
const ST_EMPTY = 0, ST_GAS = 1, ST_FIRE = 2, ST_LIQ = 3, ST_POW = 4, ST_SOLID = 5, ST_WALL = 6, ST_LIFE = 7, ST_SPECIAL = 8, ST_TOOL = 9;
const STATE_CODE = { empty: 0, gas: 1, fire: 2, liquid: 3, powder: 4, solid: 5, wall: 6, life: 7, special: 8, tool: 9 };
// Neighbour order: (d + 4) & 7 is always the opposite direction.
const DX = [1, 1, 0, -1, -1, -1, 0, 1];
const DY = [0, 1, 1, 1, 0, -1, -1, -1];

const E = BB.els, NE = E.length, ID = {};
E.forEach((e, i) => { e.id = i; ID[e.key] = i; });

const ST = new Uint8Array(NE), DENS = new Float32Array(NE), COND = new Float32Array(NE);
const VISC = new Float32Array(NE), IGN = new Uint8Array(NE);
const CONDUCT = new Uint8Array(NE), WET = new Uint8Array(NE), ORG = new Uint8Array(NE);
const PRODUCTS = new Set();

// ---------- Compile element definitions ----------
const DEFAULTS = {
  empty: { cond: 0.02 }, tool: {}, special: { cond: 0 }, wall: { cond: 0 }, solid: { cond: 0.15 }, life: { cond: 0.1 },
  gas: { dens: 0.7, cond: 0.05, rise: 0.6 }, fire: { dens: 0.5, cond: 0.6, rise: 0.8 },
  liquid: { dens: 10, visc: 0, cond: 0.2 }, powder: { dens: 25, slide: 1, cond: 0.12 },
};

function idOf(k, ctx) {
  if (k === '' || k === null || k === undefined) return 0;
  if (k === '=') return -1;
  const i = ID[k];
  if (i === undefined) { console.warn('Bean Box: unknown element "' + k + '" in', ctx); return null; }
  return i;
}
function hexRGB(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function pack(r, g, b) { return (255 << 24) | (Math.min(255, b) << 16) | (Math.min(255, g) << 8) | Math.min(255, r); }

for (const e of E) {
  const d = DEFAULTS[e.state];
  for (const k in d) if (e[k] === undefined) e[k] = d[k];
  if (e.t0 === undefined) e.t0 = AMBIENT;
  if (e.state === 'liquid' && e.spread === undefined) e.spread = e.visc >= 0.6 ? 1 : e.visc >= 0.3 ? 2 : 4;
  ST[e.id] = STATE_CODE[e.state];
  DENS[e.id] = e.dens || 0; COND[e.id] = e.cond || 0; VISC[e.id] = e.visc || 0; IGN[e.id] = e.ignites ? 1 : 0;
  CONDUCT[e.id] = e.econ ? 1 : 0;
  WET[e.id] = e.state === 'liquid' && (e.w || e.acid || e.base) ? 1 : 0;
  ORG[e.id] = e.fd || e.sw || e.org ? 1 : 0;
  if (e.wrx) {
    const w = e.wrx;
    w.toId = w.to === '=' ? -1 : idOf(w.to, e.key + '.wrx') || 0;
    w.nbId = w.nb === '=' ? -1 : idOf(w.nb || '', e.key + '.wrx') || 0;
    w.fireId = w.fire ? idOf(w.fire, e.key) || 0 : 0;
    [w.toId, w.nbId, w.fireId].forEach(t => t > 0 && PRODUCTS.add(t));
  }
  if (e.electro) {
    const x = e.electro;
    x.toId = x.to === '=' ? -1 : idOf(x.to, e.key + '.electro') || 0;
    x.spawnIds = [].concat(x.spawn || []).map(k => idOf(k, e.key) || 0).filter(Boolean);
    if (x.toId > 0) PRODUCTS.add(x.toId); x.spawnIds.forEach(t => PRODUCTS.add(t));
  }
  if (e.fireKey) { e.fireId = idOf(e.fireKey, e.key) || 0; if (e.fireId) PRODUCTS.add(e.fireId); }
  if (e.deadTo !== undefined) e.deadId = idOf(e.deadTo, e.key) || 0;
  if (e.hot) {
    const to = idOf(e.hot[1], e.key + '.hot');
    if (to !== null) { e.hotT = e.hot[0]; e.hotTo = to; e.hotC = e.hot[2]; e.hotSp = e.hot[3] ? idOf(e.hot[3], e.key) || 0 : 0; e.hotPop = !!e.hot[4]; PRODUCTS.add(to); if (e.hotSp) PRODUCTS.add(e.hotSp); }
  }
  if (e.cold) {
    const to = idOf(e.cold[1], e.key + '.cold');
    if (to !== null) { e.coldT = e.cold[0]; e.coldTo = to; e.coldC = e.cold[2]; e.coldSp = e.cold[3] ? idOf(e.cold[3], e.key) || 0 : 0; PRODUCTS.add(to); }
  }
  if (e.burn) { if (e.ign === undefined) e.ign = 400; e.burnId = e.burnTo ? idOf(e.burnTo, e.key) : 0; if (!e.burnId) e.burnId = null; else PRODUCTS.add(e.burnId); }
  if (e.life) { e.lifeMin = e.life[0]; e.lifeRange = e.life[1] - e.life[0]; e.dieId = idOf(e.die || '', e.key) || 0; if (e.dieId) PRODUCTS.add(e.dieId); }
  if (e.decay) { e.decayC = e.decay[0]; const to = Array.isArray(e.decay[1]) ? e.decay[1] : [e.decay[1]]; e.decayTo = to.map(k => idOf(k, e.key) || 0); e.decayTo.forEach(t => t && PRODUCTS.add(t)); }
  if (e.emit) { const id = idOf(e.emit[0], e.key + '.emit'); if (id) { e.emitId = id; e.emitC = e.emit[1]; e.emitT = e.emit[2]; PRODUCTS.add(id); } }
  if (e.absorb) e.absorbId = idOf(e.absorb, e.key);
  if (e.grow) { const g = e.grow; g.stemId = idOf(g.stem); g.leafId = g.leaf ? idOf(g.leaf) : 0; g.topId = idOf(g.top); PRODUCTS.add(g.stemId); PRODUCTS.add(g.topId); if (g.leafId) PRODUCTS.add(g.leafId); }
  if (e.beh === 'proof') e.auxInit = 3;
  // Colour palette: 8 shades per element, dimmed by alpha for see-through stuff.
  const cols = e.colors || [e.color], a = e.alpha || 1;
  e.pal = new Uint32Array(8);
  for (let k = 0; k < 8; k++) {
    const [r, g, b] = hexRGB(cols[k % cols.length]);
    const f = a * (1 + (((k * 5) % 3) - 1) * 0.05);
    e.pal[k] = pack(r * f | 0, g * f | 0, b * f | 0);
  }
  if (e.state === 'fire') {
    e.firePal = new Uint32Array(16);
    for (let k = 0; k < 16; k++) {
      const p = k / 15 * (cols.length - 1), lo = Math.floor(p), hi = Math.min(cols.length - 1, lo + 1), f = p - lo;
      const c1 = hexRGB(cols[lo]), c2 = hexRGB(cols[hi]);
      e.firePal[k] = pack(c1[0] + (c2[0] - c1[0]) * f | 0, c1[1] + (c2[1] - c1[1]) * f | 0, c1[2] + (c2[2] - c1[2]) * f | 0);
    }
  }
  if (e.plasma) { const p = hexRGB(e.plasma); e.plasmaC = pack(p[0], p[1], p[2]); }
  const [r, g, b] = hexRGB(e.color);
  e.rgb = [r, g, b];
  e.light = (0.299 * r + 0.587 * g + 0.114 * b) > 140;
}

function addRule(map, owner, other, rule) {
  if (!owner[map]) owner[map] = new Map();
  const m = owner[map];
  if (!m.has(other)) m.set(other, []);
  m.get(other).push(rule);
}
function compileRules(list, map) {
  for (const r of list) {
    const a = idOf(r.a, 'recipe'), b = r.b === null ? null : idOf(r.b, 'recipe');
    const ra = r.ra === null ? -1 : idOf(r.ra, 'recipe ' + r.a), rb = r.rb === null || r.rb === undefined ? -1 : idOf(r.rb, 'recipe ' + r.a);
    if (a === null || a < 1 || b === null && r.b !== null || ra === null || rb === null || !(r.c > 0)) continue;
    const spawn = r.spawn ? idOf(r.spawn, 'recipe spawn') || 0 : 0;
    const base = { c: r.c, tmin: r.tmin === undefined ? -1e9 : r.tmin, tmax: r.tmax === undefined ? 1e9 : r.tmax, spawn, boom: r.boom || 0, heat: r.heat || 0, src: r };
    [ra, rb, spawn].forEach(t => t > 0 && PRODUCTS.add(t));
    if (b === null) { E[a].stirSelf = Object.assign({ ra, rb: -1 }, base); continue; }
    addRule(map, E[a], b, Object.assign({ ra, rb, popA: !!r.pop, popB: false }, base));
    if (a !== b) addRule(map, E[b], a, Object.assign({ ra: rb, rb: ra, popA: false, popB: !!r.pop }, base));
  }
}
compileRules(BB.rx, 'rx');
compileRules(BB.stir, 'stirRx');
for (const c of BB.chop) {
  const a = idOf(c.a, 'chop'), to = idOf(c.to, 'chop ' + c.a);
  if (!a || to === null) continue;
  E[a].chopTo = to; E[a].chopSp = c.spawn ? idOf(c.spawn, 'chop') || 0 : 0;
  PRODUCTS.add(to); if (E[a].chopSp) PRODUCTS.add(E[a].chopSp);
}
// Metals, salts and the general chemistry flags
const METAL_IDX = {};
BB.metals.forEach((m, k) => { m.idx = k; METAL_IDX[m.key] = k; m.dustId = ID[m.dust]; m.moltenId = ID[m.molten]; });
const SALT_OF = new Map();
for (const s of BB.salts) {
  const sol = ID[s.sol], crys = ID[s.crys], mi = METAL_IDX[s.m];
  if (sol || crys) SALT_OF.set(s.kind + mi, sol || crys);
  if (crys) Object.assign(E[crys], { crystal: 1, saltM: s.m, saltKind: s.kind, solId: sol || 0 });
  if (sol) Object.assign(E[sol], { saltM: s.m, saltKind: s.kind, crysId: crys || 0 });
  if (sol) PRODUCTS.add(sol); if (crys) PRODUCTS.add(crys);
}
for (const e of E) {
  if (e.mKey !== undefined) e.mIdx = METAL_IDX[e.mKey];
  if (e.saltM !== undefined) e.saltIdx = METAL_IDX[e.saltM];
  if (e.baseM !== undefined) e.baseIdx = METAL_IDX[e.baseM];
  if (e.carbM !== undefined) e.carbIdx = METAL_IDX[e.carbM];
  e.isSolution = e.saltIdx !== undefined && e.state === 'liquid';
  e.gen = !!(e.wrx || e.acid || e.base >= 2 || e.toxic || e.isSolution || e.fluor);
}
const saltFor = (kind, mi) => (kind && mi !== undefined ? SALT_OF.get(kind + mi) || 0 : 0);
PRODUCTS.delete(0); PRODUCTS.delete(-1);
for (const id of [...PRODUCTS]) if (E[id].hidden || E[id].state === 'tool') PRODUCTS.delete(id);

const FIRE = ID.fire, FLAME = ID.flame, SMOKE = ID.smoke, WATER = ID.water, MOLD = ID.mold, SPARK = ID.spark;
const MWAVE = ID.mwave, ANT = ID.ant, FLY = ID.fly, WORM = ID.worm, DEADBUG = ID.deadbug;
const SOIL = ID.soil, COMPOST = ID.compost, LN2 = ID.ln2;
const HYDROGEN = ID.hydrogen, OXYGEN = ID.oxygen, NO2 = ID.no2, CHLORINE = ID.chlorine, SALTWATER = ID.saltwater;
const BURNTFOOD = ID.burntfood, STEAM = ID.steam, SOAP = ID.soap, GLYCERIN = ID.glycerin, RAD = ID.radiation, H2S = ID.hydrogensulfide;
const CO2 = ID.co2, HF = ID.hf, FLUORIDE = ID.fluoride, OZONE = ID.ozone;

// ---------- World state ----------
const type = new Uint16Array(N), temp = new Float32Array(N).fill(AMBIENT);
const life = new Int32Array(N), aux = new Int32Array(N), shade = new Uint8Array(N), stamp = new Uint8Array(N);
// Electricity: 0 idle, 1-3 charged (3 = fresh), 10-13 cooling down
const elec = new Uint8Array(N), plasmaGlow = new Uint8Array(N);
let elecLive = false;
const known = new Uint8Array(NE);
let frame = 1, tick = 0, onDiscover = null;

function discover(id) { if (known[id]) return; known[id] = 1; if (onDiscover && PRODUCTS.has(id)) onDiscover(id); }

function initCell(i, id, keepTemp) {
  const e = E[id];
  type[i] = id; shade[i] = (Math.random() * 8) | 0; stamp[i] = frame;
  life[i] = e.lifeMin !== undefined ? e.lifeMin + ((Math.random() * (e.lifeRange + 1)) | 0) : 0;
  aux[i] = e.ray ? (Math.random() * 8) | 0 : e.auxInit || 0;
  elec[i] = 0;
  if (!keepTemp) temp[i] = e.t0;
  else if (e.hotStart && temp[i] < e.t0) temp[i] = e.t0;
}
function clearCell(i) { type[i] = 0; life[i] = 0; aux[i] = 0; elec[i] = 0; }
function become(i, id) {
  if (id === 0) { clearCell(i); return; }
  initCell(i, id, true);
  if (!known[id]) discover(id);
}
function swap(i, j) {
  let t = type[i]; type[i] = type[j]; type[j] = t;
  const f = temp[i]; temp[i] = temp[j]; temp[j] = f;
  t = life[i]; life[i] = life[j]; life[j] = t;
  t = aux[i]; aux[i] = aux[j]; aux[j] = t;
  t = shade[i]; shade[i] = shade[j]; shade[j] = t;
  t = elec[i]; elec[i] = elec[j]; elec[j] = t;
  stamp[i] = frame; stamp[j] = frame;
}
const SPAWN_ORDER = [6, 5, 7];
function spawnNear(x, y, id, t) {
  for (let k = 0; k < 5; k++) {
    const d = k < 3 ? SPAWN_ORDER[k] : (Math.random() * 8) | 0;
    const nx = x + DX[d], ny = y + DY[d];
    if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
    const j = ny * W + nx;
    if (type[j] !== 0) continue;
    initCell(j, id, false);
    const e = E[id];
    temp[j] = e.hotStart ? Math.max(t, e.t0) : (e.t0 < -30 ? e.t0 : t);
    if (!known[id]) discover(id);
    return j;
  }
  return -1;
}

function ignite(i, x, y, e) {
  if (e.boom) { clearCell(i); explode(x, y, e.boom); return; }
  const fire = e.fireId || FIRE, bt = e.burnT || 500;
  become(i, e.burnId || fire);
  if (temp[i] < bt) temp[i] = bt;
  if (e.burnT) {
    // Fierce burners (metals, thermite, phosphorus) throw heat at their neighbours so the burn spreads
    for (let d = 0; d < 8; d++) {
      const nx = x + DX[d], ny = y + DY[d];
      if (!inb(nx, ny)) continue;
      const j = ny * W + nx;
      if (type[j] && ST[type[j]] !== ST_WALL && temp[j] < bt) temp[j] = Math.min(bt, temp[j] + bt * 0.25);
    }
  }
  if (Math.random() < 0.5) spawnNear(x, y, fire, Math.max(650, bt));
}

function explode(cx, cy, r) {
  const r2 = r * r;
  for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
    if (dx * dx + dy * dy > r2) continue;
    const x = cx + dx, y = cy + dy;
    if (x < 0 || y < 0 || x >= W || y >= H) continue;
    const j = y * W + x, t = type[j];
    if (t === 0) { if (Math.random() < 0.75) initCell(j, FIRE, false); continue; }
    const s = ST[t];
    if (s === ST_WALL) continue;
    temp[j] += 250;
    if ((s === ST_POW || s === ST_LIQ) && Math.random() < 0.6) {
      const tx = cx + dx * 2, ty = cy + dy * 2 - 1;
      if (tx >= 0 && ty >= 0 && tx < W && ty < H && type[ty * W + tx] === 0) swap(j, ty * W + tx);
    }
  }
}

function popUp(i, x, y) {
  let cur = i, cx = x, cy = y;
  const h = 3 + ((Math.random() * 9) | 0);
  for (let k = 0; k < h; k++) {
    const nx = cx + ((Math.random() * 3) | 0) - 1, ny = cy - 1;
    if (ny < 0 || nx < 0 || nx >= W) break;
    const j = ny * W + nx, tj = type[j];
    if (tj !== 0 && ST[tj] !== ST_GAS && ST[tj] !== ST_LIQ) break;
    swap(cur, j); cur = j; cx = nx; cy = ny;
  }
}

function react(i, j, x, y, nx, ny, r) {
  if (r.ra !== -1) become(i, r.ra);
  if (r.rb !== -1) become(j, r.rb);
  if (r.heat) { temp[i] += r.heat; temp[j] += r.heat; }
  if (r.spawn) spawnNear(x, y, r.spawn, temp[i]);
  if (r.popA) popUp(i, x, y);
  if (r.popB) popUp(j, nx, ny);
  if (r.boom) explode(x, y, r.boom);
}
function transition(i, x, y, to, sp, pop) {
  become(i, to);
  if (sp) spawnNear(x, y, sp, temp[i]);
  if (pop) popUp(i, x, y);
}

// ---------- Special behaviours ----------
const inb = (x, y) => x >= 0 && y >= 0 && x < W && y < H;
const BEH = {
  fixed(i, x, y, e) { if (!e.fixMin || temp[i] < e.fixT) temp[i] = e.fixT; return false; },
  gasstove(i, x, y) {
    temp[i] = 60;
    if (y > 0 && type[i - W] === 0 && Math.random() < 0.6) initCell(i - W, FLAME, false);
    return true;
  },
  faucet(i, x, y) {
    if (y < H - 1 && type[i + W] === 0 && Math.random() < 0.3) { initCell(i + W, WATER, false); temp[i + W] = 16; }
    return true;
  },
  drain(i, x, y) {
    for (let d = 0; d < 8; d += 2) {
      const nx = x + DX[d], ny = y + DY[d];
      if (!inb(nx, ny)) continue;
      const j = ny * W + nx, s = ST[type[j]];
      if (s !== ST_EMPTY && s !== ST_WALL && s !== ST_SOLID) clearCell(j);
    }
    return true;
  },
  spout(i, x, y) {
    const c = aux[i];
    if (!c) {
      for (let d = 0; d < 8; d++) {
        const nx = x + DX[d], ny = y + DY[d];
        if (!inb(nx, ny)) continue;
        const t = type[ny * W + nx], s = ST[t];
        if (t && s !== ST_WALL && s !== ST_SOLID && s !== ST_SPECIAL) { aux[i] = t; break; }
      }
      return true;
    }
    if (Math.random() < 0.25) {
      const d = (Math.random() * 8) | 0, nx = x + DX[d], ny = y + DY[d];
      if (inb(nx, ny) && type[ny * W + nx] === 0) initCell(ny * W + nx, c, false);
    }
    return true;
  },
  microwave(i, x, y) {
    if (Math.random() < 0.35) {
      const d = (Math.random() * 8) | 0, nx = x + DX[d], ny = y + DY[d];
      if (inb(nx, ny) && type[ny * W + nx] === 0) { const j = ny * W + nx; initCell(j, MWAVE, false); aux[j] = d; }
    }
    return true;
  },
  mwave(i, x, y, e) {
    if (--life[i] <= 0) { clearCell(i); return true; }
    const d = aux[i], nx = x + DX[d], ny = y + DY[d];
    if (!inb(nx, ny)) { clearCell(i); return true; }
    const j = ny * W + nx, tj = type[j];
    if (tj === 0 || ST[tj] === ST_GAS) { swap(i, j); return true; }
    if (tj === MWAVE) return true;
    const te = E[tj];
    if (te.metal || ST[tj] === ST_WALL || te.beh === 'microwave') {
      const rules = e.rx && e.rx.get(tj);
      if (rules && Math.random() < rules[0].c) { become(i, SPARK); temp[i] = 1000; return true; }
      aux[i] = (d + 4 + ((Math.random() * 3) | 0) - 1) & 7;
      return true;
    }
    temp[j] += te.w ? 8 : 2;
    const rules = te.rx && te.rx.get(MWAVE);
    if (rules && Math.random() < rules[0].c) { react(j, i, nx, ny, x, y, rules[0]); return true; }
    if (Math.random() < 0.3) { clearCell(i); return true; }
    const nx2 = nx + DX[d], ny2 = ny + DY[d];
    if (inb(nx2, ny2) && type[ny2 * W + nx2] === 0) swap(i, ny2 * W + nx2); else clearCell(i);
    return true;
  },
  battery(i, x, y) {
    if (tick % 8 === 0) {
      for (let d = 0; d < 8; d += 2) {
        const nx = x + DX[d], ny = y + DY[d];
        if (!inb(nx, ny)) continue;
        const j = ny * W + nx;
        if (CONDUCT[type[j]] && elec[j] === 0) { elec[j] = 3; elecLive = true; }
      }
    }
    return true;
  },
  rad(i, x, y) {
    if (--life[i] <= 0) { clearCell(i); return true; }
    const d = aux[i];
    let nx = x + DX[d], ny = y + DY[d];
    if (!inb(nx, ny)) { clearCell(i); return true; }
    const j = ny * W + nx, tj = type[j];
    if (tj === 0 || ST[tj] === ST_GAS) { swap(i, j); return true; }
    if (tj === RAD) return true;
    const te = E[tj];
    if (te.shield && Math.random() < te.shield) { clearCell(i); return true; }
    const rules = te.rx && te.rx.get(RAD);
    if (rules && Math.random() < rules[0].c) { react(j, i, nx, ny, x, y, rules[0]); return true; }
    if (te.alive && Math.random() < 0.3) become(j, te.deadId || 0);
    temp[j] += 0.5;
    if (Math.random() < 0.04) { clearCell(i); return true; }
    for (let k = 0; k < 6; k++) {
      nx += DX[d]; ny += DY[d];
      if (!inb(nx, ny)) break;
      const jj = ny * W + nx;
      if (type[jj] === 0) { swap(i, jj); return true; }
    }
    clearCell(i);
    return true;
  },
  sponge(i, x, y, e) {
    if (Math.random() < 0.3) {
      const d = (Math.random() * 8) | 0, nx = x + DX[d], ny = y + DY[d];
      if (inb(nx, ny)) {
        const j = ny * W + nx, t = type[j];
        if (t && ST[t] === ST_LIQ && !IGN[t] && t !== LN2) { clearCell(j); become(i, e.absorbId); }
      }
    }
    return false;
  },
  proof(i, x, y) {
    if (aux[i] > 0 && Math.random() < 0.01) {
      const d = (Math.random() * 8) | 0, nx = x + DX[d], ny = y + DY[d];
      if (inb(nx, ny) && type[ny * W + nx] === 0) {
        const j = ny * W + nx;
        initCell(j, type[i], true); temp[j] = temp[i]; life[j] = life[i]; aux[j] = aux[i] - 1; aux[i]--;
        if (Math.random() < 0.3) spawnNear(x, y, ID.co2, temp[i]);
      }
    }
    return false;
  },
  grow(i, x, y, e) {
    const g = e.grow;
    if (aux[i] === 0) aux[i] = 2 + g.h[0] + ((Math.random() * (g.h[1] - g.h[0])) | 0);
    if (temp[i] < 5 || temp[i] > 45) return true;
    if (Math.random() > (g.wide ? 0.15 : 0.06)) return true;
    if (aux[i] <= 1) {
      become(i, g.topId);
      for (let k = 0; k < g.fruit; k++) spawnNear(x, y, g.topId, temp[i]);
      return true;
    }
    const dx = Math.random() < 0.25 ? ((Math.random() * 3) | 0) - 1 : 0, nx = x + dx, ny = y - 1;
    if (ny < 0 || nx < 0 || nx >= W) { aux[i] = 1; return true; }
    const j = ny * W + nx;
    if (type[j] !== 0) { if (Math.random() < 0.1) aux[i] = 1; return true; }
    initCell(j, type[i], true); aux[j] = aux[i] - 1; temp[j] = temp[i];
    become(i, g.stemId);
    if (g.wide) for (const s of [-1, 1]) if (inb(x + s, y) && type[i + s] === 0 && Math.random() < 0.6) initCell(i + s, g.stemId, true);
    if (g.branch && Math.random() < g.branch) {
      const s = Math.random() < 0.5 ? -1 : 1, reach = g.wide ? 2 + ((Math.random() * 4) | 0) : 1;
      for (let k = 1; k <= reach; k++) {
        if (!inb(x + s * k, y) || type[i + s * k] !== 0) break;
        initCell(i + s * k, g.leafId || g.stemId, true);
      }
    }
    return true;
  },
  mold(i, x, y) {
    if (Math.random() < 0.004) {
      const d = (Math.random() * 8) | 0, nx = x + DX[d], ny = y + DY[d];
      if (inb(nx, ny)) {
        const j = ny * W + nx, t = type[j];
        if (t && E[t].fd && temp[j] > 2 && temp[j] < 50) become(j, MOLD);
      }
    }
    return false;
  },
  ant(i, x, y) {
    const T = temp[i];
    if (T > 55 || T < -5) { become(i, DEADBUG); return true; }
    if (Math.random() < 0.4) return true;
    if (y < H - 1) {
      const b = i + W, tb = type[b], s = ST[tb];
      if (tb === 0 || s === ST_GAS) { swap(i, b); return true; }
      if (s === ST_LIQ) { if (Math.random() < 0.3) swap(i, b); return true; }
    }
    const d = (Math.random() * 8) | 0, nx = x + DX[d], ny = y + DY[d];
    if (inb(nx, ny)) {
      const j = ny * W + nx, tj = type[j];
      if (tj && E[tj].sw && ST[tj] !== ST_LIFE && Math.random() < 0.04) {
        clearCell(j);
        if (Math.random() < 0.15) spawnNear(x, y, ANT, T);
        return true;
      }
    }
    if (aux[i] === 0) aux[i] = Math.random() < 0.5 ? 1 : 2;
    const sx = aux[i] === 1 ? 1 : -1, fx = x + sx;
    if (fx < 0 || fx >= W) { aux[i] = 3 - aux[i]; return true; }
    const f = i + sx;
    if (type[f] === 0) { swap(i, f); return true; }
    if (y > 0 && type[f - W] === 0 && type[i - W] === 0) { swap(i, f - W); return true; }
    if (y > 0 && type[i - W] === 0 && Math.random() < 0.5) { swap(i, i - W); return true; }
    aux[i] = 3 - aux[i];
    return true;
  },
  fly(i, x, y) {
    const T = temp[i];
    if (T > 55 || T < -2) { become(i, DEADBUG); return true; }
    if (Math.random() < 0.3) return true;
    const d = (Math.random() * 8) | 0, nx = x + DX[d], ny = y + DY[d];
    if (!inb(nx, ny)) return true;
    const j = ny * W + nx, tj = type[j];
    if (tj === 0) { swap(i, j); return true; }
    if ((E[tj].cat === 'fruit' || tj === MOLD) && Math.random() < 0.03) {
      if (Math.random() < 0.3) spawnNear(x, y, FLY, T);
      if (tj !== MOLD && Math.random() < 0.3) become(j, MOLD);
    }
    return true;
  },
  worm(i, x, y) {
    const T = temp[i];
    if (T > 50 || T < -2) { become(i, DEADBUG); return true; }
    if (Math.random() < 0.5) return true;
    if (y < H - 1) { const b = i + W, tb = type[b]; if (tb === 0 || ST[tb] === ST_GAS) { swap(i, b); return true; } }
    const d = (Math.random() * 8) | 0, nx = x + DX[d], ny = y + DY[d];
    if (!inb(nx, ny)) return true;
    const j = ny * W + nx, tj = type[j];
    if (tj === SOIL || tj === COMPOST) { swap(i, j); return true; }
    if (tj && tj !== WORM && (E[tj].fd || tj === ID.usedgrounds || tj === ID.eggshell || tj === MOLD || tj === ID.ash) && Math.random() < 0.05) {
      become(j, COMPOST);
      if (Math.random() < 0.05) spawnNear(x, y, WORM, T);
      return true;
    }
    if (tj === 0 && ny < H - 1 && type[j + W] !== 0) swap(i, j);
    return true;
  },
};

// ---------- Movement ----------
function sinkable(t, j) {
  const tj = type[j];
  if (tj === 0) return true;
  const s = ST[tj];
  if (s === ST_GAS || s === ST_FIRE) return true;
  if (s === ST_LIQ) return DENS[t] > DENS[tj] && Math.random() < 0.5 - VISC[tj] * 0.4;
  return false;
}
function movePowder(i, x, y, t, e) {
  if (y < H - 1) {
    const j = i + W;
    if (sinkable(t, j)) { swap(i, j); return; }
    if (e.slide > 0 && Math.random() < e.slide) {
      const d = Math.random() < 0.5 ? -1 : 1;
      if (x + d >= 0 && x + d < W && sinkable(t, j + d)) { swap(i, j + d); return; }
      if (x - d >= 0 && x - d < W && sinkable(t, j - d)) { swap(i, j - d); return; }
    }
  }
  if (y > 0) {
    const a = i - W, ta = type[a];
    if (ta !== 0 && ST[ta] === ST_LIQ && DENS[ta] > DENS[t] && Math.random() < 0.25) swap(i, a);
  }
}
function liqPass(t, j) {
  const tj = type[j];
  if (tj === 0) return true;
  const s = ST[tj];
  if (s === ST_GAS || s === ST_FIRE) return true;
  return s === ST_LIQ && tj !== t && DENS[t] > DENS[tj] && Math.random() < 0.3;
}
function moveLiquid(i, x, y, t, e) {
  if (e.visc > 0 && Math.random() < e.visc) return;
  if (y < H - 1) {
    const j = i + W;
    if (liqPass(t, j)) { swap(i, j); return; }
    const d = Math.random() < 0.5 ? -1 : 1;
    if (x + d >= 0 && x + d < W && liqPass(t, j + d)) { swap(i, j + d); return; }
    if (x - d >= 0 && x - d < W && liqPass(t, j - d)) { swap(i, j - d); return; }
  }
  const d = Math.random() < 0.5 ? -1 : 1;
  let best = -1;
  for (let k = 1; k <= e.spread; k++) {
    const nx = x + d * k;
    if (nx < 0 || nx >= W) break;
    const tj = type[i + d * k];
    if (tj === 0 || ST[tj] === ST_GAS) best = i + d * k; else break;
  }
  if (best >= 0) swap(i, best);
}
function moveGas(i, x, y, t, e) {
  if (y > 0) {
    const a = i - W, ta = type[a];
    if (ta !== 0 && ST[ta] === ST_LIQ && Math.random() < 0.5) { swap(i, a); return; }
  }
  const dy = Math.random() < e.rise ? (e.dens < 1 ? -1 : 1) : 0;
  let dx = ((Math.random() * 3) | 0) - 1;
  if (dx === 0 && dy === 0) dx = Math.random() < 0.5 ? -1 : 1;
  const nx = x + dx, ny = y + dy;
  if (nx < 0 || nx >= W || ny < 0 || ny >= H) return;
  const j = ny * W + nx, tj = type[j];
  if (tj === 0) { swap(i, j); return; }
  const s = ST[tj];
  if ((s === ST_GAS || s === ST_FIRE) && tj !== t && Math.random() < 0.25) swap(i, j);
}

// ---------- General chemistry ----------
// Reactions driven by element flags rather than listed pairs: water-reactive things, acids,
// bases, poisons and dissolved metal salts. Returns true when something happened.
function chemistry(i, j, x, y, nx, ny, e, tj) {
  const te = E[tj], r = Math.random();
  const w = e.wrx;
  if (w && WET[tj] && tj !== e.id && tj !== w.toId && (w.tmin === undefined || temp[i] >= w.tmin)) {
    if (r >= w.c) return false;
    if (w.nbId !== -1) become(j, w.nbId);
    if (w.toId !== -1) become(i, w.toId);
    if (w.heat) { temp[i] += w.heat; temp[j] += w.heat; }
    if (w.fireId) spawnNear(x, y, w.fireId, 800);
    if (w.boom && Math.random() < w.boomC) explode(x, y, w.boom);
    return true;
  }
  if (e.fluor) {
    // Fluorine attacks nearly everything: water, metals, glass, anything that burns
    if (ST[tj] === ST_WALL || te.plasma || tj === e.id || r >= 0.06) return false;
    if (WET[tj]) { become(j, HF); become(i, OXYGEN); return true; }
    if (te.metal || te.metalForm) { become(j, FLUORIDE); clearCell(i); temp[j] += 300; spawnNear(nx, ny, FIRE, 900); return true; }
    if (te.si) { become(j, 0); clearCell(i); return true; }
    if (te.burn || ORG[tj] || te.alive) { clearCell(i); if (te.burn) ignite(j, nx, ny, te); else become(j, FIRE); return true; }
    return false;
  }
  if (e.toxic && te.alive) {
    if (r < 0.08) { become(j, te.deadId || 0); return true; }
    return false;
  }
  const s = e.acid;
  if (s) {
    if (te.base) {
      if (r >= 0.15) return false;
      become(j, WATER); become(i, saltFor(e.acidKind, te.baseIdx) || WATER);
      temp[i] += 15 * Math.min(s, te.base);
      return true;
    }
    if (te.hypo) {
      if (r >= 0.1) return false;
      become(j, CHLORINE); become(i, SALTWATER);
      return true;
    }
    if (te.carb) {
      if (r >= (s >= 2 ? 0.06 : 0.02)) return false;
      become(j, CO2);
      if (Math.random() < 0.4) become(i, saltFor(e.acidKind, te.carbIdx) || WATER);
      return true;
    }
    const mult = s >= 3 ? 1 : s === 2 ? 0.3 : 0.04;
    if (te.metalForm && te.mIdx !== undefined) {
      const m = BB.metals[te.mIdx], rr = m.react;
      if (m.resist === 'all' || (m.resist === 'hf' && !e.etch)) return false;
      const ok = s >= 4 || (s >= 3 && (rr >= 3 || (e.acidKind === 'no3' && rr >= 1))) || (rr >= 5 && (s >= 2 || te.metalForm > 1)) || (e.etch && m.resist === 'hf');
      if (!ok) return false;
      if (r >= 0.004 * mult * (te.metalForm === 2 ? 4 : te.metalForm === 3 ? 2 : 1) * (1 + rr / 3)) return false;
      become(j, e.acidKind === 'no3' || s >= 4 ? NO2 : HYDROGEN);
      become(i, saltFor(e.acidKind, te.mIdx) || (s >= 3 ? SALTWATER : WATER));
      temp[i] += 10;
      return true;
    }
    if (te.oxide || te.ore) {
      if (r >= 0.01 * mult * (s >= 3 ? 1 : 5)) return false;
      const salt = saltFor(e.acidKind, te.mIdx);
      if (te.sulfide) { become(j, H2S); become(i, salt || WATER); }
      else { become(j, salt || 0); become(i, WATER); }
      return true;
    }
    if (te.si && e.etch) {
      if (r >= 0.02) return false;
      become(j, 0); become(i, WATER);
      return true;
    }
    if (ORG[tj] && e.charOrg) {
      if (r >= 0.02) return false;
      become(j, BURNTFOOD); temp[j] += 40;
      spawnNear(nx, ny, STEAM, 110);
      return true;
    }
    return false;
  }
  if (e.base >= 2) {
    if (te.fat) {
      if (r >= 0.02) return false;
      become(j, SOAP);
      if (Math.random() < 0.4) become(i, GLYCERIN);
      return true;
    }
    if (te.metalForm && (te.mKey === 'aluminum' || te.mKey === 'zinc' || te.mKey === 'gallium' || te.mKey === 'tin')) {
      if (r >= (te.metalForm === 2 ? 0.02 : 0.004)) return false;
      become(j, HYDROGEN); temp[i] += 10;
      return true;
    }
    if (te.alive) { if (r < 0.05) { become(j, te.deadId || 0); return true; } return false; }
    if (ORG[tj] && e.base >= 3) { if (r < 0.003) { become(j, 0); return true; } return false; }
    return false;
  }
  if (e.isSolution) {
    if (te.metalForm && te.mIdx !== undefined && te.mIdx !== e.saltIdx) {
      const mine = BB.metals[e.saltIdx].react, theirs = BB.metals[te.mIdx].react;
      if (theirs <= mine || theirs > 8) return false;
      if (r >= (te.metalForm === 2 ? 0.03 : 0.006)) return false;
      become(j, BB.metals[e.saltIdx].dustId);
      become(i, saltFor(e.saltKind, te.mIdx) || WATER);
      return true;
    }
    if (tj === e.crysId && temp[i] < 40 && r < 0.002) { become(i, tj); return true; }
  }
  return false;
}

// ---------- Electricity ----------
const pendingElec = [];
function electricity() {
  if (!elecLive) return;
  let live = false;
  for (let i = 0; i < N; i++) {
    if (plasmaGlow[i]) { plasmaGlow[i]--; live = true; }
    const v = elec[i];
    if (v === 0) continue;
    live = true;
    if (v >= 10) { elec[i] = v === 10 ? 0 : v - 1; continue; }
    const t = type[i];
    if (!CONDUCT[t]) { elec[i] = 0; continue; }
    if (v === 3) {
      const x = i % W, y = (i / W) | 0, e = E[t];
      if (e.plasmaC) plasmaGlow[i] = 12;
      for (let d = 0; d < 8; d += 2) {
        const nx = x + DX[d], ny = y + DY[d];
        if (!inb(nx, ny)) continue;
        const j = ny * W + nx, tj = type[j];
        if (tj === 0) continue;
        if (CONDUCT[tj]) { if (elec[j] === 0) pendingElec.push(j); continue; }
        const te = E[tj];
        if (WET[tj] && Math.random() < 0.03) become(j, Math.random() < 0.67 ? HYDROGEN : OXYGEN);
        else if (tj === OXYGEN && Math.random() < 0.05) become(j, OZONE);
        else if (te.burn && Math.random() < 0.15) ignite(j, nx, ny, te);
        else if (te.alive && Math.random() < 0.2) become(j, te.deadId || 0);
      }
      if (e.chargeHeat) temp[i] = Math.min(3500, temp[i] + e.chargeHeat);
      else if (e.metal) temp[i] += 0.2;
      const ex = e.electro;
      if (ex && Math.random() < ex.c) {
        if (ex.spawnIds.length) spawnNear(x, y, ex.spawnIds[(Math.random() * ex.spawnIds.length) | 0], temp[i]);
        if (ex.toId !== -1) become(i, ex.toId);
      }
    }
    elec[i] = v === 1 ? 13 : v - 1;
  }
  for (const j of pendingElec) if (elec[j] === 0 && CONDUCT[type[j]]) { elec[j] = 3; live = true; }
  pendingElec.length = 0;
  elecLive = live;
}

// ---------- Per-cell update ----------
function update(i, x, y, t) {
  const e = E[t], s = ST[t];
  if (s === ST_WALL) return;
  if (e.beh) { if (BEH[e.beh](i, x, y, e)) return; if (type[i] !== t) return; }
  if (e.selfHeat) temp[i] += e.selfHeat;
  const T = temp[i];
  if (e.burn && T > e.ign && Math.random() < e.burn * 0.5) { ignite(i, x, y, e); return; }
  if (e.hotC !== undefined && T > e.hotT && Math.random() < e.hotC) { transition(i, x, y, e.hotTo, e.hotSp, e.hotPop); return; }
  if (e.coldC !== undefined && T < e.coldT && Math.random() < e.coldC) { transition(i, x, y, e.coldTo, e.coldSp, false); return; }
  if (e.lifeMin !== undefined && --life[i] <= 0) {
    if (s === ST_FIRE && e.smoke && Math.random() < e.smoke) become(i, SMOKE); else become(i, e.dieId);
    return;
  }
  if (e.decayC && Math.random() < e.decayC) { become(i, e.decayTo[(Math.random() * e.decayTo.length) | 0]); return; }
  if (e.spoil && T > 4 && T < 50 && Math.random() < e.spoil) { become(i, MOLD); return; }
  if (e.emitId && T >= e.emitT && Math.random() < e.emitC) spawnNear(x, y, e.emitId, T);
  if (e.rx || e.burn || e.gen) {
    const d = (Math.random() * 8) | 0, nx = x + DX[d], ny = y + DY[d];
    if (nx >= 0 && ny >= 0 && nx < W && ny < H) {
      const j = ny * W + nx, tj = type[j];
      if (tj !== 0) {
        // A flame only lights things it is hot enough for: thermite and diamond need far more than a candle.
        if (e.burn && IGN[tj] && temp[j] >= e.ign * 0.7 && Math.random() < e.burn) { ignite(i, x, y, e); return; }
        const rules = e.rx && e.rx.get(tj);
        if (rules) {
          for (let k = 0; k < rules.length; k++) {
            const r = rules[k];
            if (Math.random() >= r.c) continue;
            const avg = (T + temp[j]) * 0.5;
            if (avg < r.tmin || avg > r.tmax) continue;
            react(i, j, x, y, nx, ny, r);
            return;
          }
        } else if (e.gen && chemistry(i, j, x, y, nx, ny, e, tj)) return;
      }
    }
  }
  if (s === ST_POW) movePowder(i, x, y, t, e);
  else if (s === ST_LIQ) moveLiquid(i, x, y, t, e);
  else if (s === ST_GAS || s === ST_FIRE) moveGas(i, x, y, t, e);
}

function conduct() {
  for (let y = 0; y < H; y++) {
    const row = y * W;
    for (let x = 0; x < W; x++) {
      const i = row + x, ti = type[i], ci = COND[ti];
      if (ci === 0) continue;
      if (x < W - 1) {
        const j = i + 1, cj = COND[type[j]], c = ci < cj ? ci : cj;
        if (c > 0) { const d = (temp[j] - temp[i]) * c * 0.25; temp[i] += d; temp[j] -= d; }
      }
      if (y < H - 1) {
        const j = i + W, cj = COND[type[j]], c = ci < cj ? ci : cj;
        if (c > 0) { const d = (temp[j] - temp[i]) * c * 0.25; temp[i] += d; temp[j] -= d; }
      }
      if (ti === 0) temp[i] += (AMBIENT - temp[i]) * 0.015;
    }
  }
}

function step() {
  frame = frame >= 255 ? 1 : frame + 1;
  tick++;
  for (let y = H - 1; y >= 0; y--) {
    const row = y * W, rev = (y + tick) & 1;
    for (let k = 0; k < W; k++) {
      const x = rev ? W - 1 - k : k, i = row + x, t = type[i];
      if (t === 0 || stamp[i] === frame) continue;
      update(i, x, y, t);
    }
  }
  electricity();
  conduct();
}

// ---------- Brushes & tools ----------
function forBrush(cx, cy, r, square, fn) {
  const rr = r * r + r;
  for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
    if (!square && dx * dx + dy * dy > rr) continue;
    const x = cx + dx, y = cy + dy;
    if (x >= 0 && y >= 0 && x < W && y < H) fn(y * W + x, x, y);
  }
}
function stirCell(i, x, y) {
  const t = type[i], s = ST[t];
  if (s !== ST_POW && s !== ST_LIQ && s !== ST_GAS) return;
  const d = (Math.random() * 8) | 0, nx = x + DX[d], ny = y + DY[d];
  if (!inb(nx, ny)) return;
  const j = ny * W + nx, tj = type[j], sj = ST[tj];
  const e = E[t], ss = e.stirSelf;
  if (ss && Math.random() < ss.c && temp[i] >= ss.tmin && temp[i] <= ss.tmax) {
    become(i, ss.ra);
    if (ss.spawn) spawnNear(x, y, ss.spawn, temp[i]);
    return;
  }
  const rules = tj && e.stirRx && e.stirRx.get(tj);
  if (rules) {
    const r = rules[0];
    if (Math.random() < r.c) { react(i, j, x, y, nx, ny, r); return; }
  }
  if (sj === ST_EMPTY || sj === ST_POW || sj === ST_LIQ || sj === ST_GAS) swap(i, j);
}
function applyTool(key, cx, cy, r, square) {
  forBrush(cx, cy, r, square, (i, x, y) => {
    const t = type[i];
    switch (key) {
      case 'erase': clearCell(i); temp[i] = AMBIENT; break;
      case 'zap':
        if (CONDUCT[t]) { if (elec[i] === 0) { elec[i] = 3; elecLive = true; } }
        else if (t === 0 && Math.random() < 0.003) initCell(i, SPARK, false);
        break;
      case 'heat': if (ST[t] !== ST_WALL) temp[i] = Math.min(4000, temp[i] + 4); break;
      case 'cool': if (ST[t] !== ST_WALL) temp[i] = Math.max(-273, temp[i] - 4); break;
      case 'stir': if (t && Math.random() < 0.35) stirCell(i, x, y); break;
      case 'chop': {
        const e = E[t];
        if (t && e.chopTo !== undefined && Math.random() < 0.12) { become(i, e.chopTo); if (e.chopSp) spawnNear(x, y, e.chopSp, temp[i]); }
        break;
      }
      case 'lighter':
        if (Math.random() < 0.06) {
          if (t === 0) initCell(i, FIRE, false);
          else if (E[t].burn) ignite(i, x, y, E[t]);
          else if (ST[t] !== ST_WALL) temp[i] += 30;
        }
        break;
    }
  });
}
function paint(cx, cy, r, square, id, replace) {
  const e = E[id];
  if (e.state === 'tool') { applyTool(e.key, cx, cy, r, square); return; }
  const s = ST[id];
  const fill = s === ST_GAS || s === ST_FIRE ? 0.25 : s === ST_LIFE ? 0.02 : s === ST_SOLID || s === ST_WALL ? 1 : s === ST_SPECIAL ? 0.1 : 0.55;
  forBrush(cx, cy, r, square, (i) => {
    if (type[i] !== 0 && (!replace || type[i] === id)) return;
    if (fill < 1 && Math.random() > fill) return;
    initCell(i, id, false);
    if (id === MWAVE) aux[i] = (Math.random() * 8) | 0;
  });
}

// ---------- World helpers ----------
function clearWorld() { type.fill(0); temp.fill(AMBIENT); life.fill(0); aux.fill(0); elec.fill(0); plasmaGlow.fill(0); }
function fillRect(x0, y0, x1, y1, key, chance) {
  const id = ID[key];
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    if (!inb(x, y) || (chance !== undefined && Math.random() > chance)) continue;
    initCell(y * W + x, id, false);
  }
}
function buildDemo() {
  clearWorld();
  const F = H - 8;
  fillRect(0, F, W - 1, H - 1, 'counter');
  // Soup pot on a burner
  fillRect(22, F - 3, 110, F - 1, 'burner');
  fillRect(20, F - 6, 112, F - 4, 'steel');
  fillRect(20, F - 70, 22, F - 7, 'steel'); fillRect(110, F - 70, 112, F - 7, 'steel');
  fillRect(23, F - 44, 109, F - 7, 'water');
  fillRect(34, F - 16, 52, F - 8, 'potato_cut', 0.5);
  fillRect(58, F - 16, 76, F - 8, 'carrot_cut', 0.5);
  fillRect(82, F - 16, 100, F - 8, 'onion_cut', 0.5);
  // Popcorn in an oiled cast-iron pan
  fillRect(150, F - 3, 236, F - 1, 'burner');
  fillRect(146, F - 5, 240, F - 4, 'castiron');
  fillRect(146, F - 14, 147, F - 6, 'castiron'); fillRect(239, F - 14, 240, F - 6, 'castiron');
  fillRect(148, F - 8, 238, F - 6, 'oil');
  fillRect(152, F - 22, 234, F - 16, 'popcornkernel', 0.35);
  // A glass of cola with a mint waiting above it, and a marshmallow over a gas ring
  fillRect(272, F - 2, 324, F - 1, 'glass');
  fillRect(272, F - 60, 273, F - 3, 'glass'); fillRect(323, F - 60, 324, F - 3, 'glass');
  fillRect(274, F - 48, 322, F - 3, 'cola');
  fillRect(270, F - 64, 326, F - 63, 'board');
  fillRect(296, F - 67, 300, F - 65, 'mint');
  fillRect(340, F - 1, 372, F - 1, 'gasstove');
  fillRect(352, F - 46, 360, F - 40, 'marshmallow');
  fillRect(344, F - 39, 368, F - 38, 'steel');
  // Neon sign powered by a battery
  fillRect(22, 26, 28, 33, 'battery');
  fillRect(29, 24, 29, 35, 'wire');
  fillRect(30, 24, 150, 24, 'glass'); fillRect(30, 35, 150, 35, 'glass'); fillRect(150, 24, 150, 35, 'glass');
  fillRect(30, 25, 149, 34, 'neon');
  // A tank of water with a lump of sodium on a shelf above it
  fillRect(170, 112, 250, 113, 'glass');
  fillRect(170, 70, 171, 111, 'glass'); fillRect(249, 70, 250, 111, 'glass');
  fillRect(172, 84, 248, 111, 'water');
  fillRect(198, 62, 222, 63, 'board');
  fillRect(207, 59, 212, 61, 'sodium_dust');
  // An iron nail in copper sulfate: copper plates out, the solution turns green
  fillRect(272, 128, 316, 129, 'glass');
  fillRect(272, 96, 273, 127, 'glass'); fillRect(315, 96, 316, 127, 'glass');
  fillRect(274, 102, 314, 127, 'copper_so4');
  fillRect(292, 90, 295, 124, 'iron');
}

// ---------- Save / load ----------
function serialize() {
  const keys = [], idx = new Map(), runs = [];
  let prev = -1, n = 0;
  const flush = () => { if (n) runs.push(prev + ':' + n); };
  for (let i = 0; i < N; i++) {
    const t = type[i];
    let k = idx.get(t);
    if (k === undefined) { k = keys.length; keys.push(E[t].key); idx.set(t, k); }
    if (k === prev) n++; else { flush(); prev = k; n = 1; }
  }
  flush();
  const temps = [];
  let tp = null, tn = 0;
  for (let i = 0; i < N; i++) {
    const v = Math.round(temp[i]);
    if (v === tp) tn++; else { if (tn) temps.push(tp + ':' + tn); tp = v; tn = 1; }
  }
  if (tn) temps.push(tp + ':' + tn);
  return JSON.stringify({ v: 1, w: W, h: H, keys, cells: runs.join(','), temps: temps.join(',') });
}
function deserialize(str) {
  const d = JSON.parse(str);
  if (d.w !== W || d.h !== H) throw new Error('Saved kitchen has a different size.');
  clearWorld();
  const ids = d.keys.map(k => ID[k] || 0);
  let i = 0;
  for (const part of d.cells.split(',')) {
    const [k, n] = part.split(':').map(Number);
    const id = ids[k];
    for (let c = 0; c < n && i < N; c++, i++) if (id) initCell(i, id, false);
  }
  i = 0;
  for (const part of d.temps.split(',')) {
    const [v, n] = part.split(':').map(Number);
    for (let c = 0; c < n && i < N; c++, i++) temp[i] = v;
  }
}
