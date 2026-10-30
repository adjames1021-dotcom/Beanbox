// Bean Box — element registry and the core kitchen elements.
// Temperatures are in °C. hot/cold = [threshold, becomes, chance per frame, spawns].
'use strict';

const BB = { els: [], by: {}, rx: [], stir: [], chop: [] };

const CATS = [
  ['tools', 'Tools', '✋'],
  ['kitchen', 'Kitchen', '🍳'],
  ['power', 'Power', '⚡'],
  ['liquids', 'Liquids', '💧'],
  ['powders', 'Powders', '🧂'],
  ['minerals', 'Minerals', '⛰'],
  ['ores', 'Ores', '⛏'],
  ['gems', 'Gems', '💎'],
  ['metals', 'Metals', '🔩'],
  ['magnets', 'Magnets', '🧲'],
  ['molten', 'Molten', '🌋'],
  ['chem', 'Chemicals', '⚗'],
  ['salts', 'Salts', '🧪'],
  ['gases', 'Gases', '💨'],
  ['energy', 'Fire', '🔥'],
  ['produce', 'Produce', '🥕'],
  ['fruit', 'Fruit', '🍓'],
  ['beans', 'Beans', '🫘'],
  ['meat', 'Meat', '🥩'],
  ['dairy', 'Dairy & Egg', '🧀'],
  ['bakery', 'Bakery', '🍞'],
  ['sweets', 'Sweets', '🍬'],
  ['sauces', 'Sauces', '🥫'],
  ['drinks', 'Drinks', '🥤'],
  ['spices', 'Spices', '🌶'],
  ['frozen', 'Frozen', '❄'],
  ['life', 'Life', '🐜'],
];

function el(key, name, color, cat, state, p) {
  p = p || {};
  if (BB.by[key]) console.warn('Bean Box: duplicate element', key);
  p.key = key; p.name = name; p.color = color; p.cat = cat; p.state = state;
  BB.els.push(p); BB.by[key] = p;
  return p;
}
// Reaction between two touching elements. '=' keeps the element, '' removes it.
function R(a, b, ra, rb, c, o) { BB.rx.push(Object.assign({ a, b, ra, rb, c }, o)); }
// Stir reaction (whisk tool). b = null means the element changes on its own when stirred.
function S(a, b, ra, rb, c, o) { BB.stir.push(Object.assign({ a, b, ra, rb, c: c || 0.05 }, o)); }
// Chop / grind (knife tool).
function C(a, to, spawn) { BB.chop.push({ a, to, spawn }); }

// id 0 is empty air
el('air', 'Air', '#000000', 'hidden', 'empty', { cond: 0.02 });

// ---------- Tools ----------
el('erase', 'Eraser', '#c83a3a', 'tools', 'tool', { desc: 'Removes anything under the brush.' });
el('heat', 'Heat', '#e0682a', 'tools', 'tool', { desc: 'Warms everything under the brush.' });
el('cool', 'Cool', '#3a86d0', 'tools', 'tool', { desc: 'Chills everything under the brush.' });
el('stir', 'Stir', '#b08a58', 'tools', 'tool', { desc: 'Whisk and mix. Whips cream, emulsifies, mashes.' });
el('chop', 'Chop', '#bfc3c8', 'tools', 'tool', { desc: 'Knife and grinder. Chops, grinds, juices and cracks eggs.' });
el('zap', 'Zap', '#f8e040', 'tools', 'tool', { desc: 'Electrify metal, graphite, salt water and noble gases under the brush.' });
el('lighter', 'Lighter', '#f0a020', 'tools', 'tool', { desc: 'Sets fire to anything that burns.' });
el('sample', 'Sample', '#808080', 'tools', 'tool', { desc: 'Pick the element under the cursor (middle click also works).' });

