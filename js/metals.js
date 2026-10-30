// Bean Box — metals, alloys, oxides, ores and metal salts.
// Each metal gets a block, a dust and a molten form. Acids, water, flames and other metals
// react with them through the general chemistry rules in engine.js (reactivity series below).
'use strict';

BB.metals = [];
BB.salts = [];

function tri(hex) {
  const n = parseInt(hex.slice(1), 16), f = (k) => '#' + [16, 8, 0].map(s => Math.max(0, Math.min(255, Math.round(((n >> s) & 255) * k)))).map(v => v.toString(16).padStart(2, '0')).join('');
  return [hex, f(0.92), f(1.08)];
}
// key, name, block colors, melting °C, density (water = 10), heat conductivity,
// reactivity (0 = noble .. 11 = most reactive), flame-test colour, oxide
const METALS = [
  ['iron', 'Iron', ['#8a8d91', '#7e8185', '#96999d'], 1538, 79, 0.5, 5, 'orangefire', 'rust'],
  ['copper', 'Copper', ['#c27a3c', '#b56e34', '#cf8648'], 1085, 89, 0.95, 2, 'greenfire', 'patina'],
  ['aluminum', 'Aluminum', ['#c6cace', '#babec2', '#d2d6da'], 660, 27, 0.85, 6, 'whitefire', 'alumina'],
  ['gold', 'Gold', ['#e8b923', '#d8a818', '#f4c83a'], 1064, 193, 0.9, 0, null, null],
  ['silver', 'Silver', ['#c8ccd2', '#bcc0c6', '#d8dce2'], 962, 105, 0.98, 1, null, 'tarnish'],
  ['platinum', 'Platinum', ['#d6d6d2', '#cacac6', '#e2e2de'], 1768, 214, 0.6, 0, null, null],
  ['tin', 'Tin', ['#b6babe', '#aaaeb2', '#c2c6ca'], 232, 73, 0.5, 3, 'bluefire', 'tinoxide'],
  ['zinc', 'Zinc', ['#98a2aa', '#8c969e', '#a4aeb6'], 420, 71, 0.8, 5.5, 'greenfire', 'zincoxide'],
  ['lead', 'Lead', ['#686c76', '#5c606a', '#747882'], 327, 113, 0.3, 3, 'bluefire', 'litharge'],
  ['nickel', 'Nickel', ['#aea898', '#a29c8c', '#bab4a4'], 1455, 89, 0.7, 4.5, null, 'nickeloxide'],
  ['cobalt', 'Cobalt', ['#8a94a6', '#7e889a', '#96a0b2'], 1495, 89, 0.6, 4.3, null, 'cobaltblue'],
  ['chromium', 'Chromium', ['#c4c8d0', '#b8bcc4', '#d0d4dc'], 1907, 72, 0.6, 4, null, 'chromiumoxide'],
  ['titanium', 'Titanium', ['#8c8f94', '#808388', '#989ba0'], 1668, 45, 0.2, 4, 'whitefire', 'titania'],
  ['tungsten', 'Tungsten', ['#76787c', '#6a6c70', '#828488'], 3422, 193, 0.8, 2, null, null],
  ['magnesium', 'Magnesium', ['#c8c8c0', '#bcbcb4', '#d4d4cc'], 650, 17, 0.8, 7, 'whitefire', 'magnesia'],
  ['calcium', 'Calcium', ['#dedcd4', '#d2d0c8', '#eae8e0'], 842, 15, 0.7, 7.5, 'orangefire', 'quicklime'],
  ['strontium', 'Strontium', ['#d8d4c0', '#ccc8b4', '#e4e0cc'], 777, 26, 0.5, 7.8, 'redfire', null],
  ['barium', 'Barium', ['#c8ccc0', '#bcc0b4', '#d4d8cc'], 727, 35, 0.4, 8, 'greenfire', null],
  ['lithium', 'Lithium', ['#c6c6cc', '#babac0', '#d2d2d8'], 180, 5.3, 0.8, 8.5, 'redfire', null],
  ['sodium', 'Sodium', ['#d0d4cc', '#c4c8c0', '#dce0d8'], 98, 9.7, 0.9, 9, 'yellowfire', null],
  ['potassium', 'Potassium', ['#c0c4d0', '#b4b8c4', '#ccd0dc'], 63, 8.6, 0.9, 10, 'purplefire', null],
  ['cesium', 'Cesium', ['#d8c890', '#ccbc84', '#e4d49c'], 28, 19, 0.4, 11, 'bluefire', null],
  ['gallium', 'Gallium', ['#c2c6cc', '#b6bac0', '#ced2d8'], 30, 59, 0.4, 4, null, null],
  ['bismuth', 'Bismuth', ['#c4aec4', '#b8a2b8', '#d0bad0'], 271, 98, 0.1, 2.5, 'bluefire', 'bismuthoxide'],
  ['uranium', 'Uranium', ['#5a6a4c', '#4e5e40', '#667658'], 1132, 190, 0.3, 6, null, 'yellowcake'],
  ['plutonium', 'Plutonium', ['#6a6a72', '#5e5e66', '#76767e'], 640, 198, 0.1, 6, null, null],
  ['mercury', 'Mercury', ['#c0c4c8', '#b4b8bc', '#d0d4d8'], -39, 135, 0.3, 1.5, null, null],
  // The rest of the periodic table that exists in bulk: real melting points, densities and reactivity
  ['beryllium', 'Beryllium', tri('#a8acb0'), 1287, 18.5, 0.6, 5.5, null, null],
  ['boron', 'Boron', tri('#3a3430'), 2076, 23.4, 0.2, 2, 'greenfire', null],
  ['silicon', 'Silicon', tri('#5a6878'), 1414, 23.3, 0.4, 2, null, null],
  ['scandium', 'Scandium', tri('#c8ccc8'), 1541, 29.9, 0.2, 6, null, null],
  ['vanadium', 'Vanadium', tri('#8a9098'), 1910, 61, 0.3, 4, null, null],
  ['manganese', 'Manganese', tri('#a8a29a'), 1246, 72, 0.1, 5.2, null, 'mno2'],
  ['germanium', 'Germanium', tri('#8a8e94'), 938, 53, 0.3, 2, null, null],
  ['arsenic', 'Arsenic', tri('#6a6e70'), 817, 57, 0.2, 2, 'bluefire', null],
  ['selenium', 'Selenium', tri('#5a5050'), 221, 48, 0.05, 2, 'bluefire', null],
  ['rubidium', 'Rubidium', tri('#c8c4b8'), 39, 15.3, 0.6, 10.5, 'purplefire', null],
  ['yttrium', 'Yttrium', tri('#c4c8c8'), 1526, 44.7, 0.2, 6, 'redfire', null],
  ['zirconium', 'Zirconium', tri('#b8bcbc'), 1855, 65, 0.2, 4.2, 'whitefire', null],
  ['niobium', 'Niobium', tri('#8a8c9a'), 2477, 86, 0.5, 3, null, null],
  ['molybdenum', 'Molybdenum', tri('#9aa0a6'), 2623, 102, 0.8, 2, null, null],
  ['technetium', 'Technetium', tri('#a0a4a8'), 2157, 110, 0.5, 2, null, null],
  ['ruthenium', 'Ruthenium', tri('#b8bcc0'), 2334, 124, 0.7, 0, null, null],
  ['rhodium', 'Rhodium', tri('#d0d0d4'), 1964, 124, 0.9, 0, null, null],
  ['palladium', 'Palladium', tri('#c8c4b8'), 1555, 120, 0.7, 0.5, null, null],
  ['cadmium', 'Cadmium', tri('#aab0b8'), 321, 86.5, 0.9, 4.5, null, null],
  ['indium', 'Indium', tri('#b8bcc8'), 157, 73, 0.8, 3.5, 'bluefire', null],
  ['antimony', 'Antimony', tri('#a8acb4'), 631, 67, 0.2, 2.5, 'bluefire', null],
  ['tellurium', 'Tellurium', tri('#9a9ca0'), 450, 62, 0.03, 2, 'greenfire', null],
  ['lanthanum', 'Lanthanum', tri('#c8c8c0'), 920, 61.6, 0.1, 7, null, null],
  ['cerium', 'Cerium', tri('#b8b4a8'), 795, 67.7, 0.1, 7, null, null],
  ['praseodymium', 'Praseodymium', tri('#b8bca8'), 935, 67.7, 0.1, 7, null, null],
  ['neodymium', 'Neodymium', tri('#b8b8bc'), 1024, 70, 0.2, 7, null, null],
  ['promethium', 'Promethium', tri('#b0d0c0'), 1042, 72.6, 0.2, 7, null, null],
  ['samarium', 'Samarium', tri('#c8c4b8'), 1072, 75.2, 0.1, 7, null, null],
  ['europium', 'Europium', tri('#c8c0b0'), 822, 52.4, 0.1, 7.5, 'redfire', null],
  ['gadolinium', 'Gadolinium', tri('#b8bcc0'), 1312, 79, 0.1, 7, null, null],
  ['terbium', 'Terbium', tri('#b8bcc0'), 1356, 82.3, 0.1, 7, null, null],
  ['dysprosium', 'Dysprosium', tri('#bcc0c4'), 1407, 85.5, 0.1, 7, null, null],
  ['holmium', 'Holmium', tri('#c0c0c4'), 1461, 88, 0.1, 7, null, null],
  ['erbium', 'Erbium', tri('#c4c0c4'), 1529, 90.7, 0.1, 7, null, null],
  ['thulium', 'Thulium', tri('#b8b8c0'), 1545, 93.2, 0.2, 7, null, null],
  ['ytterbium', 'Ytterbium', tri('#c8c8c4'), 824, 69, 0.4, 7, null, null],
  ['lutetium', 'Lutetium', tri('#c0c4c8'), 1652, 98.4, 0.2, 7, null, null],
  ['hafnium', 'Hafnium', tri('#a8acb0'), 2233, 133, 0.2, 4, null, null],
  ['tantalum', 'Tantalum', tri('#8a8c9a'), 3017, 166, 0.6, 1, null, null],
  ['rhenium', 'Rhenium', tri('#9a9ca4'), 3186, 210, 0.5, 1, null, null],
  ['osmium', 'Osmium', tri('#8a9ab0'), 3033, 226, 0.9, 0, null, null],
  ['iridium', 'Iridium', tri('#d0d4d8'), 2446, 225, 0.9, 0, null, null],
  ['thallium', 'Thallium', tri('#a8acb0'), 304, 118.5, 0.5, 3.5, 'greenfire', null],
  ['polonium', 'Polonium', tri('#9a9aa0'), 254, 92, 0.2, 3, null, null],
  ['astatine', 'Astatine', tri('#3a3a40'), 302, 64, 0.02, 2, null, null],
  ['francium', 'Francium', tri('#c8b890'), 27, 18.7, 0.2, 12, 'purplefire', null],
  ['actinium', 'Actinium', tri('#c8d0e8'), 1050, 100, 0.1, 7, null, null],
  ['thorium', 'Thorium', tri('#a8a8a0'), 1750, 117, 0.5, 5, null, null],
  ['protactinium', 'Protactinium', tri('#b8b8b0'), 1568, 154, 0.5, 5, null, null],
  ['neptunium', 'Neptunium', tri('#a8acb0'), 644, 204, 0.1, 5, null, null],
  ['americium', 'Americium', tri('#c8c8c4'), 1176, 120, 0.1, 6, null, null],
  ['curium', 'Curium', tri('#b8bcc0'), 1340, 135, 0.1, 6, null, null],
];

