// Bean Box — acids, bases, reagents, explosives, gases, coloured flames, radiation and electricity.
// acid: strength (1 weak, 3 strong, 4 dissolves gold), acidKind picks which salt forms.
// base: strength, baseM: which metal salt forms when neutralised.
'use strict';

const chem = (k, n, c, state, p) => el(k, n, c, 'chem', state, p);

// ---------- Acids ----------
chem('hcl', 'Hydrochloric Acid', '#d4f0b0', 'liquid', { dens: 11.8, w: 1, econ: 1, acid: 3, acidKind: 'cl', toxic: 1, alpha: 0.85, emit: ['hclfumes', 0.002, 40], desc: 'Strong acid. Dissolves reactive metals into chlorides and fizzes out hydrogen.' });
chem('sulfuric', 'Sulfuric Acid', '#ece6b8', 'liquid', { dens: 18, visc: 0.4, w: 1, econ: 1, acid: 3, acidKind: 'so4', charOrg: 1, toxic: 1, electro: { to: '=', spawn: ['hydrogen', 'oxygen'], c: 0.005 }, desc: 'Strong acid that chars sugar and food into carbon. Gets hot when mixed with water.' });
chem('nitric', 'Nitric Acid', '#f2ecc4', 'liquid', { dens: 15, w: 1, econ: 1, acid: 3, acidKind: 'no3', toxic: 1, emit: ['no2', 0.002, 50], desc: 'Dissolves even copper and silver, releasing brown NO2 gas.' });
chem('aquaregia', 'Aqua Regia', '#e8a020', 'liquid', { dens: 12, w: 1, econ: 1, acid: 4, acidKind: 'cl', toxic: 1, emit: ['no2', 0.004, 30], desc: '"Royal water." The only acid that dissolves gold and platinum.' });
chem('hf', 'Hydrofluoric Acid', '#e4f4f0', 'liquid', { dens: 11.5, w: 1, econ: 1, acid: 2, etch: 1, toxic: 1, alpha: 0.8, desc: 'Etches glass, sand and quartz away.' });
chem('hclfumes', 'Acid Fumes', '#d4f0b0', 'gas', { cat: 'gases', dens: 1.3, alpha: 0.18, life: [80, 200], die: '', toxic: 1 });
BB.by.hclfumes.cat = 'gases';