// ---------- Kitchen hardware ----------
el('counter', 'Counter', '#5b5e66', 'kitchen', 'wall', { desc: 'Indestructible countertop. Blocks heat.' });
el('steel', 'Steel Pan', '#98a1aa', 'kitchen', 'solid', { cond: 0.6, metal: 1, hot: [1450, 'moltenmetal', 0.05], desc: 'Stainless steel. Spreads heat to whatever sits on it.' });
el('castiron', 'Cast Iron', '#36363b', 'kitchen', 'solid', { cond: 0.5, metal: 1, hot: [1400, 'moltenmetal', 0.05], desc: 'Heavy pan. Holds heat. Rusts if left wet.' });
el('copper', 'Copper Pot', '#c27a3c', 'kitchen', 'solid', { cond: 0.95, metal: 1, hot: [1080, 'moltenmetal', 0.05], desc: 'Fastest heat conductor in the kitchen.' });
el('foil', 'Foil', '#d3d8dd', 'kitchen', 'solid', { cond: 0.8, metal: 1, hot: [660, 'moltenmetal', 0.05], desc: 'Aluminium foil. Sparks in the microwave!' });
el('glass', 'Glass', '#8ec6da', 'kitchen', 'solid', { cond: 0.08, alpha: 0.55, desc: 'Oven-safe glass. Insulates.' });
el('ceramic', 'Ceramic', '#e7e0d1', 'kitchen', 'solid', { cond: 0.12, desc: 'Ceramic dish.' });
el('board', 'Cutting Board', '#a26f3d', 'kitchen', 'solid', { cond: 0.04, burn: 0.01, ign: 350, burnTo: 'charcoal', colors: ['#a26f3d', '#9a6838', '#ad7744'], desc: 'Wood. Chars into charcoal if it burns.' });
el('brick', 'Brick Oven', '#9b4a33', 'kitchen', 'solid', { cond: 0.07, colors: ['#9b4a33', '#8a4030', '#a8573b', '#7e3a2a'], desc: 'Thick oven brick. Holds heat.' });
el('stone', 'Pizza Stone', '#86837e', 'kitchen', 'solid', { cond: 0.25, colors: ['#86837e', '#7b7873', '#918e88'], desc: 'Evenly heated stone.' });
el('burner', 'Electric Burner', '#3a3634', 'kitchen', 'solid', { cond: 0.8, beh: 'fixed', fixT: 300, needsPower: 1, econ: 1, colors: ['#3a3634', '#46423e', '#2e2a28'], activeColor: '#ff4a1a', activeGlow: 1, desc: 'Electric hob that holds 300°C and glows red while on. Needs power: touch it to a Battery or Wall Outlet, or run Copper Wire from one.' });
el('lowburner', 'Low Burner', '#36302e', 'kitchen', 'solid', { cond: 0.8, beh: 'fixed', fixT: 140, needsPower: 1, econ: 1, colors: ['#36302e', '#423a38', '#2a2624'], activeColor: '#b8301a', activeGlow: 1, desc: 'Gentle simmer plate at 140°C. Needs power: touch it to a Battery or Wall Outlet, or run Copper Wire from one.' });
el('gasstove', 'Gas Ring', '#2c3543', 'kitchen', 'solid', { cond: 0.2, burn: 0.6, ign: 250, burnTo: 'gasstove_on', burnT: 60, desc: 'Turned on but unlit. Light it with the Lighter, a Spark or any flame. Water or CO2 puts it out.' });
el('gasstove_on', 'Lit Gas Ring', '#3a5a9a', 'kitchen', 'solid', { cond: 0.2, beh: 'gasstove', glow: 1, nomenu: 1, colors: ['#3a5a9a', '#4a70c0', '#2a4a8a'], desc: 'Burning with a blue flame.' });
el('ovencoil', 'Oven Coil', '#4a3a34', 'kitchen', 'solid', { cond: 0.8, beh: 'fixed', fixT: 200, needsPower: 1, econ: 1, activeColor: '#ff6a2a', activeGlow: 1, desc: 'Oven element at 200°C. Perfect for baking. Needs power: touch it to a Battery or Wall Outlet, or run Copper Wire from one.' });
el('fridge', 'Fridge Coil', '#5a7a8a', 'kitchen', 'solid', { cond: 0.8, beh: 'fixed', fixT: 3, needsPower: 1, econ: 1, activeColor: '#9adcff', activeGlow: 1, desc: 'Keeps things at 3°C. Slows spoiling. Needs power: touch it to a Battery or Wall Outlet, or run Copper Wire from one.' });
el('freezer', 'Freezer Coil', '#6a8a9a', 'kitchen', 'solid', { cond: 0.8, beh: 'fixed', fixT: -20, needsPower: 1, econ: 1, activeColor: '#c4f0ff', activeGlow: 1, desc: 'Holds -20°C. Freezes drinks into pops. Needs power: touch it to a Battery or Wall Outlet, or run Copper Wire from one.' });
el('cryo', 'Blast Chiller', '#7a9aa8', 'kitchen', 'solid', { cond: 0.8, beh: 'fixed', fixT: -90, needsPower: 1, econ: 1, activeColor: '#ecfcff', activeGlow: 1, desc: 'Flash-freezes at -90°C. Needs power: touch it to a Battery or Wall Outlet, or run Copper Wire from one.' });
el('drain', 'Drain', '#151515', 'kitchen', 'solid', { beh: 'drain', desc: 'Swallows anything loose that touches it.' });
el('faucet', 'Faucet', '#4a8ed0', 'kitchen', 'solid', { beh: 'faucet', desc: 'Pours a steady stream of cold water.' });
el('spout', 'Spout', '#c8a200', 'kitchen', 'solid', { beh: 'spout', desc: 'Copies the first thing that touches it, forever.' });
el('microwave', 'Microwave', '#8a8676', 'kitchen', 'solid', { beh: 'microwave', needsPower: 1, econ: 1, activeColor: '#fff2a0', activeGlow: 1, desc: 'Beams microwaves that heat watery food. Keep metal out! Needs power: touch it to a Battery or Wall Outlet, or run Copper Wire from one.' });
el('sponge', 'Sponge', '#efcf45', 'kitchen', 'solid', { beh: 'sponge', absorb: 'wetsponge', cond: 0.05, desc: 'Soaks up spills.' });
el('wetsponge', 'Wet Sponge', '#c3a52f', 'kitchen', 'solid', { cond: 0.2, w: 1, hot: [100, 'sponge', 0.01, 'steam'], desc: 'Chop to wring it out.' });
el('papertowel', 'Paper Towel', '#f1efe8', 'kitchen', 'solid', { beh: 'sponge', absorb: 'wettowel', burn: 0.2, ign: 230, cond: 0.03, desc: 'Absorbent. Very flammable.' });
el('wettowel', 'Wet Towel', '#c7c4b8', 'kitchen', 'solid', { w: 1, hot: [100, 'papertowel', 0.01, 'steam'] });
el('plasticwrap', 'Plastic Wrap', '#d6e4f2', 'kitchen', 'solid', { alpha: 0.6, cond: 0.05, hot: [130, 'meltedplastic', 0.05], desc: 'Melts into a smelly mess near heat.' });
el('wax', 'Candle Wax', '#f1e4c3', 'kitchen', 'solid', { hot: [60, 'meltedwax', 0.03], burn: 0.004, ign: 240, desc: 'Melts at 60°C. Burns slowly.' });
el('meltedwax', 'Melted Wax', '#f5ecd0', 'kitchen', 'liquid', { dens: 9, visc: 0.6, cold: [55, 'wax', 0.01], burn: 0.05, ign: 240 });
el('meltedplastic', 'Melted Plastic', '#bcc6d4', 'kitchen', 'liquid', { dens: 11, visc: 0.9, emit: ['smoke', 0.02, 150], cold: [100, 'plasticwrap', 0.004], hot: [380, 'smoke', 0.01] });
el('rust', 'Rust', '#8a3b16', 'kitchen', 'powder', { dens: 30, colors: ['#8a3b16', '#a04a1e', '#73300f'], desc: 'What cast iron becomes in water.' });