// Water-reactive metals: what the metal becomes, what the water becomes, and how violently.
const WATER_METALS = {
  lithium: { to: 'lyesol', nb: 'hydrogen', c: 0.02, heat: 30, fire: 'redfire' },
  sodium: { to: 'lyesol', nb: 'hydrogen', c: 0.08, heat: 150, fire: 'yellowfire', boom: 2, boomC: 0.12 },
  potassium: { to: 'lyesol', nb: 'hydrogen', c: 0.15, heat: 250, fire: 'purplefire', boom: 3, boomC: 0.25 },
  cesium: { to: 'lyesol', nb: 'hydrogen', c: 0.5, heat: 400, fire: 'bluefire', boom: 6, boomC: 0.9 },
  calcium: { to: 'slakedlime', nb: 'hydrogen', c: 0.01, heat: 20 },
  strontium: { to: 'slakedlime', nb: 'hydrogen', c: 0.015, heat: 25 },
  barium: { to: 'slakedlime', nb: 'hydrogen', c: 0.02, heat: 30 },
  magnesium: { to: 'magnesia', nb: 'hydrogen', c: 0.01, heat: 30, tmin: 60 },
  iron: { to: 'rust', nb: '=', c: 0.0003 },
  rubidium: { to: 'lyesol', nb: 'hydrogen', c: 0.3, heat: 350, fire: 'purplefire', boom: 4, boomC: 0.5 },
  francium: { to: 'lyesol', nb: 'hydrogen', c: 0.7, heat: 500, fire: 'purplefire', boom: 7, boomC: 1 },
};
// Rare earths fizz slowly in water, like calcium; europium is the liveliest.
for (const k of ['scandium', 'yttrium', 'lanthanum', 'cerium', 'praseodymium', 'neodymium', 'promethium', 'samarium', 'gadolinium', 'terbium', 'dysprosium', 'holmium', 'erbium', 'thulium', 'ytterbium', 'lutetium', 'actinium']) {
  WATER_METALS[k] = { to: 'hydroxide', nb: 'hydrogen', c: 0.003, heat: 10 };
}
WATER_METALS.europium = { to: 'hydroxide', nb: 'hydrogen', c: 0.02, heat: 20 };
// Metals that burn as dust (and as blocks when hot enough): chance, ignition °C, flame burn temp
const BURNING_METALS = {
  magnesium: [0.3, 470, 2800], aluminum: [0.1, 800, 2400], titanium: [0.2, 600, 2000], iron: [0.05, 600, 1400],
  zinc: [0.06, 600, 1200], calcium: [0.1, 500, 1200], lithium: [0.2, 180, 1000], sodium: [0.3, 125, 900],
  potassium: [0.4, 70, 900], cesium: [0.6, 30, 900], uranium: [0.03, 300, 1500], plutonium: [0.05, 300, 1500],
  strontium: [0.2, 400, 1200], barium: [0.2, 400, 1200],
  cerium: [0.4, 160, 2000], lanthanum: [0.2, 450, 1800], neodymium: [0.1, 450, 1800], samarium: [0.1, 450, 1800],
  europium: [0.2, 150, 1500], zirconium: [0.3, 400, 2400], hafnium: [0.1, 600, 2200], beryllium: [0.05, 900, 2400],
  boron: [0.05, 700, 1800], rubidium: [0.5, 40, 900], francium: [0.7, 20, 900], scandium: [0.05, 600, 1600],
  yttrium: [0.05, 500, 1600], thorium: [0.05, 500, 2000],
};
// Metals that shrug off acids: 'all' even resists aqua regia, 'hf' only yields to hydrofluoric acid
const RESIST = { iridium: 'all', osmium: 'all', ruthenium: 'all', rhodium: 'all', tantalum: 'hf', niobium: 'hf', hafnium: 'hf', zirconium: 'hf' };
const TOXIC_METALS = new Set(['beryllium', 'cadmium', 'thallium', 'arsenic', 'selenium', 'polonium', 'astatine', 'osmium']);
const GLOWING = new Set(['polonium', 'actinium', 'curium', 'promethium', 'astatine', 'radium']);
const RADIOACTIVE = {
  uranium: [0.01, 0.004], plutonium: [0.3, 0.02], technetium: [0.02, 0.003], promethium: [0.05, 0.008], polonium: [1.2, 0.05],
  astatine: [0.8, 0.04], francium: [0.2, 0.02], actinium: [0.3, 0.02], thorium: [0.005, 0.001], protactinium: [0.05, 0.01],
  neptunium: [0.1, 0.01], americium: [0.05, 0.01], curium: [0.6, 0.03],
};

