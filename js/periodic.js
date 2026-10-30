// Bean Box — the remaining elements of the periodic table and the table itself.
// Metals live in metals.js; this file adds the non-metals and halogens that are not food or minerals.
'use strict';

const pgas = (k, n, c, p) => el(k, n, c, 'gases', 'gas', p);

// ---------- Halogens ----------
pgas('fluorine', 'Fluorine', '#e8f0a0', { dens: 1.3, rise: 0.3, alpha: 0.35, toxic: 1, fluor: 1, oxidizer: 1, decay: [0.0004, ''], desc: 'The most reactive element. Sets metal, wood and even water on fire.' });
el('bromine', 'Bromine', '#8a1a0a', 'chem', 'liquid', { dens: 31, toxic: 1, alpha: 0.95, hot: [59, 'brominevapor', 0.02], cold: [-7, 'solidbromine', 0.02], emit: ['brominevapor', 0.004, -6], desc: 'The only non-metal that is liquid at room temperature. Gives off choking orange vapor.' });
el('solidbromine', 'Frozen Bromine', '#5a1008', 'chem', 'powder', { dens: 34, slide: 0.2, hot: [-7, 'bromine', 0.02], nomenu: 1 });
pgas('brominevapor', 'Bromine Vapor', '#c0501a', { dens: 5.5, rise: 0.3, alpha: 0.4, toxic: 1, cold: [55, 'bromine', 0.01], decay: [0.0006, ''] });
el('fluoride', 'Metal Fluoride', '#f4f4f0', 'salts', 'powder', { dens: 30, slide: 0.5, nomenu: 1 });
el('xef2', 'Xenon Difluoride', '#f8f8ff', 'salts', 'powder', { dens: 44, slide: 0.4, oxidizer: 1, wrx: { to: 'xenon', nb: 'hf', c: 0.05 }, desc: 'Proof that even a noble gas will react with fluorine.' });
R('fluorine', 'xenon', 'xef2', '', 0.03);
R('fluorine', 'hydrogen', 'hf', 'hf', 0.4, { boom: 2 });
R('bromine', 'aluminum_dust', 'fire', 'fire', 0.2, { heat: 600 });
R('bromine', 'foil', 'fire', 'fire', 0.1, { heat: 600 });
R('bromine', 'potassium_dust', 'fire', '', 0.3, { boom: 3 });
R('bromine', 'sodium_dust', 'fire', '', 0.1, { boom: 2 });

// ---------- Phosphorus ----------
el('whitephosphorus', 'White Phosphorus', '#f4f0d0', 'chem', 'powder', { dens: 18, slide: 0.1, glow: 1, burn: 0.4, ign: 30, burnTo: 'phosphorussmoke', fireKey: 'yellowfire', burnT: 800, decay: [0.00005, 'redphosphorus'], colors: ['#f4f0d0', '#e8f8d0', '#f8f4e0'], desc: 'Bursts into flame above 30°C in air. Keep it under water. Faintly glows green.' });
el('redphosphorus', 'Red Phosphorus', '#a8302a', 'chem', 'powder', { dens: 22, slide: 0.5, burn: 0.15, ign: 260, burnTo: 'phosphorussmoke', burnT: 800, colors: ['#a8302a', '#982820', '#b83a34'], desc: 'Safe phosphorus from the side of a matchbox. Chop it for a spark.' });
pgas('phosphorussmoke', 'Phosphorus Smoke', '#f4f4f0', { dens: 1.5, rise: 0.3, alpha: 0.85, life: [200, 400], die: '', desc: 'Dense white smoke that turns into phosphoric acid in water.' });
el('phosphoric', 'Phosphoric Acid', '#f0f0e0', 'chem', 'liquid', { dens: 18.8, visc: 0.4, w: 1, acid: 2, alpha: 0.85, desc: 'The tang in cola. Converts rust into a black protective coat.' });
el('ironphosphate', 'Iron Phosphate', '#2a2a30', 'ores', 'powder', { dens: 30, slide: 0.05, nomenu: 1 });
R('phosphorussmoke', 'water', '', 'phosphoric', 0.1, { heat: 40 });
R('phosphoric', 'rust', '=', 'ironphosphate', 0.05);
R('whitephosphorus', 'oxygen', 'fire', '', 0.5);
R('whitephosphorus', 'radiation', 'redphosphorus', '', 0.3);
C('redphosphorus', 'redphosphorus', 'spark');
BB.by.cola.desc = 'Fizzy, sweet and a little acidic (phosphoric acid). Do NOT drop a mint candy in it.';