// ---------- Plain liquids ----------
el('water', 'Water', '#2a5fd8', 'liquids', 'liquid', { dens: 10, cond: 0.35, w: 1, hot: [100, 'steam', 0.06], cold: [0, 'ice', 0.03], colors: ['#2a5fd8', '#2d63dc', '#285ad2'], desc: 'Boils at 100°C, freezes at 0°C.' });
el('saltwater', 'Salt Water', '#3570c6', 'liquids', 'liquid', { dens: 11, cond: 0.35, w: 1, hot: [101, 'salt', 0.03, 'steam'], cold: [-6, 'ice', 0.02], desc: 'Boil it down to get salt back.' });
el('sugarwater', 'Sugar Water', '#5683d4', 'liquids', 'liquid', { dens: 11, cond: 0.3, w: 1, sw: 1, hot: [103, 'syrup', 0.004, 'steam'], cold: [-3, 'ice', 0.02], desc: 'Simmer it down into syrup.' });
el('syrup', 'Syrup', '#e0bf78', 'liquids', 'liquid', { dens: 13, visc: 0.6, sw: 1, hot: [160, 'caramel', 0.008], desc: 'Keep heating for caramel.' });
el('oil', 'Cooking Oil', '#d9bf3c', 'liquids', 'liquid', { dens: 9.2, cond: 0.25, burn: 0.12, ign: 340, burnTo: 'burningoil', emit: ['smoke', 0.01, 250], desc: 'Floats on water. Smokes at 250°C, ignites at 340°C. Never douse a grease fire with water!' });
el('oliveoil', 'Olive Oil', '#a6a238', 'liquids', 'liquid', { dens: 9.1, cond: 0.25, burn: 0.12, ign: 320, burnTo: 'burningoil', emit: ['smoke', 0.01, 200] });
el('sesameoil', 'Sesame Oil', '#b47823', 'liquids', 'liquid', { dens: 9.2, cond: 0.25, burn: 0.12, ign: 330, burnTo: 'burningoil', emit: ['aroma', 0.01, 120] });
el('burningoil', 'Grease Fire', '#ff6a1a', 'energy', 'liquid', { dens: 9.2, visc: 0.2, cond: 0.4, glow: 1, ignites: 1, t0: 420, hotStart: 1, beh: 'fixed', fixT: 420, fixMin: 1, emit: ['fire', 0.35, 0], decay: [0.0015, 'smoke'], colors: ['#ff6a1a', '#ff8a2a', '#ffb040', '#e04a10'], desc: 'Burning oil. Water makes it explode. Smother with salt or baking soda.' });
el('vinegar', 'Vinegar', '#d6cfae', 'liquids', 'liquid', { dens: 10.1, cond: 0.3, w: 1, hot: [100, 'vinegarfumes', 0.04], alpha: 0.85, desc: 'Acidic. Fizzes with baking soda, curdles milk.' });
el('spirits', 'Spirits', '#dfe9ea', 'liquids', 'liquid', { dens: 7.9, cond: 0.2, alpha: 0.7, burn: 0.5, ign: 365, burnTo: 'flame', hot: [78, 'alcvapor', 0.02], desc: 'Strong alcohol. Burns with a blue flame. Great for flambé.' });
el('dishsoap', 'Dish Soap', '#4ccb6a', 'liquids', 'liquid', { dens: 10.4, visc: 0.5, desc: 'Cuts grease. Stir in water for bubbles.' });
el('soapywater', 'Soapy Water', '#8fd0ec', 'liquids', 'liquid', { dens: 10.1, w: 1, cond: 0.3, hot: [100, 'steam', 0.04], cold: [0, 'ice', 0.02] });
el('oobleck', 'Oobleck', '#ececf4', 'liquids', 'liquid', { dens: 15, visc: 0.92, desc: 'Cornstarch slurry. Turns solid when stirred hard.' });
el('oobleckhard', 'Stiff Oobleck', '#dcdce6', 'liquids', 'powder', { dens: 16, slide: 0, life: [25, 60], die: 'oobleck', hidden: 1 });
el('ln2', 'Liquid Nitrogen', '#bfe4fb', 'frozen', 'liquid', { dens: 8.1, cond: 0.35, t0: -196, alpha: 0.7, hot: [-190, 'nitrogen', 0.04], desc: '-196°C. Flash-freezes anything it touches.' });
el('moltenmetal', 'Molten Metal', '#ff7a2a', 'energy', 'liquid', { dens: 70, visc: 0.4, cond: 0.5, t0: 1600, hotStart: 1, glow: 1, ignites: 1, cold: [1000, 'steel', 0.02], desc: 'What happens when you overheat a pan.' });