function moltenColors(melt, cols) {
  if (melt > 1500) return ['#fff2b0', '#ffe080', '#fff8d0'];
  if (melt > 900) return ['#ffb040', '#ff9a30', '#ffc860'];
  if (melt > 500) return ['#ff7a2a', '#f06a20', '#ff8a3a'];
  return cols.map(c => c);
}
const moltenOf = (k) => (k === 'steel' ? 'moltenmetal' : k === 'mercury' ? 'mercury' : k + '_molten');

METALS.forEach(([k, n, cols, melt, dens, cond, react, flame, oxide]) => {
  const info = { key: k, name: n, react, flame, oxide, melt, resist: RESIST[k], block: k, dust: k === 'mercury' ? 'mercury' : k + '_dust', molten: moltenOf(k) };
  BB.metals.push(info);
  const base = { mKey: k, econ: 1, metal: 1, cond };
  const wrx = WATER_METALS[k], burnInfo = BURNING_METALS[k], rad = RADIOACTIVE[k];
  const radProps = rad ? { selfHeat: rad[0], emit: ['radiation', rad[1], -273], glow: GLOWING.has(k) ? 1 : 0 } : {};
  if (k === 'mercury') {
    el('mercury', 'Mercury', cols[0], 'metals', 'liquid', Object.assign({}, base, { metalForm: 3, dens, cold: [-39, 'solidmercury', 0.02], hot: [357, 'mercuryvapor', 0.02], colors: cols, desc: 'Liquid metal. Dissolves gold. Boils into toxic vapor at 357°C.' }));
    el('solidmercury', 'Frozen Mercury', '#d8dce0', 'metals', 'solid', Object.assign({}, base, { metalForm: 1, hot: [-38, 'mercury', 0.02], nomenu: 1 }));
    return;
  }
  const blockProps = Object.assign({}, base, radProps, { metalForm: 1, colors: cols, hot: [melt, info.molten, 0.02] });
  if (wrx) blockProps.wrx = Object.assign({}, wrx, { c: wrx.c * 0.5 });
  if (burnInfo) Object.assign(blockProps, { burn: burnInfo[0] * 0.1, ign: burnInfo[1] + 150, burnTo: oxide || (react >= 8 ? 'lye' : 'ash'), fireKey: flame || 'fire', burnT: burnInfo[2] });
  if (BB.by[k]) Object.assign(BB.by[k], blockProps, { name: n, cat: 'metals' });
  else el(k, n, cols[0], 'metals', 'solid', blockProps);

  const dustCols = cols.map(c => c);
  const dustProps = Object.assign({}, base, radProps, { metalForm: 2, dens, slide: 0.5, colors: dustCols, hot: [melt, info.molten, 0.03] });
  if (wrx) dustProps.wrx = wrx;
  if (burnInfo) Object.assign(dustProps, { burn: burnInfo[0], ign: burnInfo[1], burnTo: oxide || (react >= 8 ? 'lye' : 'ash'), fireKey: flame || 'fire', burnT: burnInfo[2] });
  const soft = react >= 7.5 && melt < 900;
  if (soft) dustProps.slide = 0.2;
  if (TOXIC_METALS.has(k)) dustProps.toxic = 1;
  el(info.dust, n + (soft ? ' Chunks' : ' Dust'), cols[1], 'metals', 'powder', dustProps);

  const hot = melt > 500;
  const moltenProps = Object.assign({}, base, radProps, {
    metalForm: 3, dens, visc: 0.3, colors: moltenColors(melt, cols), t0: melt + 250, hotStart: 1,
    glow: hot ? 1 : 0, ignites: hot && melt > 700 ? 1 : 0, cold: [melt, k === 'bismuth' ? 'bismuthcrystal' : k, 0.02],
  });
  if (burnInfo && react >= 7) Object.assign(moltenProps, { burn: burnInfo[0] * 0.5, ign: burnInfo[1], burnTo: oxide || (react >= 8 ? 'lye' : 'ash'), fireKey: flame || 'fire', burnT: burnInfo[2] });
  if (hot) moltenProps.wrx = { to: '=', nb: 'steam', c: 0.4, boom: 2, boomC: 0.04 };
  else if (wrx) moltenProps.wrx = wrx;
  el(info.molten, 'Molten ' + n, moltenProps.colors[0], 'molten', 'liquid', moltenProps);
  C(k, info.dust);
});
BB.by.gallium.desc = 'Melts in your hand at 30°C. Liquid gallium eats right through aluminum.';
BB.by.tungsten.chargeHeat = 60;
BB.by.tungsten.desc = 'Highest melting point of any metal. Glows white-hot with electricity, like a bulb filament.';
BB.by.sodium.desc = 'Soft and very reactive. Fizzes, burns yellow and pops in water.';
BB.by.potassium.desc = 'Even more violent than sodium in water. Lilac flames.';
BB.by.cesium.desc = 'Explodes on contact with water. Melts at 28°C.';
BB.by.lithium.desc = 'Light enough to float on water while it fizzes. Burns red.';
BB.by.magnesium.desc = 'Burns with a blinding white flame. Lights thermite.';
BB.by.uranium.desc = 'Radioactive. Slowly warms itself and gives off radiation.';
BB.by.plutonium.desc = 'Very radioactive. Heats itself until it glows.';
BB.by.gold.desc = 'Never tarnishes. Only aqua regia or mercury can touch it.';
BB.by.platinum.desc = 'Noble metal and catalyst. Makes hydrogen and oxygen combine.';
BB.by.copper.desc = 'Superb conductor of heat and electricity. Turns flames green.';
el('bismuthcrystal', 'Bismuth Crystal', '#d0a0e0', 'metals', 'solid', { mKey: 'bismuth', metalForm: 1, econ: 1, metal: 1, cond: 0.1, hot: [271, 'bismuth_molten', 0.02], colors: ['#d0a0e0', '#80c8e8', '#e8d080', '#a0e0a0', '#e890c0', '#9a90e0'], desc: 'Rainbow staircase crystals from cooled molten bismuth.' });