// ---------- Bases & household chemicals ----------
chem('lye', 'Lye', '#f6f8f4', 'powder', { dens: 21, slide: 0.6, base: 3, baseM: 'sodium', wrx: { to: 'lyesol', nb: '', c: 0.04, heat: 60 }, desc: 'Sodium hydroxide. Turns fat into soap. Dissolves aluminum.' });
chem('lyesol', 'Lye Solution', '#e8f0f4', 'liquid', { dens: 11, w: 1, econ: 1, base: 3, baseM: 'sodium', alpha: 0.85, electro: { to: '=', spawn: ['hydrogen', 'oxygen'], c: 0.005 } });
chem('ammonia', 'Ammonia', '#e0f0ff', 'liquid', { dens: 9.5, w: 1, base: 1, alpha: 0.8, emit: ['ammoniagas', 0.002, 30], desc: 'Never mix with bleach.' });
chem('bleach', 'Bleach', '#f0f8d8', 'liquid', { dens: 11, w: 1, hypo: 1, toxic: 1, base: 1, desc: 'Kills mold. Makes chlorine gas with acids.' });
chem('peroxide', 'Hydrogen Peroxide', '#e8f4ff', 'liquid', { dens: 11.1, w: 1, alpha: 0.8, decay: [0.00005, 'water'], desc: 'Bubbles out oxygen when yeast or platinum touches it.' });
chem('soapyperoxide', 'Soapy Peroxide', '#d8f0e8', 'liquid', { dens: 11, w: 1, nomenu: 1 });
chem('glycerin', 'Glycerin', '#f4f0e0', 'liquid', { dens: 12.6, visc: 0.7, sw: 1, burn: 0.03, ign: 370 });
chem('nitro', 'Nitroglycerin', '#f0ecc8', 'liquid', { dens: 16, visc: 0.4, burn: 1, ign: 55, boom: 7, desc: 'Explodes if it gets warm. Handle gently.' });
chem('soap', 'Soap', '#f6e8d8', 'powder', { dens: 9, slide: 0, base: 0.5, colors: ['#f6e8d8', '#f0dcc8', '#fff4ea'], wrx: { to: '=', nb: 'soapywater', c: 0.003 }, desc: 'Made from fat and lye.' });
chem('borax', 'Borax', '#f8f6f0', 'powder', { dens: 17, slide: 0.6, base: 1, flameKey: 'greenfire' });
chem('glue', 'White Glue', '#f8f8f4', 'liquid', { dens: 11, visc: 0.9, decay: [0.0002, 'driedglue'] });
chem('driedglue', 'Dried Glue', '#e8eef0', 'solid', { alpha: 0.7, nomenu: 1 });
chem('slime', 'Slime', '#60d040', 'liquid', { dens: 11, visc: 0.97, colors: ['#60d040', '#70e050', '#50c030'] });
chem('iodine', 'Iodine', '#3a1a3a', 'powder', { dens: 49, slide: 0.4, hot: [114, 'iodinevapor', 0.02], colors: ['#3a1a3a', '#4a2040', '#2a1028'], desc: 'Turns starch blue-black. Sublimes into purple vapor.' });
chem('starchblue', 'Starch-Iodine', '#1a1a4a', 'powder', { dens: 20, slide: 0.3, nomenu: 1 });
chem('permanganate', 'Permanganate', '#6a1a6a', 'powder', { dens: 27, slide: 0.6, oxidizer: 1, wrx: { to: 'purplesolution', nb: '', c: 0.03 }, colors: ['#6a1a6a', '#4a0a4a', '#8a2a8a'], desc: 'Bursts into flame with glycerin.' });
chem('purplesolution', 'Permanganate Solution', '#a020a0', 'liquid', { dens: 10.3, w: 1, nomenu: 1 });
chem('silverchloride', 'Silver Chloride', '#f4f4f4', 'powder', { dens: 55, slide: 0.4, decay: [0.0004, 'silver_dust'], desc: 'Darkens into silver in the light. How film photography worked.' });
chem('deepblue', 'Copper Ammine', '#1a2ad0', 'liquid', { dens: 10.5, w: 1, nomenu: 1 });
chem('carbide', 'Calcium Carbide', '#5a5a60', 'powder', { dens: 22, slide: 0.2, wrx: { to: 'slakedlime', nb: 'acetylene', c: 0.03 }, desc: 'Drop it in water for acetylene gas.' });
chem('carbonfoam', 'Carbon Snake', '#141210', 'powder', { dens: 4, slide: 0, emit: ['steam', 0.02, 60], nomenu: 1 });
chem('elephantfoam', 'Elephant Toothpaste', '#f0f0e0', 'gas', { dens: 0.99, rise: 0.12, alpha: 0.95, life: [300, 600], die: '', colors: ['#f0f0e0', '#ff6a6a', '#f0f0e0', '#6ad0ff'], nomenu: 1 });
chem('crudeoil', 'Crude Oil', '#1a1208', 'liquid', { dens: 8.8, visc: 0.6, burn: 0.08, ign: 300, fat: 0, emit: ['smoke', 0.004, 200], desc: 'Thick and flammable. Burns sooty.' });
chem('gasoline', 'Gasoline', '#e8d890', 'liquid', { dens: 7.4, alpha: 0.7, burn: 0.7, ign: 250, emit: ['gasfumes', 0.002, 15] });
chem('gasfumes', 'Gasoline Vapor', '#d8d090', 'gas', { dens: 3, rise: 0.3, alpha: 0.15, burn: 0.9, ign: 250, boom: 3, decay: [0.002, ''] });
BB.by.gasfumes.cat = 'gases';