// ---------- Plain powders ----------
el('flour', 'Flour', '#eee7d9', 'powders', 'powder', { dens: 25, slide: 0.45, burn: 0.06, ign: 420, colors: ['#eee7d9', '#f2ece0', '#e8e0d0'], desc: 'Base of every dough. Flour dust is flammable.' });
el('riceflour', 'Rice Flour', '#f6f5f0', 'powders', 'powder', { dens: 24, slide: 0.45 });
el('cornstarch', 'Cornstarch', '#f8f8ff', 'powders', 'powder', { dens: 23, slide: 0.35, desc: 'Thickens sauces. Mix with water for oobleck.' });
el('cornmeal', 'Cornmeal', '#ecc24a', 'powders', 'powder', { dens: 26, slide: 0.7, colors: ['#ecc24a', '#e6b83e', '#f2cc58'] });
el('sugar', 'Sugar', '#fbfbf5', 'powders', 'powder', { dens: 28, slide: 0.9, sw: 1, hot: [186, 'caramel', 0.02], colors: ['#fbfbf5', '#f2f2ec', '#ffffff'], desc: 'Melts into caramel at 186°C. Dissolves in water.' });
el('brownsugar', 'Brown Sugar', '#ab7335', 'powders', 'powder', { dens: 27, slide: 0.55, sw: 1, hot: [165, 'caramel', 0.02], colors: ['#ab7335', '#b57c3b', '#9f692e'] });
el('powderedsugar', 'Powdered Sugar', '#ffffff', 'powders', 'powder', { dens: 22, slide: 0.35, sw: 1, hot: [186, 'caramel', 0.02] });
el('salt', 'Salt', '#e9e9f0', 'powders', 'powder', { dens: 30, slide: 0.9, colors: ['#e9e9f0', '#f5f5fa', '#dcdce4'], desc: 'Dissolves in water. Melts ice. Smothers grease fires.' });
el('bakingsoda', 'Baking Soda', '#f5f6fa', 'powders', 'powder', { dens: 26, slide: 0.5, desc: 'Fizzes with acids like vinegar and lemon.' });
el('bakingpowder', 'Baking Powder', '#f0ede8', 'powders', 'powder', { dens: 26, slide: 0.5, desc: 'Bubbles when wet.' });
el('yeast', 'Yeast', '#c4a364', 'powders', 'powder', { dens: 24, slide: 0.5, hot: [60, 'deadyeast', 0.05], colors: ['#c4a364', '#b8975a', '#cfae70'], desc: 'Alive! Eats sugar, burps CO2, makes dough rise and juice ferment.' });
el('deadyeast', 'Dead Yeast', '#a28c6a', 'powders', 'powder', { dens: 24, slide: 0.5, hidden: 1 });
el('cocoa', 'Cocoa Powder', '#5a2f1e', 'powders', 'powder', { dens: 24, slide: 0.45 });
el('gelatin', 'Gelatin', '#eee3c4', 'powders', 'powder', { dens: 24, slide: 0.6, desc: 'Dissolve in hot water, chill for jello.' });
el('oats', 'Oats', '#d4bc89', 'powders', 'powder', { dens: 18, slide: 0.5, colors: ['#d4bc89', '#c9b07c', '#ddc796'] });
el('rice', 'Rice', '#f4f3ea', 'powders', 'powder', { dens: 26, slide: 0.8, colors: ['#f4f3ea', '#ebe9dd', '#fafaf4'], desc: 'Boil in water to cook.' });
el('cookedrice', 'Cooked Rice', '#fbfbf3', 'powders', 'powder', { dens: 14, slide: 0.08, fd: 1, spoil: 0.00002, hot: [230, 'burntfood', 0.003], colors: ['#fbfbf3', '#f2f1e6', '#ffffff'] });
el('sushirice', 'Sushi Rice', '#f4f0e2', 'powders', 'powder', { dens: 14, slide: 0.04, fd: 1 });
el('friedrice', 'Fried Rice', '#e0b058', 'powders', 'powder', { dens: 14, slide: 0.15, fd: 1, emit: ['aroma', 0.004, 80], hot: [240, 'burntfood', 0.003], colors: ['#e0b058', '#efd07a', '#78a63a', '#c6883a', '#f2d860'] });
el('breadcrumbs', 'Breadcrumbs', '#d5a355', 'powders', 'powder', { dens: 15, slide: 0.6, burn: 0.02, ign: 300, hot: [230, 'burntfood', 0.003] });
el('sesame', 'Sesame Seeds', '#eddcb2', 'powders', 'powder', { dens: 20, slide: 0.8, hot: [150, 'toastedsesame', 0.01] });
el('toastedsesame', 'Toasted Sesame', '#c4924b', 'powders', 'powder', { dens: 20, slide: 0.8, emit: ['aroma', 0.004, 100], hot: [260, 'burntfood', 0.005] });
el('citricacid', 'Citric Acid', '#f6fdee', 'powders', 'powder', { dens: 26, slide: 0.8, desc: 'Sour crystals. Fizz with baking soda when wet.' });
el('sprinkles', 'Sprinkles', '#ff4f6d', 'powders', 'powder', { dens: 18, slide: 0.9, sw: 1, colors: ['#ff4f6d', '#ffd13d', '#4fd6ff', '#7dff6b', '#c77dff', '#ffffff', '#ff9a3d'], hot: [140, 'caramel', 0.01] });
el('sawdust', 'Sawdust', '#d4ab6a', 'powders', 'powder', { dens: 12, slide: 0.5, burn: 0.1, ign: 280 });
el('coffeegrounds', 'Coffee Grounds', '#3a2313', 'powders', 'powder', { dens: 22, slide: 0.5, colors: ['#3a2313', '#2f1c0f', '#46291a'], desc: 'Steep in hot water.' });
el('usedgrounds', 'Used Grounds', '#24170d', 'powders', 'powder', { dens: 22, slide: 0.3, desc: 'Worms love these.' });
el('tealeaves', 'Black Tea Leaves', '#4a381b', 'powders', 'powder', { dens: 12, slide: 0.5 });
el('greentealeaves', 'Green Tea Leaves', '#5a7a2b', 'powders', 'powder', { dens: 12, slide: 0.5 });
el('matcha', 'Matcha', '#86b436', 'powders', 'powder', { dens: 20, slide: 0.4 });