// Element-specific behaviour
BB.by.arsenic.hot = [615, 'arsenicvapor', 0.02]; BB.by.arsenic_dust.hot = [615, 'arsenicvapor', 0.03];
BB.by.arsenic_molten.nomenu = 1;
BB.by.osmium_dust.hot = [400, 'osmiumtetroxide', 0.005];
BB.by.silicon.chargeHeat = 1; BB.by.germanium.chargeHeat = 1;
BB.by.beryllium.desc = 'Light, stiff and toxic as dust. X-rays pass straight through it.';
BB.by.boron.desc = 'Hard black metalloid. Burns green.';
BB.by.silicon.desc = 'The stuff of computer chips. Made by heating sand with magnesium.';
BB.by.manganese.desc = 'Its oxide makes peroxide fizz and hydrochloric acid give off chlorine.';
BB.by.arsenic.desc = 'Poisonous metalloid. Turns straight to vapor at 615°C.';
BB.by.rubidium.desc = 'Alkali metal. Explodes in water with red-violet flames. Melts at 39°C.';
BB.by.zirconium.desc = 'Shrugs off acids. Its dust burns brilliant white.';
BB.by.palladium.desc = 'Soaks up hydrogen like a sponge.';
BB.by.rhodium.desc = 'Catalytic-converter metal. Turns NO2 back into nitrogen.';
BB.by.iridium.desc = 'The most corrosion-resistant metal. Even aqua regia fails.';
BB.by.osmium.desc = 'Densest element. Hot osmium dust gives off toxic osmium tetroxide.';
BB.by.tantalum.desc = 'Melts at 3017°C and only hydrofluoric acid touches it.';
BB.by.cerium.desc = 'Chop it and it throws sparks. Lighter flints are made of it.';
BB.by.neodymium.desc = 'Rare earth behind the strongest magnets.';
BB.by.europium.desc = 'Most reactive rare earth. Fizzes in water.';
BB.by.gadolinium.desc = 'Rare earth used in MRI contrast.';
BB.by.cadmium.desc = 'Toxic metal. With sulfur it makes cadmium yellow pigment.';
BB.by.thallium.desc = 'Very toxic. Burns bright green.';
BB.by.indium.desc = 'So soft you can scratch it with a fingernail.';
BB.by.polonium.desc = 'So radioactive it heats itself red-hot and glows blue.';
BB.by.actinium.desc = 'Glows pale blue in the dark from its own radiation.';
BB.by.thorium.desc = 'Mildly radioactive. Once used in glowing lantern mantles.';
BB.by.americium.desc = 'The radioactive source inside smoke detectors.';
BB.by.curium.desc = 'Intensely radioactive. Glows purple and stays hot.';
BB.by.francium.desc = 'Rarest natural alkali metal. Radioactive and wildly explosive in water.';
BB.by.astatine.desc = 'Rarest natural element. Intensely radioactive halogen.';
BB.by.technetium.desc = 'Lightest element with no stable form. Mildly radioactive.';
C('cerium', 'cerium_dust', 'spark');
R('palladium', 'hydrogen', '=', '', 0.2); R('palladium_dust', 'hydrogen', '=', '', 0.3);
R('rhodium', 'no2', '=', 'nitrogen', 0.1); R('rhodium_dust', 'no2', '=', 'nitrogen', 0.2);
R('platinum', 'no2', '=', 'nitrogen', 0.05);
R('cadmium_dust', 'sulfur', 'cadmiumyellow', '', 0.05, { tmin: 200 });
R('sand', 'magnesium_dust', 'silicon_molten', 'magnesia', 0.02, { tmin: 900, heat: 300 });
R('sand', 'charcoal', 'silicon_molten', 'co2', 0.01, { tmin: 1900 });
R('quartz', 'magnesium_dust', 'silicon_molten', 'magnesia', 0.02, { tmin: 900, heat: 300 });