// ---------- Oxygen, nitrogen, radon ----------
el('lox', 'Liquid Oxygen', '#9ac8f0', 'frozen', 'liquid', { dens: 11.4, t0: -183, cond: 0.3, alpha: 0.85, oxidizer: 1, hot: [-180, 'oxygen', 0.04], desc: 'Pale blue and -183°C. Anything that burns, burns violently in it.' });
pgas('ozone', 'Ozone', '#a0c8ff', { dens: 1.7, rise: 0.3, alpha: 0.25, toxic: 1, oxidizer: 1, decay: [0.002, 'oxygen'], desc: 'Sharp-smelling form of oxygen made by sparks.' });
pgas('radon', 'Radon', '#f0e0e0', { dens: 9.7, rise: 0.3, alpha: 0.12, econ: 1, plasma: '#ff6a40', emit: ['radiation', 0.01, -273], decay: [0.0003, 'polonium_dust'], desc: 'Heavy radioactive noble gas. Decays into polonium.' });
pgas('arsenicvapor', 'Arsenic Vapor', '#c8c8b0', { dens: 10, rise: 0.3, alpha: 0.2, toxic: 1, cold: [600, 'arsenic_dust', 0.02] });
pgas('osmiumtetroxide', 'Osmium Tetroxide', '#f0f0c0', { dens: 8.7, rise: 0.3, alpha: 0.2, toxic: 1, decay: [0.001, 'osmium_dust'] });
el('hydroxide', 'Metal Hydroxide', '#f2f2ee', 'chem', 'powder', { dens: 25, slide: 0.4, base: 1, nomenu: 1 });
el('activatedcarbon', 'Activated Carbon', '#1a1a1c', 'chem', 'powder', { dens: 12, slide: 0.4, desc: 'Full of tiny pores. Soaks up poisonous gases.' });
R('lox', 'fire', 'oxygen', 'fire', 0.5, { boom: 2 });
R('lox', 'charcoal', '=', 'ember', 0.05, { tmin: -100 });
R('lox', 'water', 'oxygen', 'ice', 0.2);
R('oxygen', 'ln2', 'lox', '=', 0.1);
R('charcoal', 'steam', 'activatedcarbon', '', 0.02, { tmin: 600 });
Object.assign(BB.by.nitrogen, { name: 'Nitrogen', electro: { to: '=', spawn: 'no2', c: 0.002 }, desc: 'Most of the air. Sparks fix it into NO2.' });
for (const e of BB.els) if (e.state === 'gas' && e.toxic) R('activatedcarbon', e.key, '=', '', 0.3);

// ---------- Periodic table ----------
// [symbol, Bean Box element key]. Elements past curium only exist a few atoms at a time.
BB.periodic = [
  ['H', 'hydrogen'], ['He', 'helium'], ['Li', 'lithium'], ['Be', 'beryllium'], ['B', 'boron'], ['C', 'graphite'], ['N', 'nitrogen'], ['O', 'oxygen'],
  ['F', 'fluorine'], ['Ne', 'neon'], ['Na', 'sodium'], ['Mg', 'magnesium'], ['Al', 'aluminum'], ['Si', 'silicon'], ['P', 'whitephosphorus'], ['S', 'sulfur'],
  ['Cl', 'chlorine'], ['Ar', 'argon'], ['K', 'potassium'], ['Ca', 'calcium'], ['Sc', 'scandium'], ['Ti', 'titanium'], ['V', 'vanadium'], ['Cr', 'chromium'],
  ['Mn', 'manganese'], ['Fe', 'iron'], ['Co', 'cobalt'], ['Ni', 'nickel'], ['Cu', 'copper'], ['Zn', 'zinc'], ['Ga', 'gallium'], ['Ge', 'germanium'],
  ['As', 'arsenic'], ['Se', 'selenium'], ['Br', 'bromine'], ['Kr', 'krypton'], ['Rb', 'rubidium'], ['Sr', 'strontium'], ['Y', 'yttrium'], ['Zr', 'zirconium'],
  ['Nb', 'niobium'], ['Mo', 'molybdenum'], ['Tc', 'technetium'], ['Ru', 'ruthenium'], ['Rh', 'rhodium'], ['Pd', 'palladium'], ['Ag', 'silver'], ['Cd', 'cadmium'],
  ['In', 'indium'], ['Sn', 'tin'], ['Sb', 'antimony'], ['Te', 'tellurium'], ['I', 'iodine'], ['Xe', 'xenon'], ['Cs', 'cesium'], ['Ba', 'barium'],
  ['La', 'lanthanum'], ['Ce', 'cerium'], ['Pr', 'praseodymium'], ['Nd', 'neodymium'], ['Pm', 'promethium'], ['Sm', 'samarium'], ['Eu', 'europium'], ['Gd', 'gadolinium'],
  ['Tb', 'terbium'], ['Dy', 'dysprosium'], ['Ho', 'holmium'], ['Er', 'erbium'], ['Tm', 'thulium'], ['Yb', 'ytterbium'], ['Lu', 'lutetium'], ['Hf', 'hafnium'],
  ['Ta', 'tantalum'], ['W', 'tungsten'], ['Re', 'rhenium'], ['Os', 'osmium'], ['Ir', 'iridium'], ['Pt', 'platinum'], ['Au', 'gold'], ['Hg', 'mercury'],
  ['Tl', 'thallium'], ['Pb', 'lead'], ['Bi', 'bismuth'], ['Po', 'polonium'], ['At', 'astatine'], ['Rn', 'radon'], ['Fr', 'francium'], ['Ra', 'radium'],
  ['Ac', 'actinium'], ['Th', 'thorium'], ['Pa', 'protactinium'], ['U', 'uranium'], ['Np', 'neptunium'], ['Pu', 'plutonium'], ['Am', 'americium'], ['Cm', 'curium'],
  ['Bk'], ['Cf'], ['Es'], ['Fm'], ['Md'], ['No'], ['Lr'], ['Rf'], ['Db'], ['Sg'], ['Bh'], ['Hs'], ['Mt'], ['Ds'], ['Rg'], ['Cn'], ['Nh'], ['Fl'], ['Mc'], ['Lv'], ['Ts'], ['Og'],
];
