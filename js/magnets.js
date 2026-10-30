// Bean Box — magnets and magnetic materials.
// magnet: field strength per cell (a source). ferro: how strongly the field pulls it.
// diamag: how strongly the field pushes it away. curie: above this °C it stops being magnetic.
'use strict';

const mag = (k, n, cols, state, p) => el(k, n, cols[0], 'magnets', state, Object.assign({ colors: cols }, p));

// ---------- Permanent magnets ----------
// key, name, colors, strength, Curie point °C, demagnetised name
const MAGNETS = [
  ['neomagnet', 'Neodymium Magnet', ['#a8acb4', '#9ca0a8', '#c8ccd4'], 6, 310, 'Neodymium alloy'],
  ['smcomagnet', 'Samarium-Cobalt Magnet', ['#8a8478', '#7e786c', '#a09888'], 5, 750, 'Samarium-cobalt alloy'],
  ['alnicomagnet', 'Alnico Magnet', ['#b81e1e', '#c82a2a', '#d8d8d8'], 3, 800, 'Alnico alloy'],
  ['ferritemagnet', 'Ferrite Magnet', ['#3a3a3e', '#2e2e32', '#46464a'], 2, 450, 'Ferrite ceramic'],
  ['fridgemagnet', 'Fridge Magnet', ['#e84a8a', '#4ab0e8', '#f0d040', '#5ad07a'], 1, 100, 'Rubber ferrite'],
  ['magsteel', 'Magnetized Steel', ['#9aa2b4', '#8e96a8', '#a6aec0'], 1, 770, null],
];
for (const [k, n, cols, s, curie, offName] of MAGNETS) {
  const off = k === 'magsteel' ? 'steel' : k + '_off';
  mag(k, n, cols, 'solid', { magnet: s, ferro: 1, curie, metal: 1, econ: k === 'magsteel' ? 1 : 0, cond: 0.3, hot: [curie, off, 0.01] });
  if (offName) mag(off, 'Demagnetized ' + offName, cols.map(c => c), 'solid', { ferro: 1, curie, nomenu: 1, cond: 0.3, magnetizeTo: k, desc: 'Lost its magnetism to heat. A strong field remagnetises it.' });
}
BB.by.neomagnet.desc = 'The strongest permanent magnet. Loses its pull above 310°C.';
BB.by.smcomagnet.desc = 'Strong and heat tolerant. Works up to 750°C.';
BB.by.alnicomagnet.desc = 'Classic red horseshoe magnet alloy of aluminum, nickel and cobalt.';
BB.by.ferritemagnet.desc = 'Cheap ceramic magnet made from iron oxide and barium or strontium.';
BB.by.fridgemagnet.desc = 'Weak, flexible and sticks to steel. Heat ruins it.';
BB.by.magsteel.desc = 'Steel that has been magnetised by a strong field. Loses it above 770°C.';
BB.by.fridgemagnet.metal = 0;

// ---------- Electromagnets & superconducting magnets ----------
mag('electromagnet', 'Electromagnet', ['#c27a3c', '#8a8d91', '#c27a3c', '#d08848'], 'solid', { magnet: 5, emag: 1, econ: 1, metal: 1, cond: 0.6, activeColor: '#ffb070', desc: 'Copper coil on an iron core. Magnetic only while a Battery or Zap powers it.' });
mag('mrimagnet', 'Superconducting Magnet', ['#5a6a8a', '#4a5a7a', '#c27a3c'], 'solid', { magnet: 25, coldMagnet: -250, cond: 0.4, activeColor: '#9ab4ff', desc: 'MRI-strength coil. Only works when chilled below -250°C with Liquid Helium.' });
el('liquidhelium', 'Liquid Helium', '#e8f0ff', 'frozen', 'liquid', { dens: 1.25, t0: -269, cond: 0.4, alpha: 0.6, hot: [-268, 'helium', 0.03], desc: 'Coldest liquid there is, at -269°C. Keeps superconducting magnets running.' });

// ---------- Materials that react to fields ----------
mag('ferrofluid', 'Ferrofluid', ['#121214', '#1c1c20', '#0a0a0c'], 'liquid', { dens: 12, visc: 0.3, ferro: 3, desc: 'Magnetite nanoparticles in oil. Leaps toward magnets.' });
mag('ybco', 'Superconductor', ['#2a2a3a', '#3a3a4a', '#1e1e2a'], 'powder', { dens: 63, slide: 0, cond: 0.03, heatCap: 40, cold: [-180, 'ybco_sc', 0.05], desc: 'YBCO ceramic. Chill it below -180°C with liquid nitrogen and it levitates over magnets.' });
mag('ybco_sc', 'Cold Superconductor', ['#3a4a7a', '#4a5a8a', '#2a3a6a'], 'powder', { dens: 63, slide: 0, cond: 0.03, heatCap: 40, t0: -196, diamag: 1, econ: 1, hot: [-165, 'ybco', 0.05], desc: 'Below -180°C: expels magnetic fields and conducts electricity with zero resistance.' });
mag('pyrographite', 'Pyrolytic Graphite', ['#2a2a30', '#36363e', '#202026'], 'powder', { dens: 22, slide: 0, diamag: 0.5, econ: 1, desc: 'Strongly diamagnetic. Floats above neodymium magnets at room temperature.' });
mag('mumetal', 'Mu-Metal', ['#b8b0a0', '#aca494', '#c4bcac'], 'solid', { shieldMag: 1, metal: 1, econ: 1, cond: 0.5, desc: 'Nickel-iron shielding. Magnetic fields cannot pass through it.' });
mag('compass', 'Field Compass', ['#808080', '#909090', '#707070'], 'solid', { compass: 1, cond: 0.1, desc: 'Each cell shows which way the magnetic field points: red right, yellow down, cyan left, violet up.' });
mag('inductionhob', 'Induction Hob', ['#1a1a1e', '#26262c', '#121216'], 'solid', { beh: 'induction', cond: 0.05, needsPower: 1, econ: 1, activeColor: '#ff2a1a', activeGlow: 1, desc: 'Heats only magnetic pans above it: steel and cast iron cook, copper, glass and aluminum stay cold. Needs power.' });
mag('magstirrer', 'Magnetic Stirrer', ['#e8e8ec', '#d8d8dc', '#f4f4f8'], 'solid', { beh: 'magstir', cond: 0.1, needsPower: 1, econ: 1, activeColor: '#4aa8ff', activeGlow: 1, desc: 'Spins a stir bar. Mixes whatever sits above it, like the Stir tool. Needs power.' });