// Kitchen metal goes to the proper molten metal
BB.by.foil.hot = [660, 'aluminum_molten', 0.05];
BB.by.foil.mKey = 'aluminum'; BB.by.foil.metalForm = 1; BB.by.foil.econ = 1;
BB.by.castiron.hot = [1400, 'iron_molten', 0.05];
BB.by.castiron.mKey = 'iron'; BB.by.castiron.metalForm = 1; BB.by.castiron.econ = 1;
BB.by.steel.mKey = 'iron'; BB.by.steel.metalForm = 1; BB.by.steel.econ = 1;
BB.by.steel.hot = [1450, 'moltenmetal', 0.05];
Object.assign(BB.by.moltenmetal, { name: 'Molten Steel', cat: 'molten', mKey: 'iron', metalForm: 3, econ: 1, wrx: { to: '=', nb: 'steam', c: 0.4, boom: 2, boomC: 0.04 } });
BB.by.rust.cat = 'ores'; BB.by.rust.oxide = 1; BB.by.rust.mKey = 'iron';
R('iron_molten', 'charcoal', 'moltenmetal', 'co2', 0.05);
R('iron_molten', 'coal', 'moltenmetal', 'co2', 0.05);

// ---------- Alloys ----------
// key, name, colors, melting °C, metal A, metal B
const ALLOYS = [
  ['bronze', 'Bronze', ['#b08040', '#a07436', '#bc8c4c'], 950, 'copper', 'tin'],
  ['brass', 'Brass', ['#d8b040', '#c8a034', '#e4bc4c'], 930, 'copper', 'zinc'],
  ['solder', 'Solder', ['#a8acb0', '#9ca0a4', '#b4b8bc'], 183, 'tin', 'lead'],
  ['electrum', 'Electrum', ['#e8d070', '#dcc464', '#f4dc7c'], 1000, 'gold', 'silver'],
  ['rosegold', 'Rose Gold', ['#e0a080', '#d49474', '#ecac8c'], 900, 'gold', 'copper'],
  ['whitegold', 'White Gold', ['#e8e4d8', '#dcd8cc', '#f4f0e4'], 950, 'gold', 'nickel'],
  ['nichrome', 'Nichrome', ['#8a8478', '#7e786c', '#969084'], 1400, 'nickel', 'chromium'],
  ['stainless', 'Stainless Steel', ['#b8bcc0', '#acb0b4', '#c4c8cc'], 1450, 'steel', 'chromium'],
  ['pewter', 'Pewter', ['#9aa0a4', '#8e9498', '#a6acb0'], 240, 'tin', 'bismuth'],
  ['ferrocerium', 'Ferrocerium', ['#6a6660', '#5e5a54', '#76726c'], 900, 'iron', 'cerium'],
];
for (const [k, n, cols, melt, a, b] of ALLOYS) {
  el(k, n, cols[0], 'metals', 'solid', { econ: 1, metal: 1, alloy: 1, cond: 0.5, colors: cols, hot: [melt, k + '_molten', 0.02] });
  el(k + '_molten', 'Molten ' + n, moltenColors(melt, cols)[0], 'molten', 'liquid', { econ: 1, metal: 1, alloy: 1, dens: 85, visc: 0.3, colors: moltenColors(melt, cols), t0: melt + 250, hotStart: 1, glow: melt > 500 ? 1 : 0, ignites: melt > 700 ? 1 : 0, cold: [melt, k, 0.02], wrx: { to: '=', nb: 'steam', c: 0.4, boom: 2, boomC: 0.03 } });
  R(moltenOf(a), moltenOf(b), k + '_molten', k + '_molten', 0.1);
}
BB.by.ferrocerium.desc = 'Lighter flint. Chop it for showers of sparks.';
C('ferrocerium', 'ferrocerium', 'spark');
BB.by.nichrome.cat = 'power';
BB.by.nichrome.chargeHeat = 15;
BB.by.nichrome.desc = 'Heating wire. Gets red hot when electricity flows, just like a toaster.';
BB.by.stainless.desc = 'Steel plus chromium. Never rusts.';
el('galinstan', 'Galinstan', '#c8ccd2', 'metals', 'liquid', { econ: 1, metal: 1, dens: 64, cold: [-19, 'tin_dust', 0.01], desc: 'Gallium-tin alloy that stays liquid at room temperature.' });
R('gallium_molten', 'tin_molten', 'galinstan', 'galinstan', 0.1);
R('gallium_molten', 'tin_dust', 'galinstan', 'galinstan', 0.05);
el('goldamalgam', 'Gold Amalgam', '#c8c0a0', 'metals', 'liquid', { dens: 150, visc: 0.9, econ: 1, metal: 1, hot: [357, 'gold_dust', 0.02, 'mercuryvapor'], desc: 'Gold dissolved in mercury. Heat it to drive the mercury off.' });
R('mercury', 'gold_dust', 'goldamalgam', '', 0.05);
R('mercury', 'gold', 'goldamalgam', '=', 0.005);
R('mercury', 'goldore', 'goldamalgam', 'gravel', 0.02);
R('mercury', 'silver_dust', 'goldamalgam', '', 0.02);
R('mercury', 'sulfur', 'cinnabar', '', 0.05);
R('gallium_molten', 'aluminum', '=', 'aluminum_dust', 0.02);
R('gallium_molten', 'foil', '=', 'aluminum_dust', 0.03);
R('galinstan', 'aluminum', '=', 'aluminum_dust', 0.02);
R('silver', 'sulfur', 'tarnish', '', 0.01);
R('silver_dust', 'sulfur', 'tarnish', '', 0.03);
R('tarnish', 'foil', 'silver_dust', '=', 0.01, { tmin: 50 });
R('copper', 'vinegar', 'patina', '=', 0.0005);
R('copper_dust', 'vinegar', 'patina', '=', 0.002);