// ---------- Explosives & pyrotechnics ----------
chem('saltpeter', 'Saltpeter', '#f8f6f2', 'powder', { dens: 21, slide: 0.7, oxidizer: 1, flameKey: 'purplefire', wrx: { to: 'potassium_no3', nb: '', c: 0.02 }, desc: 'Potassium nitrate. Oxidiser for gunpowder and rocket candy.' });
chem('blackmix', 'Charcoal Mix', '#4a4a48', 'powder', { dens: 18, slide: 0.6, burn: 0.3, ign: 350, nomenu: 1 });
chem('gunpowder', 'Gunpowder', '#3a3a3a', 'powder', { dens: 17, slide: 0.7, burn: 0.9, ign: 280, boom: 3, wrx: { to: 'wetgunpowder', nb: '', c: 0.05 }, colors: ['#3a3a3a', '#2a2a2a', '#4a4a4a'], desc: 'Saltpeter, charcoal and sulfur. Keep it dry.' });
chem('wetgunpowder', 'Wet Gunpowder', '#2a2826', 'powder', { dens: 20, slide: 0.2, hot: [100, 'gunpowder', 0.005, 'steam'], nomenu: 1 });
chem('flashpowder', 'Flash Powder', '#b8b8b4', 'powder', { dens: 18, slide: 0.7, burn: 1, ign: 250, boom: 4, fireKey: 'whitefire' });
chem('thermite', 'Thermite', '#7a4a3a', 'powder', { dens: 40, slide: 0.6, burn: 0.15, ign: 1200, burnTo: 'iron_molten', burnT: 2600, fireKey: 'whitefire', colors: ['#7a4a3a', '#c6cace', '#8a3a2a'], desc: 'Rust and aluminum. Needs a magnesium fuse. Burns at 2500°C.' });
chem('rocketcandy', 'Rocket Candy', '#e8e0d0', 'powder', { dens: 18, slide: 0, burn: 0.3, ign: 300, burnTo: 'smoke', desc: 'Saltpeter and sugar. Burns fast with tons of smoke.' });

// ---------- Gases ----------
const gas = (k, n, c, p) => el(k, n, c, 'gases', 'gas', p);
gas('hydrogen', 'Hydrogen', '#e0d8f0', { dens: 0.07, rise: 0.95, alpha: 0.15, burn: 0.9, ign: 500, boom: 2, econ: 1, plasma: '#c070ff', decay: [0.0005, ''], desc: 'Lightest gas. Pops with a flame. Glows pink with electricity.' });
gas('oxygen', 'Oxygen', '#c8e0f8', { dens: 1.1, rise: 0.25, alpha: 0.15, oxidizer: 1, decay: [0.0005, ''], desc: 'Makes fires burn hotter.' });
gas('chlorine', 'Chlorine', '#c8e050', { dens: 2.5, rise: 0.35, alpha: 0.35, toxic: 1, decay: [0.0005, ''], desc: 'Heavy, green and poisonous.' });
gas('no2', 'Nitrogen Dioxide', '#a0501a', { dens: 1.6, rise: 0.3, alpha: 0.4, toxic: 1, decay: [0.0006, ''] });
gas('sulfurdioxide', 'Sulfur Dioxide', '#d8d0a0', { dens: 2.2, rise: 0.3, alpha: 0.25, toxic: 1, decay: [0.0006, ''], desc: 'Makes acid rain with water.' });
gas('hydrogensulfide', 'Hydrogen Sulfide', '#c8c890', { dens: 1.2, rise: 0.3, alpha: 0.2, toxic: 1, burn: 0.6, ign: 260, burnTo: 'sulfurdioxide', decay: [0.0008, ''], desc: 'Rotten-egg gas.' });
gas('acetylene', 'Acetylene', '#e8e8d0', { dens: 0.9, rise: 0.4, alpha: 0.15, burn: 0.8, ign: 305, burnTo: 'torchflame', decay: [0.0006, ''], desc: 'Welding gas. Burns at 3000°C.' });
gas('methane', 'Natural Gas', '#d0e0e8', { dens: 0.55, rise: 0.7, alpha: 0.12, burn: 0.8, ign: 540, burnTo: 'flame', decay: [0.0005, ''] });
gas('ammoniagas', 'Ammonia Gas', '#e8f4ff', { dens: 0.6, rise: 0.5, alpha: 0.12, life: [80, 200], die: '' });
gas('chloramine', 'Chloramine', '#d8f0a0', { dens: 1.8, rise: 0.3, alpha: 0.3, toxic: 1, life: [300, 600], die: '', desc: 'Toxic gas from bleach and ammonia.' });
gas('iodinevapor', 'Iodine Vapor', '#9a30b0', { dens: 8, rise: 0.3, alpha: 0.4, cold: [100, 'iodine', 0.01] });
gas('mercuryvapor', 'Mercury Vapor', '#b0b8c0', { dens: 7, rise: 0.3, alpha: 0.2, toxic: 1, econ: 1, plasma: '#80c8ff', cold: [340, 'mercury', 0.01] });
gas('helium', 'Helium', '#f8e8e0', { dens: 0.14, rise: 0.9, alpha: 0.1, econ: 1, plasma: '#ffb090', decay: [0.0003, ''], desc: 'Floats up fast. Glows peach with electricity.' });
gas('neon', 'Neon', '#ffd8c8', { dens: 0.9, rise: 0.2, alpha: 0.12, econ: 1, plasma: '#ff4a1a', desc: 'Glows red-orange when electricity passes through.' });
gas('argon', 'Argon', '#e8d8ff', { dens: 1.4, rise: 0.25, alpha: 0.1, econ: 1, plasma: '#a060ff', desc: 'Inert. Glows violet with electricity.' });
gas('krypton', 'Krypton', '#f0f0f8', { dens: 2.9, rise: 0.3, alpha: 0.1, econ: 1, plasma: '#e8f0ff' });
gas('xenon', 'Xenon', '#e0e8ff', { dens: 4.5, rise: 0.3, alpha: 0.1, econ: 1, plasma: '#5a90ff' });
Object.assign(BB.by.nitrogen, { econ: 1, plasma: '#d080ff' });