// ---------- Spices & herbs ----------
el('pepper', 'Black Pepper', '#2b2a28', 'spices', 'powder', { dens: 24, slide: 0.8, colors: ['#2b2a28', '#3d3a35', '#1c1c1b'] });
el('cinnamon', 'Cinnamon', '#9d5429', 'spices', 'powder', { dens: 22, slide: 0.5, emit: ['sweetaroma', 0.006, 90] });
el('cinnamonsugar', 'Cinnamon Sugar', '#c48c5b', 'spices', 'powder', { dens: 26, slide: 0.8, sw: 1, colors: ['#c48c5b', '#e8d6c0', '#9d5429'], hot: [175, 'caramel', 0.01] });
el('nutmeg', 'Nutmeg', '#8a5a33', 'spices', 'powder', { dens: 22, slide: 0.5 });
el('paprika', 'Paprika', '#c23716', 'spices', 'powder', { dens: 22, slide: 0.5 });
el('chilipowder', 'Chili Powder', '#ad2b10', 'spices', 'powder', { dens: 22, slide: 0.5, emit: ['spicyfumes', 0.01, 110] });
el('chiliflakes', 'Chili Flakes', '#b8220e', 'spices', 'powder', { dens: 18, slide: 0.6, emit: ['spicyfumes', 0.01, 110], colors: ['#b8220e', '#e0b080', '#8e1a0a', '#c8321a'] });
el('cumin', 'Cumin', '#986e32', 'spices', 'powder', { dens: 22, slide: 0.5, emit: ['aroma', 0.005, 120] });
el('turmeric', 'Turmeric', '#e2a20f', 'spices', 'powder', { dens: 22, slide: 0.5 });
el('curry', 'Curry Powder', '#d49c1d', 'spices', 'powder', { dens: 22, slide: 0.5, emit: ['aroma', 0.006, 100] });
el('garlicpowder', 'Garlic Powder', '#eedfae', 'spices', 'powder', { dens: 22, slide: 0.5 });
el('oregano', 'Oregano', '#5a6f2e', 'spices', 'powder', { dens: 10, slide: 0.6, burn: 0.02, ign: 260, emit: ['aroma', 0.006, 110], colors: ['#5a6f2e', '#6e8236', '#4a5c24'] });
el('rosemary', 'Rosemary', '#5d7a4a', 'spices', 'powder', { dens: 10, slide: 0.6, burn: 0.02, ign: 260, emit: ['aroma', 0.006, 110] });
el('vanillaextract', 'Vanilla Extract', '#4b2a13', 'spices', 'liquid', { dens: 9.5, sw: 1 });
el('msg', 'MSG', '#fdfdfd', 'spices', 'powder', { dens: 26, slide: 0.9, desc: 'Pure umami. Turns broth into a flavor bomb.' });