// ---------- Oxides ----------
// key, name, colors, metal, carbon smelting temp (null = carbon can't reduce it)
const OXIDES = [
  ['patina', 'Patina', ['#4aa88a', '#3a9a7a', '#5ab69a'], 'copper', 1000],
  ['alumina', 'Alumina', ['#f4f4f0', '#ecece8', '#fafaf6'], 'aluminum', null],
  ['tarnish', 'Tarnish', ['#3a3530', '#2e2a26', '#46403a'], 'silver', 800],
  ['zincoxide', 'Zinc Oxide', ['#f6f6f2', '#eeeeea'], 'zinc', 900],
  ['magnesia', 'Magnesia', ['#fafaf8', '#f2f2f0'], 'magnesium', null],
  ['nickeloxide', 'Nickel Oxide', ['#5a8a4a', '#4e7e3e'], 'nickel', 1300],
  ['cobaltblue', 'Cobalt Blue', ['#1a3ab0', '#2a4ac0', '#1430a0'], 'cobalt', 1300],
  ['chromiumoxide', 'Chromium Oxide', ['#3a7a3a', '#2e6e2e'], 'chromium', null],
  ['titania', 'Titanium Dioxide', ['#fafaff', '#f2f2f8'], 'titanium', null],
  ['litharge', 'Litharge', ['#e8a030', '#d89020'], 'lead', 600],
  ['tinoxide', 'Tin Oxide', ['#f0f0ec', '#e8e8e4'], 'tin', 900],
  ['bismuthoxide', 'Bismuth Oxide', ['#f0e040', '#e4d434'], 'bismuth', 600],
  ['yellowcake', 'Yellowcake', ['#e8d020', '#d8c010'], 'uranium', null],
  ['mno2', 'Manganese Dioxide', ['#2a2420', '#3a302a', '#1e1a16'], 'manganese', 1200],
];
for (const [k, n, cols, m, smelt] of OXIDES) {
  el(k, n, cols[0], 'ores', 'powder', { dens: 40, slide: 0.5, oxide: 1, mKey: m, colors: cols });
  if (smelt) for (const c of ['charcoal', 'coal']) R(k, c, moltenOf(m), 'co2', 0.03, { tmin: smelt });
}
R('rust', 'charcoal', 'iron_molten', 'co2', 0.03, { tmin: 1200 });
R('rust', 'coal', 'iron_molten', 'co2', 0.03, { tmin: 1200 });
R('rust', 'aluminum_dust', 'iron_molten', 'alumina', 0.05, { tmin: 900, heat: 1500 });
R('chromiumoxide', 'aluminum_dust', 'chromium_molten', 'alumina', 0.05, { tmin: 900, heat: 900 });
R('titania', 'magnesium_dust', 'titanium_molten', 'magnesia', 0.03, { tmin: 900 });
R('yellowcake', 'magnesium_dust', 'uranium_molten', 'magnesia', 0.03, { tmin: 900 });
BB.by.alumina.hot = [2072, 'moltenalumina', 0.02];
R('mno2', 'hcl', '=', 'chlorine', 0.02, { tmin: 50 });
R('mno2', 'peroxide', '=', 'water', 0.2, { spawn: 'oxygen', heat: 15 });
el('cadmiumyellow', 'Cadmium Yellow', '#f8c010', 'ores', 'powder', { dens: 48, slide: 0.5, toxic: 1 });
BB.by.magnesia.base = 1; BB.by.magnesia.baseM = 'magnesium';
BB.by.magnesia.desc = 'Magnesium oxide. A mild base (milk of magnesia).';