// ---------- Coloured flames ----------
const flame = (k, n, cols, p) => el(k, n, cols[2], 'energy', 'fire', Object.assign({ dens: 0.5, cond: 0.6, t0: 650, hotStart: 1, ignites: 1, glow: 1, life: [14, 38], die: '', colors: cols }, p));
flame('redfire', 'Red Flame', ['#500010', '#b01030', '#ff2a4a', '#ff7a8a', '#ffd0d8'], { desc: 'Lithium and strontium burn red.' });
flame('yellowfire', 'Yellow Flame', ['#504000', '#b09000', '#ffd820', '#fff070', '#fffad0'], { desc: 'Sodium burns yellow.' });
flame('purplefire', 'Lilac Flame', ['#300040', '#7020a0', '#c060ff', '#e0a0ff', '#f8e8ff'], { desc: 'Potassium burns lilac.' });
flame('greenfire', 'Green Flame', ['#003010', '#108030', '#30e060', '#90ffb0', '#e0ffe8'], { desc: 'Copper, barium and borax burn green.' });
flame('orangefire', 'Orange Flame', ['#502000', '#c05000', '#ff8a20', '#ffc070', '#fff0d8'], { desc: 'Calcium burns orange.' });
flame('bluefire', 'Blue Fire', ['#000a40', '#1030b0', '#3070ff', '#80b0ff', '#e0f0ff'], { desc: 'Sulfur and cesium burn blue.' });
flame('whitefire', 'White Fire', ['#606060', '#c0c0c8', '#f0f0ff', '#ffffff', '#ffffff'], { t0: 2800, desc: 'Magnesium burns blinding white.' });
flame('torchflame', 'Torch Flame', ['#2040c0', '#80a0ff', '#e0f0ff', '#ffffff', '#ffffff'], { t0: 3000, life: [6, 16], desc: 'Acetylene torch at 3000°C. Cuts through metal.' });
el('radiation', 'Radiation', '#7aff5a', 'energy', 'special', { beh: 'rad', ray: 1, alpha: 0.5, life: [60, 160], die: '', desc: 'Passes through most things. Lead and concrete stop it.' });
el('radium', 'Radium', '#d8f0c0', 'metals', 'powder', { dens: 55, slide: 0.3, glow: 1, selfHeat: 0.03, emit: ['radiation', 0.01, -273], colors: ['#d8f0c0', '#a8ff80', '#c8f0b0'], desc: 'Glows green in the dark. Very radioactive.' });

// ---------- Power ----------
el('battery', 'Battery', '#d8a020', 'power', 'solid', { beh: 'battery', cond: 0.1, colors: ['#d8a020', '#2a2a2a', '#d8a020'], desc: 'Sends pulses of electricity into touching metal, graphite, salt water and noble gases.' });
el('outlet', 'Wall Outlet', '#e8e4dc', 'power', 'solid', { beh: 'battery', cond: 0.05, colors: ['#e8e4dc', '#2a2a2a', '#e8e4dc', '#f2eee6'], desc: 'Mains power for appliances. Touch it to a burner, fridge or microwave, or run Copper Wire from it.' });
R('gasstove_on', 'water', 'gasstove', 'steam', 0.3);
R('gasstove_on', 'co2', 'gasstove', '=', 0.3);
R('gasstove_on', 'foam', 'gasstove', '', 0.3);
el('rubber', 'Rubber', '#2a2a2a', 'power', 'solid', { cond: 0.05, hot: [200, 'smoke', 0.01], burn: 0.02, ign: 350, desc: 'Insulator. Electricity cannot pass.' });
el('wire', 'Copper Wire', '#d08848', 'power', 'solid', { econ: 1, metal: 1, mKey: 'copper', metalForm: 1, cond: 0.9, hot: [1085, 'copper_molten', 0.02], desc: 'Thin copper wire for circuits.' });
el('lamp', 'Lamp Filament', '#8a8c90', 'power', 'solid', { econ: 1, chargeHeat: 120, cond: 0.3, hot: [3422, 'tungsten_molten', 0.01], desc: 'Tungsten filament. Seal it in glass with argon and power it.' });
BB.by.pickle.econ = 1; BB.by.pickle.plasma = '#ffa030'; BB.by.pickle.chargeHeat = 2;
BB.by.pickle.desc = 'Run electricity through it and it glows orange. Really.';