// ---------- What is attracted (ferromagnetic) and what is pushed (diamagnetic) ----------
const FERRO = {
  iron: [1, 770], iron_dust: [1.5, 770], steel: [1, 770], castiron: [1, 770], nickel: [0.7, 358], nickel_dust: [1, 358],
  cobalt: [0.9, 1115], cobalt_dust: [1.3, 1115], gadolinium: [0.8, 20], gadolinium_dust: [1.2, 20], magnetite: [1.2, 585],
  meteorite: [1, 770], ferrocerium: [0.6, 300], electromagnet: [1, 770], mumetal: [1, 400], neodymium_dust: [0.2, 9999],
  rust: [0.05, 680], hematite: [0.1, 680], pyrite: [0.05, 9999], ferritemagnet: [1, 450],
};
for (const k in FERRO) Object.assign(BB.by[k], { ferro: FERRO[k][0], curie: FERRO[k][1] });
const DIAMAG = { bismuth: 0.3, bismuth_dust: 0.35, bismuthcrystal: 0.3, graphite: 0.2 };
for (const k in DIAMAG) BB.by[k].diamag = DIAMAG[k];
Object.assign(BB.by.magnetite, { magnet: 0.3, name: 'Magnetite (Lodestone)', desc: 'Natural magnet rock. Weakly magnetic and clumps with iron filings.' });
Object.assign(BB.by.iron_dust, { name: 'Iron Filings', desc: 'Show you where the field lines go. A magnet pulls them out of sand.' });
for (const k of ['iron', 'steel', 'castiron', 'nickel', 'cobalt']) BB.by[k].magnetizeTo = 'magsteel';
BB.by.gadolinium.desc = 'Magnetic only when colder than 20°C. Warm it and magnets let go.';
BB.by.stainless.desc = 'Steel plus chromium. Never rusts, and most kinds are not magnetic.';
BB.by.liquidhelium.cat = 'frozen';

// ---------- Making magnets ----------
el('ndfeb_molten', 'Molten Neodymium Alloy', '#ffb040', 'molten', 'liquid', { dens: 75, visc: 0.3, t0: 1400, hotStart: 1, glow: 1, ignites: 1, cold: [1150, 'neomagnet', 0.02], colors: ['#ffb040', '#ff9a30', '#ffc860'] });
el('smco_molten', 'Molten Samarium-Cobalt', '#ffb040', 'molten', 'liquid', { dens: 84, visc: 0.3, t0: 1500, hotStart: 1, glow: 1, ignites: 1, cold: [1300, 'smcomagnet', 0.02], colors: ['#ffb040', '#ff9a30', '#ffc860'] });
el('alnico_molten', 'Molten Alnico', '#ffb040', 'molten', 'liquid', { dens: 73, visc: 0.3, t0: 1500, hotStart: 1, glow: 1, ignites: 1, cold: [1260, 'alnicomagnet', 0.02], colors: ['#ffb040', '#ff9a30', '#ffc860'] });
R('neodymium_molten', 'iron_molten', 'ndfeb_molten', 'ndfeb_molten', 0.1);
R('neodymium_molten', 'boron_dust', 'ndfeb_molten', '', 0.05);
R('samarium_molten', 'cobalt_molten', 'smco_molten', 'smco_molten', 0.1);
R('aluminum_molten', 'nickel_molten', 'alnico_molten', 'alnico_molten', 0.05);
R('alnico_molten', 'cobalt_molten', 'alnico_molten', 'alnico_molten', 0.1);
R('rust', 'barite', 'ferritemagnet', '', 0.02, { tmin: 1000 });
R('rust', 'celestine', 'ferritemagnet', '', 0.02, { tmin: 1000 });
R('ferritemagnet', 'rubber', 'fridgemagnet', 'fridgemagnet', 0.01, { tmin: 150 });
S('magnetite', 'oil', 'ferrofluid', 'ferrofluid', 0.1);
S('iron_dust', 'oil', 'ferrofluid', 'ferrofluid', 0.05);
R('yttrium_dust', 'patina', 'ybco', '', 0.02, { tmin: 900 });
R('methane', 'graphite', '', 'pyrographite', 0.02, { tmin: 1500 });
R('nickel_molten', 'iron_molten', 'mumetal', 'mumetal', 0.05);
C('neomagnet', 'neodymium_dust');
C('ferritemagnet', 'rust');