// ---------- Gases ----------
el('steam', 'Steam', '#9db4cd', 'gases', 'gas', { dens: 0.6, cond: 0.1, alpha: 0.5, w: 1, rise: 0.7, cold: [96, 'water', 0.006], decay: [0.0008, ''], t0: 105, desc: 'Rises, cools, and rains back down.' });
el('smoke', 'Smoke', '#3d3b3a', 'gases', 'gas', { dens: 0.8, alpha: 0.7, life: [150, 320], die: '', rise: 0.5, colors: ['#3d3b3a', '#4a4745', '#333130'] });
el('co2', 'Carbon Dioxide', '#c4c4cc', 'gases', 'gas', { dens: 1.5, alpha: 0.22, rise: 0.25, decay: [0.0012, ''], desc: 'Heavier than air. Sinks and smothers fire.' });
el('propane', 'Propane', '#a3c46a', 'gases', 'gas', { dens: 1.5, alpha: 0.32, rise: 0.25, burn: 0.9, ign: 470, boom: 5, desc: 'Camp-stove fuel. Explodes near flame.' });
el('beangas', 'Bean Gas', '#99994a', 'gases', 'gas', { dens: 0.9, alpha: 0.3, rise: 0.4, burn: 0.7, ign: 450, boom: 3, decay: [0.002, ''], desc: 'Cooked beans release this. Very flammable. You were warned.' });
el('nitrogen', 'Nitrogen Fog', '#d6ecff', 'gases', 'gas', { dens: 1.1, alpha: 0.35, t0: -150, life: [200, 420], die: '', rise: 0.3 });
el('alcvapor', 'Alcohol Vapor', '#d4e4e4', 'gases', 'gas', { dens: 0.9, alpha: 0.2, burn: 0.9, ign: 365, burnTo: 'flame', cold: [60, 'spirits', 0.01], decay: [0.002, ''] });
el('aroma', 'Savory Aroma', '#c88a4a', 'gases', 'gas', { dens: 0.8, alpha: 0.16, life: [80, 180], die: '', desc: 'Smells like dinner.' });
el('sweetaroma', 'Sweet Aroma', '#e88ab0', 'gases', 'gas', { dens: 0.8, alpha: 0.16, life: [80, 180], die: '' });
el('coffeearoma', 'Coffee Aroma', '#8a5a32', 'gases', 'gas', { dens: 0.8, alpha: 0.2, life: [80, 180], die: '' });
el('onionfumes', 'Onion Fumes', '#d6deae', 'gases', 'gas', { dens: 0.95, alpha: 0.2, life: [100, 220], die: '', desc: 'Makes everybody cry.' });
el('spicyfumes', 'Spicy Fumes', '#ff5a3a', 'gases', 'gas', { dens: 0.95, alpha: 0.2, life: [80, 200], die: '' });
el('vinegarfumes', 'Vinegar Fumes', '#e0e0c0', 'gases', 'gas', { dens: 0.9, alpha: 0.15, life: [60, 150], die: '', cold: [60, 'vinegar', 0.02] });
el('fog', 'Fog', '#e6ecf0', 'gases', 'gas', { dens: 1.2, alpha: 0.4, t0: 2, life: [200, 420], die: '', rise: 0.2, desc: 'Spooky dry-ice fog.' });
el('bubbles', 'Soap Bubbles', '#bfe8ff', 'gases', 'gas', { dens: 0.95, alpha: 0.45, rise: 0.25, life: [100, 300], die: '' });
el('foam', 'Foam', '#f3efe4', 'gases', 'gas', { dens: 0.97, alpha: 0.9, rise: 0.15, life: [200, 420], die: '', desc: 'Boiled-over milk and fizzy froth.' });
el('colafoam', 'Cola Foam', '#d4b089', 'gases', 'gas', { dens: 0.9, alpha: 0.95, rise: 0.6, life: [120, 260], die: '', colors: ['#d4b089', '#e8d0b0', '#c49a6a'] });