// ---------- Flags on existing elements so general chemistry reaches them ----------
for (const k of ['vinegar', 'lemon_juice', 'lime_juice', 'cola', 'wine', 'orange_juice', 'tomatosauce', 'kombucha', 'cider']) BB.by[k].acid = 1;
for (const k of ['oil', 'oliveoil', 'sesameoil', 'meltedbutter', 'butter', 'brownbutter', 'chilioil', 'garlicoil']) BB.by[k].fat = 1;
for (const k of ['board', 'papertowel', 'wettowel', 'sawdust', 'leaf', 'beanvine', 'wheatstalk', 'rubber', 'wax']) BB.by[k].org = 1;
for (const k of ['ant', 'fly', 'worm']) Object.assign(BB.by[k], { alive: 1, deadTo: 'deadbug' });
for (const k of ['mold', 'mycelium', 'spores']) Object.assign(BB.by[k], { alive: 1, deadTo: '' });
for (const k of ['seedling', 'beanstalk', 'wheatsprout', 'leaf', 'beanvine']) Object.assign(BB.by[k], { alive: 1, deadTo: 'compost' });
Object.assign(BB.by.yeast, { alive: 1, deadTo: 'deadyeast' });
Object.assign(BB.by.bakingsoda, { carb: 1, carbM: 'sodium', base: 0.5, baseM: 'sodium' });
Object.assign(BB.by.eggshell, { carb: 1, carbM: 'calcium' });
Object.assign(BB.by.soapywater, { base: 0.3 });
Object.assign(BB.by.charcoal, { flameKey: null });
BB.by.copper.cat = 'metals';
BB.by.steel.econ = 1;
BB.by.castiron.wrx = { to: 'rust', nb: '=', c: 0.0002 };
for (const k of ['lead', 'lead_dust', 'lead_molten']) BB.by[k].shield = 1;
BB.by.water.shield = 0.05; BB.by.steel.shield = 0.3; BB.by.gold.shield = 0.6;