// ---------- Ores ----------
// key, name, colors, metal, carbon smelting temp (null = needs another method), sulfide (gives SO2)
const ORES = [
  ['hematite', 'Hematite', ['#8a3a2a', '#6a2a20', '#9a4a3a', '#4a4a50'], 'iron', 1200, 0],
  ['magnetite', 'Magnetite', ['#2a2a2e', '#3a3a40', '#1a1a1e'], 'iron', 1250, 0],
  ['malachite', 'Malachite', ['#1a8a5a', '#2aa06a', '#0a6a40', '#3ab07a'], 'copper', 1000, 0],
  ['cassiterite', 'Cassiterite', ['#4a3020', '#5a3a28', '#3a2418'], 'tin', 900, 0],
  ['sphalerite', 'Sphalerite', ['#6a4a20', '#8a6a30', '#4a3418'], 'zinc', 1000, 1],
  ['galena', 'Galena', ['#7a7e88', '#6a6e78', '#8a8e98'], 'lead', 800, 1],
  ['pentlandite', 'Pentlandite', ['#a8904a', '#98803a', '#b8a05a'], 'nickel', 1300, 1],
  ['cobaltite', 'Cobaltite', ['#c0b0b8', '#b0a0a8', '#d0c0c8'], 'cobalt', 1300, 1],
  ['argentite', 'Argentite', ['#3a3a40', '#4a4a52', '#2e2e34'], 'silver', 900, 1],
  ['bismuthinite', 'Bismuthinite', ['#9a9aa0', '#8a8a90', '#aaaab0'], 'bismuth', 600, 1],
  ['chromite', 'Chromite', ['#1a1a1c', '#2a2626', '#121214'], 'chromium', null, 0],
  ['bauxite', 'Bauxite', ['#b0603a', '#c0704a', '#9a5030'], 'aluminum', null, 0],
  ['rutile', 'Rutile', ['#7a2a1a', '#5a1a10', '#2a1a18'], 'titanium', null, 0],
  ['pitchblende', 'Pitchblende', ['#1a1a14', '#2a2a1e', '#121210'], 'uranium', null, 0],
  ['cinnabar', 'Cinnabar', ['#c01a1a', '#a01010', '#d02a2a'], 'mercury', null, 1],
  ['goldore', 'Gold Ore', ['#e8e4dc', '#d8d0c0', '#e8b923', '#e8e4dc'], 'gold', null, 0],
  ['celestine', 'Celestine', ['#a8c8e8', '#b8d8f0', '#98b8d8'], 'strontium', null, 0],
  ['barite', 'Barite', ['#e8e0d8', '#f0e8e0', '#dcd4cc'], 'barium', null, 0],
  ['spodumene', 'Spodumene', ['#e0b8d0', '#f0c8e0', '#d0a8c0'], 'lithium', null, 0],
  ['sylvite', 'Sylvite', ['#f0d0c0', '#f8e0d8', '#e8c4b4'], 'potassium', null, 0],
  ['meteorite', 'Meteorite', ['#3a3632', '#5a5650', '#8a8d91'], 'iron', 1450, 0],
];
for (const [k, n, cols, m, smelt, sulfide] of ORES) {
  el(k, n, cols[0], 'ores', 'powder', { dens: 45, slide: 0.15, ore: 1, sulfide, mKey: m, colors: cols });
  if (smelt) for (const c of ['charcoal', 'coal']) R(k, c, moltenOf(m), sulfide ? 'sulfurdioxide' : 'co2', 0.02, { tmin: smelt });
  C(k, 'gravel');
}
Object.assign(BB.by.malachite, { carb: 1, carbM: 'copper', desc: 'Green copper carbonate. Fizzes in acid.' });
BB.by.cinnabar.hot = [580, 'mercuryvapor', 0.01, 'sulfurdioxide'];
BB.by.pitchblende.emit = ['radiation', 0.001, -273];
BB.by.pitchblende.desc = 'Uranium ore. Faintly radioactive.';
BB.by.meteorite.desc = 'Iron and nickel from space.';
BB.by.sylvite.wrx = { to: 'potassium_cl', nb: '', c: 0.02 };
R('bauxite', 'lyesol', 'alumina', '=', 0.02, { tmin: 100 });
R('rutile', 'magnesium_dust', 'titanium_molten', 'magnesia', 0.02, { tmin: 900 });
R('chromite', 'aluminum_dust', 'chromium_molten', 'alumina', 0.03, { tmin: 900, heat: 600 });
R('pitchblende', 'magnesium_dust', 'uranium_molten', 'magnesia', 0.02, { tmin: 900 });
C('goldore', 'gravel', 'gold_dust');
C('meteorite', 'iron_dust', 'nickel_dust');