// ---------- Fire & energy ----------
el('fire', 'Fire', '#ff7a1a', 'energy', 'fire', { dens: 0.5, cond: 0.6, t0: 650, hotStart: 1, ignites: 1, glow: 1, life: [18, 50], die: '', smoke: 0.12, colors: ['#7a1000', '#d42a00', '#ff6a10', '#ffa030', '#ffd060', '#fff0b0'], desc: 'Burns anything flammable. Water and CO2 put it out.' });
el('flame', 'Blue Flame', '#5aa0ff', 'energy', 'fire', { dens: 0.5, cond: 0.6, t0: 700, hotStart: 1, ignites: 1, glow: 1, life: [8, 20], die: '', colors: ['#1a2a8a', '#2a50d0', '#4a8aff', '#8ac0ff', '#e0f0ff'] });
el('spark', 'Spark', '#fff3a0', 'energy', 'fire', { dens: 0.5, cond: 0.6, t0: 1000, hotStart: 1, ignites: 1, glow: 1, life: [3, 9], die: '', rise: 0.2, colors: ['#ffd040', '#fff3a0', '#ffffff'] });
el('plasma', 'Plasma', '#e080ff', 'energy', 'fire', { dens: 0.4, cond: 0.6, t0: 2500, hotStart: 1, ignites: 1, glow: 1, life: [10, 25], die: '', colors: ['#6020a0', '#a040e0', '#e080ff', '#ffd0ff'], desc: 'Microwave a grape and find out.' });
el('ember', 'Ember', '#ff4a10', 'energy', 'powder', { dens: 20, slide: 0.3, glow: 1, ignites: 1, t0: 600, hotStart: 1, beh: 'fixed', fixT: 600, fixMin: 1, life: [300, 700], die: 'ash', emit: ['fire', 0.04, 0], colors: ['#ff4a10', '#ff6a20', '#d03008', '#ff8a30'] });
el('charcoal', 'Charcoal', '#1f1f22', 'energy', 'powder', { dens: 18, slide: 0.35, burn: 0.004, ign: 450, burnTo: 'ember', colors: ['#1f1f22', '#2a2a2e', '#151517'], desc: 'Grill fuel. Light it and it smoulders for ages.' });
el('ash', 'Ash', '#7a7a7a', 'energy', 'powder', { dens: 8, slide: 0.6, colors: ['#7a7a7a', '#8a8a8a', '#6a6a6a'] });
el('burntfood', 'Burnt Food', '#1d140f', 'energy', 'powder', { dens: 14, slide: 0.3, hot: [420, 'ash', 0.005], emit: ['smoke', 0.02, 160], burn: 0.01, ign: 480, burnTo: 'ember', colors: ['#1d140f', '#2a1c12', '#140e0a'], desc: 'You left it on too long.' });
el('mwave', 'Microwaves', '#ffef8a', 'energy', 'special', { beh: 'mwave', alpha: 0.35, life: [70, 140], die: '', desc: 'Invisible-ish rays that heat water inside food.' });