// ---------- Chemistry recipes ----------
R('hcl', 'nitric', 'aquaregia', 'aquaregia', 0.05);
R('sulfuric', 'water', '=', 'steam', 0.03, { heat: 40 });
R('sulfuric', 'sugar', 'carbonfoam', 'carbonfoam', 0.05, { spawn: 'steam', heat: 80 });
R('sulfuric', 'brownsugar', 'carbonfoam', 'carbonfoam', 0.05, { spawn: 'steam', heat: 80 });
R('sulfuric', 'powderedsugar', 'carbonfoam', 'carbonfoam', 0.05, { spawn: 'steam', heat: 80 });
R('sulfuric', 'saltpeter', 'nitric', '=', 0.01, { tmin: 80 });
R('sulfuric', 'salt', 'hcl', '=', 0.01, { tmin: 80 });
R('nitric', 'glycerin', 'nitro', '', 0.02, { tmax: 30 });
R('nitric', 'glycerin', 'fire', 'no2', 0.05, { tmin: 31, boom: 3 });
R('hf', 'glass', 'water', '', 0.02);
R('bleach', 'ammonia', 'chloramine', 'chloramine', 0.1);
R('bleach', 'vinegar', 'chlorine', 'saltwater', 0.08);
R('bleach', 'hcl', 'chlorine', 'saltwater', 0.2);
R('bleach', 'grape_juice', 'saltwater', 'water', 0.05);
R('bleach', 'wine', 'saltwater', 'water', 0.05);
R('bleach', 'ketchup', 'saltwater', 'water', 0.03);
R('peroxide', 'yeast', 'water', '=', 0.1, { spawn: 'oxygen', heat: 15 });
R('peroxide', 'platinum', 'water', '=', 0.1, { spawn: 'oxygen' });
R('peroxide', 'platinum_dust', 'water', '=', 0.2, { spawn: 'oxygen' });
R('peroxide', 'dishsoap', 'soapyperoxide', 'soapyperoxide', 0.1);
R('soapyperoxide', 'yeast', 'elephantfoam', '=', 0.4, { spawn: 'elephantfoam', heat: 20 });
R('soapyperoxide', 'elephantfoam', 'elephantfoam', '=', 0.3, { spawn: 'elephantfoam' });
R('permanganate', 'glycerin', 'fire', 'fire', 0.02, { heat: 400 });
R('permanganate', 'peroxide', 'water', 'oxygen', 0.2);
R('glue', 'borax', 'slime', '', 0.05);
R('silver_no3', 'saltwater', 'silverchloride', 'water', 0.1);
R('silver_no3', 'hcl', 'silverchloride', 'water', 0.1);
R('copper_so4', 'ammonia', 'deepblue', 'deepblue', 0.05);
for (const k of ['cornstarch', 'flour', 'potato', 'potato_cut', 'rice', 'bread', 'pasta', 'cookedpasta', 'cookedrice', 'riceflour']) R('iodine', k, '=', 'starchblue', 0.05);
S('saltpeter', 'charcoal', 'blackmix', 'blackmix', 0.15);
S('blackmix', 'sulfur', 'gunpowder', 'gunpowder', 0.15);
S('rust', 'aluminum_dust', 'thermite', 'thermite', 0.15);
S('magnesium_dust', 'saltpeter', 'flashpowder', 'flashpowder', 0.15);
S('aluminum_dust', 'saltpeter', 'flashpowder', 'flashpowder', 0.1);
R('saltpeter', 'caramel', 'rocketcandy', 'rocketcandy', 0.05);
R('saltpeter', 'sugar', 'rocketcandy', '', 0.02, { tmin: 150 });
R('oil', 'lye', 'soap', '=', 0.02, { spawn: 'glycerin' });

// Gases meeting each other and water
R('hydrogen', 'oxygen', 'steam', 'steam', 0.3, { tmin: 500, boom: 2 });
R('hydrogen', 'platinum', 'steam', '=', 0.05, { heat: 200 });
R('hydrogen', 'chlorine', 'hclfumes', 'hclfumes', 0.05, { tmin: 250, heat: 300 });
R('hydrogen', 'nitrogen', 'ammoniagas', '', 0.02, { tmin: 400 });
R('chlorine', 'water', '=', 'hcl', 0.01);
R('no2', 'water', '', 'nitric', 0.02);
R('sulfurdioxide', 'water', '', 'sulfuric', 0.01);
R('sulfurdioxide', 'steam', '', 'sulfuric', 0.02);
R('hclfumes', 'water', '', 'hcl', 0.05);
R('ammoniagas', 'water', '', 'ammonia', 0.05);
R('ammoniagas', 'hclfumes', 'ammoniumchloride', '', 0.2);
R('co2', 'water', '', 'sodawater', 0.01, { tmax: 12 });
R('co2', 'lyesol', '', 'bakingsoda', 0.01);
R('sodium', 'chlorine', 'salt', '', 0.1, { heat: 400, spawn: 'yellowfire' });
R('sodium_dust', 'chlorine', 'salt', '', 0.2, { heat: 400, spawn: 'yellowfire' });
R('iron_dust', 'chlorine', 'iron_cl_x', '', 0.02, { tmin: 200 });
R('fire', 'oxygen', 'fire', '', 0.5, { heat: 300 });
R('ember', 'oxygen', 'fire', '', 0.3, { heat: 300 });
R('iron_dust', 'oxygen', 'spark', 'rust', 0.05, { tmin: 300 });
R('steel', 'torchflame', 'moltenmetal', '=', 0.05);
R('iron', 'torchflame', 'iron_molten', '=', 0.05);
el('ammoniumchloride', 'Ammonium Chloride', '#f8f8f6', 'salts', 'powder', { dens: 15, slide: 0.5, nomenu: 1 });
R('mold', 'radiation', '', '', 0.3);
R('water', 'radiation', 'hydrogen', '', 0.002);