// ---------- Salts ----------
// metal, kind (cl = chloride, so4 = sulfate, no3 = nitrate), solution color (null = insoluble, it
// precipitates straight away), crystal color, crystal name, existing solution / crystal keys
const SALTS = [
  ['iron', 'cl', '#c89a3a', '#b8862a'], ['iron', 'so4', '#a8c898', '#6aac70', 'Iron Sulfate'], ['iron', 'no3', '#c8a8b0', '#b89aa8'],
  ['copper', 'cl', '#3aa8a0', '#2a9a8a'], ['copper', 'so4', '#2a78d8', '#1a5ed0', 'Copper Sulfate'], ['copper', 'no3', '#3a8ae8', '#2a74d8'],
  ['zinc', 'cl', '#c8d4dc', '#f0f2f4'], ['zinc', 'so4', '#c8d4dc', '#f2f4f6'],
  ['aluminum', 'cl', '#c8d0d8', '#f0f0f0'], ['aluminum', 'so4', '#c8d0d8', '#f4f4f8', 'Alum'],
  ['magnesium', 'cl', '#c8d0d8', '#f4f4f4'], ['magnesium', 'so4', '#c8d4dc', '#f8f8f8', 'Epsom Salt'],
  ['nickel', 'cl', '#5aaa6a', '#3a9a50'], ['nickel', 'so4', '#40a060', '#2a8a4a'],
  ['cobalt', 'cl', '#d06080', '#c03a6a'], ['cobalt', 'so4', '#c05070', '#a83a5a'],
  ['chromium', 'cl', '#6a9a50', '#4a8a3a'], ['chromium', 'so4', '#7a5aa0', '#5a3a8a'],
  ['tin', 'cl', '#c8d0d4', '#f0f0ee'], ['lead', 'no3', '#c8d0d8', '#f6f6f6'],
  ['silver', 'no3', '#d0d8e0', '#f4f6f8', 'Silver Nitrate'], ['gold', 'cl', '#e8c030', '#d8a818', 'Gold Chloride'],
  ['platinum', 'cl', '#e08030', '#c86a20', 'Chloroplatinic Acid'],
  ['calcium', 'cl', '#c8d4dc', '#f4f4f0', 'Calcium Chloride'], ['calcium', 'so4', null, null, null, null, 'gypsum'], ['calcium', 'no3', '#c8d4dc', '#f4f4f2'],
  ['sodium', 'cl', null, null, null, 'saltwater', 'salt'], ['sodium', 'so4', '#c8d4dc', '#f6f6f4'], ['sodium', 'no3', '#c8d4dc', '#f4f4f0', 'Sodium Nitrate'],
  ['potassium', 'cl', '#c8d4dc', '#f6eeea'], ['potassium', 'no3', null, null, null, 'potassium_no3', 'saltpeter'],
  ['lithium', 'cl', '#c8d4dc', '#f4f0f2'], ['strontium', 'no3', '#d8c8cc', '#f0e8e8', 'Strontium Nitrate'],
  ['barium', 'no3', '#c8d4dc', '#f0f0ec', 'Barium Nitrate'], ['barium', 'so4', null, null, null, null, 'barite'],
  ['cesium', 'cl', '#c8d4dc', '#f4f2ea'], ['titanium', 'cl', '#a080c0', '#8a60b0'],
  ['uranium', 'no3', '#c8e040', '#d8f050', 'Uranyl Nitrate'], ['bismuth', 'no3', '#c8d4dc', '#f4f2f4'],
  ['mercury', 'no3', '#c8d4dc', '#f2f2f2'], ['gallium', 'cl', '#c8d4dc', '#f2f2f4'],
  ['manganese', 'cl', '#e8c0c8', '#f0c8d0'], ['manganese', 'so4', '#e8c8d0', '#f4d0d8'],
  ['neodymium', 'cl', '#c8a8d8', '#b890d0'], ['erbium', 'cl', '#f0b8c8', '#e8a0b8'], ['praseodymium', 'cl', '#a8d8a0', '#90c888'],
  ['vanadium', 'so4', '#4a70d0', '#3a5ac0'], ['palladium', 'cl', '#c87a3a', '#b06a2a'], ['cadmium', 'cl', '#c8d4dc', '#f4f4f2'],
  ['rubidium', 'cl', '#c8d4dc', '#f4f0f0'], ['beryllium', 'cl', '#c8d4dc', '#f4f4f4'], ['europium', 'cl', '#c8d4dc', '#f8f0e8'],
];
const KIND_NAME = { cl: 'Chloride', so4: 'Sulfate', no3: 'Nitrate' };
const KIND_GAS = { cl: 'chlorine', so4: 'oxygen', no3: 'oxygen' };
for (const [m, kind, solCol, crysCol, crysName, solAlias, crysAlias] of SALTS) {
  const metal = BB.metals.find(x => x.key === m);
  const base = metal.name + ' ' + KIND_NAME[kind];
  const solKey = solAlias || (solCol ? m + '_' + kind : null);
  const crysKey = crysAlias || m + '_' + kind + '_x';
  if (solCol && !solAlias) {
    el(solKey, base + ' Solution', solCol, 'salts', 'liquid', { dens: 11, w: 1, econ: 1, alpha: 0.9, saltM: m, saltKind: kind, crysKey,
      hot: [103, crysKey, 0.003, 'steam'], electro: { to: metal.dust, spawn: KIND_GAS[kind], c: 0.004 }, flameKey: metal.flame });
  }
  if (!crysAlias) {
    el(crysKey, crysName || base, crysCol, 'salts', 'powder', { dens: 22, slide: 0.4, saltM: m, saltKind: kind, crystal: 1, solKey,
      colors: [crysCol, crysCol, '#ffffff'], wrx: solKey ? { to: solKey, nb: '', c: 0.03 } : null, flameKey: metal.flame, oxidizer: kind === 'no3' ? 1 : 0 });
  }
  BB.salts.push({ m, kind, sol: solKey, crys: crysKey });
}
el('potassium_no3', 'Potassium Nitrate Solution', '#c8d4dc', 'salts', 'liquid', { dens: 11, w: 1, econ: 1, alpha: 0.9, saltM: 'potassium', saltKind: 'no3', crysKey: 'saltpeter', hot: [103, 'saltpeter', 0.003, 'steam'] });
BB.by.saltwater.saltM = 'sodium'; BB.by.saltwater.saltKind = 'cl'; BB.by.saltwater.econ = 1; BB.by.saltwater.crysKey = 'salt';
BB.by.saltwater.electro = { to: 'lyesol', spawn: ['hydrogen', 'chlorine'], c: 0.01 };
Object.assign(BB.by.salt, { saltM: 'sodium', saltKind: 'cl', crystal: 1, solKey: 'saltwater', flameKey: 'yellowfire', hot: [801, 'moltensalt', 0.02] });
BB.by.copper_so4_x.desc = 'Brilliant blue crystals. Drop iron in the solution and copper comes out.';
BB.by.silver_no3_x.desc = 'Dissolve it and add copper to grow silver crystals.';

// ---------- Flame tests ----------
// Metal dust, crystals and solutions colour any flame that touches them.
for (const e of BB.els) {
  const flame = e.flameKey || (e.metalForm === 2 && BB.metals.find(m => m.key === e.mKey)?.flame);
  if (!flame || e.metalForm === 1) continue;
  R('fire', e.key, flame, '=', 0.3);
  R('flame', e.key, flame, '=', 0.3);
}
for (const [k, f] of [['celestine', 'redfire'], ['barite', 'greenfire'], ['spodumene', 'redfire'], ['sylvite', 'purplefire'], ['malachite', 'greenfire'], ['patina', 'greenfire']]) {
  R('fire', k, f, '=', 0.3);
}