// ---------- Frozen ----------
el('ice', 'Ice', '#a7daf3', 'frozen', 'powder', { dens: 9.1, slide: 0, cond: 0.4, t0: -10, hot: [0.5, 'water', 0.01], colors: ['#a7daf3', '#b6e2f7', '#9ad2ee'], desc: 'Ice cubes. They float!' });
el('crushedice', 'Crushed Ice', '#cbedfd', 'frozen', 'powder', { dens: 9.1, slide: 0.6, cond: 0.4, t0: -8, hot: [0.5, 'water', 0.02] });
el('snow', 'Shaved Ice', '#f2f9ff', 'frozen', 'powder', { dens: 6, slide: 0.3, cond: 0.3, t0: -5, hot: [0.5, 'water', 0.03] });
el('dryice', 'Dry Ice', '#e4ecf0', 'frozen', 'powder', { dens: 15, slide: 0, cond: 0.3, t0: -78, hot: [-60, 'co2', 0.02], emit: ['co2', 0.01, -200], desc: '-78°C. Sublimates straight into CO2.' });
el('icecreambase', 'Sweet Cream', '#fbf2db', 'frozen', 'liquid', { dens: 10.2, sw: 1, fd: 1, cold: [-4, 'icecream', 0.01], desc: 'Chill below -4°C for ice cream.' });
el('icecream', 'Vanilla Ice Cream', '#f7ecca', 'frozen', 'powder', { dens: 8, slide: 0.08, sw: 1, fd: 1, t0: -12, hot: [-1, 'meltedicecream', 0.008] });
el('chocicecream', 'Chocolate Ice Cream', '#7a4a2a', 'frozen', 'powder', { dens: 8, slide: 0.08, sw: 1, fd: 1, t0: -12, hot: [-1, 'chocmilk', 0.008] });
el('strawicecream', 'Strawberry Ice Cream', '#f2a5b5', 'frozen', 'powder', { dens: 8, slide: 0.08, sw: 1, fd: 1, t0: -12, hot: [-1, 'meltedicecream', 0.008] });
el('meltedicecream', 'Melted Ice Cream', '#f5e7c9', 'frozen', 'liquid', { dens: 10.2, sw: 1, fd: 1, cold: [-6, 'icecream', 0.008] });
el('slushie', 'Slushie', '#ff5a7a', 'frozen', 'powder', { dens: 9.5, slide: 0.6, t0: -6, sw: 1, hot: [1, 'sugarwater', 0.01], colors: ['#ff5a7a', '#ff8aa0', '#ffc0d0'] });
