// Bean Box — whole ingredients: beans, produce, fruit and meat.
// Most families are generated from tables so every ingredient gets its raw, prepped and cooked forms.
'use strict';

// ---------- Beans ----------
// key, name, dry colors, soaked color, cooked color
const BEANS = [
  ['pinto', 'Pinto Beans', ['#c8946a', '#a8704a', '#d8aa82'], '#d9b08e', '#a8785a'],
  ['blackbean', 'Black Beans', ['#1d181b', '#2a2226', '#141113'], '#3a3036', '#2a2024'],
  ['kidney', 'Kidney Beans', ['#8a1c22', '#7a161c', '#9a2a2e'], '#a5383a', '#7a2a28'],
  ['navy', 'Navy Beans', ['#efe8d6', '#e6dfcc', '#f6f0e0'], '#f4eee0', '#e6d6b8'],
  ['chickpea', 'Chickpeas', ['#dfbf7f', '#d4b270', '#e8ca8c'], '#e8cf9c', '#d6b47a'],
  ['lima', 'Lima Beans', ['#cfd8a0', '#c4ce92', '#d8e0ae'], '#dbe2b6', '#bfc98e'],
  ['mung', 'Mung Beans', ['#4f8a2f', '#5a9a36', '#43782a'], '#7aa85a', '#8aa860'],
  ['adzuki', 'Adzuki Beans', ['#7a1e1e', '#6a1818', '#8a2a26'], '#8e3a34', '#6a2a24'],
  ['soy', 'Soybeans', ['#e0cf7e', '#d6c470', '#e8d88c'], '#e8dca0', '#8ec050'],
  ['lentil', 'Red Lentils', ['#d06a30', '#c45e28', '#dc7a3c'], '#e08a52', '#d8a050'],
  ['cannellini', 'Cannellini', ['#f2ecdc', '#e8e0cc', '#faf6ea'], '#f6f0e2', '#e8dcc0'],
  ['blackeyed', 'Black-Eyed Peas', ['#ece2c8', '#e6dcbe', '#1a1a1a', '#efe6ce'], '#f2ead6', '#d8caa6'],
  ['fava', 'Fava Beans', ['#b8a060', '#a89050', '#c8b070'], '#9ac070', '#7aa850'],
];
for (const [k, n, dry, soak, ckd] of BEANS) {
  el(k, n, dry[0], 'beans', 'powder', { dens: 14, slide: 0.7, colors: dry, hot: [250, 'burntfood', 0.003], desc: 'Dried. Soak in water, then simmer to cook.' });
  el(k + '_soak', 'Soaked ' + n, soak, 'beans', 'powder', { nomenu: 1, dens: 11, slide: 0.6, fd: 1, w: 1, spoil: 0.00002, hot: [95, k + '_ckd', 0.004] });
  el(k + '_ckd', 'Cooked ' + n, ckd, 'beans', 'powder', { nomenu: 1, dens: 11, slide: 0.35, fd: 1, w: 1, spoil: 0.00002, emit: ['beangas', 0.0004, -50], hot: [230, 'burntfood', 0.003], desc: 'Tender. Releases bean gas now and then.' });
  R(k, 'water', k + '_soak', '', 0.006);
  R(k, 'saltwater', k + '_soak', 'water', 0.006);
  C(k + '_ckd', 'beanpaste');
}
BB.by.soy_ckd.name = 'Edamame';

el('beanpaste', 'Bean Paste', '#9a6a48', 'beans', 'liquid', { dens: 12, visc: 0.94, fd: 1, spoil: 0.00002, hot: [240, 'burntfood', 0.002] });
el('refried', 'Refried Beans', '#8a5030', 'beans', 'liquid', { dens: 12, visc: 0.92, fd: 1, emit: ['beangas', 0.0006, -50], hot: [240, 'burntfood', 0.002] });
el('bakedbeans', 'Baked Beans', '#b04e20', 'beans', 'liquid', { dens: 11.5, visc: 0.6, fd: 1, emit: ['beangas', 0.001, -50], colors: ['#b04e20', '#c05a28', '#e0b080'], hot: [240, 'burntfood', 0.002], desc: 'Gassy.' });
el('anko', 'Red Bean Paste', '#5a1a1a', 'beans', 'liquid', { dens: 13, visc: 0.95, sw: 1, fd: 1 });
el('ricebeans', 'Rice & Beans', '#f2efe2', 'beans', 'powder', { dens: 13, slide: 0.12, fd: 1, colors: ['#f2efe2', '#2a2024', '#f8f6ee', '#3a3036'] });
el('falafelmix', 'Falafel Mix', '#a8a050', 'beans', 'powder', { dens: 12, slide: 0.05, fd: 1, colors: ['#a8a050', '#c8b878', '#4aa832'] });
el('falafel', 'Falafel', '#8a5a20', 'beans', 'powder', { dens: 10, slide: 0.1, fd: 1, hot: [240, 'burntfood', 0.003], colors: ['#8a5a20', '#a06a28', '#7a4a18'] });
el('tofu', 'Tofu', '#f2ecda', 'beans', 'powder', { dens: 10.5, slide: 0, fd: 1, w: 1, spoil: 0.00001, hot: [170, 'friedtofu', 0.004], desc: 'Soy milk curdled with salt.' });
el('friedtofu', 'Fried Tofu', '#d6a04a', 'beans', 'powder', { dens: 9, slide: 0, fd: 1, hot: [260, 'burntfood', 0.003] });
el('miso', 'Miso', '#c08840', 'beans', 'liquid', { dens: 13, visc: 0.95, desc: 'Fermented soybean paste.' });
el('beansprouts', 'Bean Sprouts', '#efeec2', 'beans', 'powder', { dens: 8, slide: 0.3, fd: 1, w: 1, spoil: 0.00003, hot: [90, 'cookedsprouts', 0.004], colors: ['#efeec2', '#f6f6dc', '#c8d880'] });
el('cookedsprouts', 'Stir-Fried Sprouts', '#d8c890', 'beans', 'powder', { dens: 8, slide: 0.3, fd: 1, hot: [240, 'burntfood', 0.003] });
el('greenbeans', 'Green Beans', '#4a9a30', 'beans', 'powder', { dens: 9, slide: 0.25, fd: 1, w: 1, spoil: 0.00002, hot: [85, 'cookedgreenbeans', 0.004], colors: ['#4a9a30', '#56a838', '#3e8a28'] });
el('cookedgreenbeans', 'Cooked Green Beans', '#3a8a28', 'beans', 'powder', { dens: 9, slide: 0.25, fd: 1, hot: [180, 'blisteredbeans', 0.004] });
el('blisteredbeans', 'Blistered Green Beans', '#4a6a1e', 'beans', 'powder', { dens: 9, slide: 0.25, fd: 1, emit: ['aroma', 0.004, 100], hot: [260, 'burntfood', 0.003], colors: ['#4a6a1e', '#2a3a10', '#5a7a2a'] });
el('coffeebeans', 'Green Coffee Beans', '#8a9a5a', 'beans', 'powder', { dens: 12, slide: 0.7, hot: [200, 'roastedcoffee', 0.006], colors: ['#8a9a5a', '#7a8a4a', '#9aa86a'], desc: 'Roast at 200°C, then grind.' });
el('roastedcoffee', 'Roasted Coffee Beans', '#4a2a14', 'beans', 'powder', { dens: 12, slide: 0.7, emit: ['coffeearoma', 0.01, 120], hot: [280, 'burntfood', 0.004], colors: ['#4a2a14', '#3a200e', '#5a341a'] });
el('cocoabeans', 'Cocoa Beans', '#7a4a30', 'beans', 'powder', { dens: 12, slide: 0.7, hot: [140, 'roastedcocoa', 0.005], colors: ['#7a4a30', '#6a3e28', '#8a5638'] });
el('roastedcocoa', 'Roasted Cocoa', '#5a3020', 'beans', 'powder', { dens: 12, slide: 0.7, emit: ['sweetaroma', 0.006, 100], hot: [260, 'burntfood', 0.004] });
el('vanillabean', 'Vanilla Bean', '#2a1810', 'beans', 'powder', { dens: 10, slide: 0.2, desc: 'Soak in spirits for extract.' });
el('jellybeans', 'Jelly Beans', '#ff4a6a', 'beans', 'powder', { dens: 14, slide: 0.8, sw: 1, hot: [90, 'meltedcandy', 0.01], colors: ['#ff4a6a', '#ffc83a', '#4ad65a', '#5a8aff', '#ffffff', '#ff8a2a', '#a050e0', '#1a1a1a'] });
el('magicbean', 'Magic Bean', '#e0c040', 'beans', 'powder', { dens: 14, slide: 0.6, glow: 1, colors: ['#e0c040', '#f0d860', '#c8a830'], desc: 'Plant it in soil. Add water. Stand back.' });

// Only the dried beans show in the Beans menu. Soaked and cooked forms are made by cooking
// (search finds them too). Things that are only called beans live with their real food group.
for (const k of ['coffeebeans', 'roastedcoffee']) BB.by[k] && (BB.by[k].cat = 'drinks');
for (const k of ['cocoabeans', 'roastedcocoa', 'jellybeans']) BB.by[k] && (BB.by[k].cat = 'sweets');
for (const k of ['greenbeans', 'cookedgreenbeans', 'blisteredbeans', 'beansprouts', 'cookedsprouts']) BB.by[k] && (BB.by[k].cat = 'produce');
BB.by.vanillabean.cat = 'spices';

// ---------- Produce ----------
// key, name, raw colors, cut name, cut color, cooked name, cooked color, cooking temp
const VEG = [
  ['potato', 'Potato', ['#c4a065', '#b8925a', '#cfac70'], 'Cut Potato', '#efe0ad', 'Baked Potato', '#a07440', 120],
  ['carrot', 'Carrot', ['#ec7a1c', '#e06e14', '#f28a2c'], 'Diced Carrot', '#f39040', 'Roast Carrot', '#c25a12', 110],
  ['onion', 'Onion', ['#e8d6b2', '#d9c39a', '#f0e2c6'], 'Chopped Onion', '#f0ead8', 'Caramelized Onion', '#a5631e', 110],
  ['garlic', 'Garlic', ['#efe8d2', '#e4dcc2', '#f6f0de'], 'Minced Garlic', '#efe0a6', 'Roasted Garlic', '#c6964a', 110],
  ['tomato', 'Tomato', ['#d6261a', '#c81e14', '#e03424'], 'Chopped Tomato', '#e8453a', 'Roast Tomato', '#a41f0f', 110],
  ['bellpepper', 'Bell Pepper', ['#3a9c2a', '#d8261a', '#f2c21a'], 'Diced Pepper', '#58b040', 'Roast Pepper', '#5a6a20', 110],
  ['broccoli', 'Broccoli', ['#2f7a2a', '#3a8a32', '#266a22'], 'Broccoli Bits', '#3c8a32', 'Steamed Broccoli', '#45a63c', 90],
  ['mushroom', 'Mushroom', ['#cbb9a0', '#b8a68c', '#8a7058'], 'Sliced Mushroom', '#d8c8b0', 'Sauteed Mushroom', '#8a6840', 110],
  ['spinach', 'Spinach', ['#2f6a24', '#3a7a2c', '#25581c'], 'Chopped Spinach', '#3a7a2c', 'Wilted Spinach', '#24461a', 60],
  ['cabbage', 'Cabbage', ['#9fcf7a', '#8ac066', '#b4dc92'], 'Shredded Cabbage', '#c8e6a8', 'Braised Cabbage', '#a8a860', 100],
  ['cucumber', 'Cucumber', ['#3f8a3a', '#2f7a2e', '#4a9a44'], 'Sliced Cucumber', '#c4e2a0', 'Seared Cucumber', '#7a8a40', 120],
  ['eggplant', 'Eggplant', ['#4a2050', '#3a1840', '#5a2a60'], 'Diced Eggplant', '#e8e0b8', 'Roast Eggplant', '#6a4a3a', 110],
  ['zucchini', 'Zucchini', ['#3a7a2a', '#2e6a22', '#4a8a34'], 'Sliced Zucchini', '#d6e6a0', 'Grilled Zucchini', '#7a8a3a', 110],
  ['pumpkin', 'Pumpkin', ['#e7801a', '#d87012', '#f09028'], 'Pumpkin Chunks', '#f0a040', 'Roast Pumpkin', '#c8661a', 120],
  ['celery', 'Celery', ['#a6ce6e', '#96c060', '#b6dc7e'], 'Chopped Celery', '#c2e08a', 'Braised Celery', '#8aa050', 100],
  ['sweetpotato', 'Sweet Potato', ['#b65a36', '#a64e2e', '#c66a40'], 'Cut Sweet Potato', '#f0903a', 'Roast Sweet Potato', '#c8662a', 120],
  ['ginger', 'Ginger', ['#d6ae6e', '#c8a060', '#e0bc7c'], 'Minced Ginger', '#efd690', 'Fried Ginger', '#b08030', 110],
  ['corn', 'Corn Cob', ['#f0cd2c', '#e8c020', '#f6da48'], 'Corn Kernels', '#f5d540', 'Grilled Corn', '#e0a838', 110],
  ['peas', 'Peas', ['#68bd38', '#5aae2e', '#78ca48'], 'Smashed Peas', '#88cc58', 'Cooked Peas', '#56a830', 90],
  ['lettuce', 'Lettuce', ['#8ccf58', '#7ac048', '#a0dc70'], 'Shredded Lettuce', '#b4e088', 'Wilted Lettuce', '#6a8a3a', 60],
  ['avocado', 'Avocado', ['#3a5a20', '#2e4a18', '#a8c060'], 'Avocado Mash', '#a8c060', 'Grilled Avocado', '#7a8a30', 120],
  ['basil', 'Basil', ['#3f9a2a', '#348a22', '#4aaa34'], 'Chopped Basil', '#4aa832', 'Fried Basil', '#2a5a1a', 110],
];
for (const [k, n, raw, cn, cc, kn, kc, t] of VEG) {
  el(k, n, raw[0], 'produce', 'powder', { dens: 10, slide: 0.15, fd: 1, w: 1, spoil: 0.00002, colors: raw, hot: [t, k + '_ckd', 0.003] });
  el(k + '_cut', cn, cc, 'produce', 'powder', { dens: 10, slide: 0.5, fd: 1, w: 1, spoil: 0.00003, hot: [t, k + '_ckd', 0.006] });
  el(k + '_ckd', kn, kc, 'produce', 'powder', { dens: 10, slide: 0.3, fd: 1, spoil: 0.00001, emit: ['aroma', 0.003, 80], hot: [245, 'burntfood', 0.003] });
  C(k, k + '_cut');
}
BB.by.onion_cut.emit = ['onionfumes', 0.004, -50];
BB.by.basil.emit = ['aroma', 0.002, 40];
el('chili', 'Chili Pepper', '#d21c10', 'produce', 'powder', { dens: 9, slide: 0.2, fd: 1, colors: ['#d21c10', '#b8160c', '#2a8a2a'], emit: ['spicyfumes', 0.004, 90], hot: [160, 'chiliflakes', 0.004] });
el('popcornkernel', 'Popcorn Kernels', '#e7b31f', 'produce', 'powder', { dens: 14, slide: 0.8, colors: ['#e7b31f', '#d8a018', '#f0c030'], hot: [175, 'popcorn', 0.02, null, 1], desc: 'Pops at 175°C.' });
el('popcorn', 'Popcorn', '#fff6dc', 'produce', 'powder', { dens: 2, slide: 0.5, fd: 1, colors: ['#fff6dc', '#fffaf0', '#f2e2b0', '#ffffff'], hot: [230, 'burntfood', 0.004] });
el('butteredpopcorn', 'Buttered Popcorn', '#f6dc86', 'produce', 'powder', { dens: 2.5, slide: 0.5, fd: 1, colors: ['#f6dc86', '#fff0b0', '#f0c860'], hot: [230, 'burntfood', 0.004] });
el('caramelcorn', 'Caramel Corn', '#d48e2a', 'produce', 'powder', { dens: 3, slide: 0.3, fd: 1, sw: 1, colors: ['#d48e2a', '#e8a840', '#c07a1e'] });
el('boiledpotato', 'Boiled Potato', '#efdca0', 'produce', 'powder', { dens: 11, slide: 0.15, fd: 1, w: 1 });
el('mashedpotato', 'Mashed Potato', '#f2e8c2', 'produce', 'liquid', { dens: 12, visc: 0.96, fd: 1 });
el('fries', 'French Fries', '#e8b84a', 'produce', 'powder', { dens: 8, slide: 0.4, fd: 1, colors: ['#e8b84a', '#f0c860', '#d8a038'], hot: [230, 'burntfood', 0.003] });
el('pickle', 'Pickle', '#7a9a2a', 'produce', 'powder', { dens: 10, slide: 0.3, colors: ['#7a9a2a', '#6a8a22', '#8aa834'] });
el('sauerkraut', 'Sauerkraut', '#d6d49a', 'produce', 'powder', { dens: 10, slide: 0.3 });
el('coconut', 'Coconut', '#6a4a2a', 'produce', 'powder', { dens: 9, slide: 0.4, colors: ['#6a4a2a', '#5a3e22', '#7a5632'], desc: 'Chop it open for coconut milk.' });
el('coconutflakes', 'Coconut Flakes', '#fbf8f0', 'produce', 'powder', { dens: 6, slide: 0.6, hot: [160, 'toastedcoconut', 0.006] });
el('toastedcoconut', 'Toasted Coconut', '#d8a860', 'produce', 'powder', { dens: 6, slide: 0.6, emit: ['sweetaroma', 0.004, 100], hot: [250, 'burntfood', 0.004] });
el('peanuts', 'Peanuts', '#c99558', 'produce', 'powder', { dens: 12, slide: 0.8, hot: [170, 'roastedpeanuts', 0.006], colors: ['#c99558', '#d4a066', '#b8864a'] });
el('roastedpeanuts', 'Roasted Peanuts', '#a8703a', 'produce', 'powder', { dens: 12, slide: 0.8, hot: [260, 'burntfood', 0.004] });
el('crushedpeanuts', 'Crushed Peanuts', '#c99a5e', 'produce', 'powder', { dens: 14, slide: 0.6 });
el('wheat', 'Wheat Grain', '#d6b04e', 'produce', 'powder', { dens: 16, slide: 0.7, colors: ['#d6b04e', '#c8a040', '#e0bc5c'], desc: 'Grind into flour, or plant it.' });

// ---------- Fruit ----------
// key, name, colors, juice name, juice color
const FRUIT = [
  ['apple', 'Apple', ['#d0302a', '#c02420', '#e8c040'], 'Apple Juice', '#e2b040'],
  ['orange', 'Orange', ['#f18a1a', '#e87c10', '#f89a2c'], 'Orange Juice', '#f8a020'],
  ['lemon', 'Lemon', ['#f4e23a', '#ead42a', '#f8ea5a'], 'Lemon Juice', '#f2ea7a'],
  ['lime', 'Lime', ['#6cbf2a', '#5aae1e', '#7ccc3a'], 'Lime Juice', '#c2e47a'],
  ['strawberry', 'Strawberry', ['#e0233a', '#d01a30', '#f0e080'], 'Strawberry Puree', '#e8445a'],
  ['blueberry', 'Blueberry', ['#3a4aa0', '#2e3a8a', '#4a5ab0'], 'Blueberry Puree', '#4a3a8a'],
  ['grape', 'Grape', ['#6a2a6a', '#5a205a', '#7a347a'], 'Grape Juice', '#6a1a5a'],
  ['banana', 'Banana', ['#f2d84a', '#e8cc3a', '#f8e46a'], 'Banana Mash', '#efe0a0'],
  ['cherry', 'Cherry', ['#a8102a', '#980a22', '#b81a34'], 'Cherry Juice', '#a01030'],
  ['peach', 'Peach', ['#f5a86a', '#f09858', '#e8604a'], 'Peach Puree', '#f8b880'],
  ['pineapple', 'Pineapple', ['#f0c840', '#e8b830', '#6a8a2a'], 'Pineapple Juice', '#f8e070'],
  ['mango', 'Mango', ['#f2a01a', '#e89010', '#e8502a'], 'Mango Puree', '#f8b030'],
  ['watermelon', 'Watermelon', ['#e83a4a', '#3a8a2a', '#f05060'], 'Watermelon Juice', '#f06070'],
  ['raspberry', 'Raspberry', ['#d02a5a', '#c01e4e', '#e03a6a'], 'Raspberry Puree', '#d03a64'],
  ['pear', 'Pear', ['#c8d050', '#b8c040', '#d8dc68'], 'Pear Juice', '#e8e0a0'],
  ['pomegranate', 'Pomegranate', ['#a8182a', '#c02a3a', '#f0d8c0'], 'Pomegranate Juice', '#a01030'],
  ['cranberry', 'Cranberry', ['#b0102a', '#a00a22', '#c01e34'], 'Cranberry Juice', '#b8203a'],
];
for (const [k, n, cols, jn, jc] of FRUIT) {
  el(k, n, cols[0], 'fruit', 'powder', { dens: 9.5, slide: 0.35, fd: 1, sw: 1, w: 1, spoil: 0.00003, colors: cols, hot: [160, 'burntfood', 0.002] });
  el(k + '_juice', jn, jc, 'drinks', 'liquid', { dens: 10.5, fd: 1, sw: 1, w: 1, spoil: 0.000005, cold: [-3, k + '_pop', 0.01], hot: [104, k + '_jam', 0.002, 'steam'] });
  el(k + '_jam', n + ' Jam', jc, 'sauces', 'liquid', { dens: 13, visc: 0.88, sw: 1, fd: 1, hot: [220, 'burntfood', 0.002] });
  el(k + '_pop', n + ' Ice Pop', jc, 'frozen', 'powder', { dens: 9.5, slide: 0, t0: -12, sw: 1, hot: [0, k + '_juice', 0.008] });
  C(k, k + '_juice');
  R(k, 'sugar', k + '_jam', '', 0.02, { tmin: 80 });
  R(k + '_juice', 'sugar', k + '_jam', '', 0.02, { tmin: 80 });
  R(k + '_juice', 'yeast', 'fruitwine', '=', 0.002, { tmin: 10, tmax: 40, spawn: 'co2' });
  S(k + '_juice', 'yogurt', 'smoothie', 'smoothie');
  S(k + '_juice', 'milk', 'smoothie', 'smoothie');
  S(k, 'yogurt', 'smoothie', 'smoothie');
  S(k + '_juice', 'crushedice', 'slushie', 'slushie');
}
el('fruitwine', 'Fruit Wine', '#a8304a', 'drinks', 'liquid', { dens: 9.9, hot: [85, 'sugarwater', 0.01, 'alcvapor'], decay: [0.00002, 'vinegar'] });
el('raisins', 'Raisins', '#3a1a2a', 'fruit', 'powder', { dens: 12, slide: 0.5, sw: 1, colors: ['#3a1a2a', '#4a2234', '#2a121e'] });
el('bakedapple', 'Baked Apple', '#a8502a', 'fruit', 'powder', { dens: 10, slide: 0.2, sw: 1, fd: 1, emit: ['sweetaroma', 0.004, 80], hot: [240, 'burntfood', 0.003] });
el('applesauce', 'Applesauce', '#e0c080', 'fruit', 'liquid', { dens: 11, visc: 0.85, sw: 1, fd: 1 });
el('lemonzest', 'Lemon Zest', '#f8e848', 'fruit', 'powder', { dens: 8, slide: 0.6 });
el('caramelapple', 'Caramel Apple', '#c87a2a', 'fruit', 'powder', { dens: 11, slide: 0.15, sw: 1, colors: ['#c87a2a', '#d88a3a', '#d0302a'] });
el('chocstrawberry', 'Choc Strawberry', '#5a2e15', 'fruit', 'powder', { dens: 11, slide: 0.2, sw: 1, colors: ['#5a2e15', '#e0233a', '#4a2410'] });
BB.by.grape.hot = [70, 'raisins', 0.002];
BB.by.apple.hot = [140, 'bakedapple', 0.004];

// ---------- Meat & seafood ----------
// raw key, raw name, raw colors, cooked key, cooked name, cooked colors, cooking temp
const MEAT = [
  ['beef', 'Raw Beef', ['#b8272e', '#a81e26', '#c83a3e', '#e8d0c8'], 'steak', 'Steak', ['#7a3b22', '#6a321c', '#8a4628'], 60],
  ['chicken', 'Raw Chicken', ['#f0b5a5', '#e8a898', '#f6c4b6'], 'roastchicken', 'Roast Chicken', ['#d99a4a', '#c8883a', '#e8aa5a'], 74],
  ['pork', 'Raw Pork', ['#e89a9a', '#e08c8c', '#f2b0aa'], 'porkchop', 'Pork Chop', ['#c88a5a', '#b87a4a', '#d89a6a'], 70],
  ['bacon', 'Raw Bacon', ['#d84a4a', '#f2d8d0', '#c83a3a'], 'crispybacon', 'Crispy Bacon', ['#9a3a1a', '#c8784a', '#7a2a10'], 120],
  ['sausage', 'Raw Sausage', ['#d88a8a', '#c87a7a', '#e09a98'], 'cookedsausage', 'Sausage', ['#9a4a2a', '#8a3a1e', '#a85834'], 72],
  ['groundbeef', 'Ground Beef', ['#c83a3a', '#b82e30', '#e0a0a0'], 'brownedbeef', 'Browned Beef', ['#6a3a24', '#5a2e1c', '#7a4a2c'], 65],
  ['lamb', 'Raw Lamb', ['#b03a3a', '#a02e30', '#e8d0c8'], 'roastlamb', 'Roast Lamb', ['#8a4a2a', '#7a3e22', '#9a5632'], 63],
  ['turkey', 'Raw Turkey', ['#f0c0b0', '#e8b0a0', '#f6d0c4'], 'roastturkey', 'Roast Turkey', ['#c88a3a', '#b87a2e', '#d89a4a'], 74],
  ['salmon', 'Raw Salmon', ['#f07a5a', '#f6a080', '#e86a4a'], 'cookedsalmon', 'Cooked Salmon', ['#f2b08e', '#f6c4a8', '#e8a07e'], 55],
  ['cod', 'Raw Cod', ['#f0eae2', '#e6e0d8', '#f6f2ec'], 'cookedcod', 'Cooked Cod', ['#fbf7f0', '#f2ece2', '#ffffff'], 60],
  ['shrimp', 'Raw Shrimp', ['#c8b4b0', '#b8a4a0', '#d8c4c0'], 'cookedshrimp', 'Cooked Shrimp', ['#f07a50', '#f8a080', '#ffffff'], 60],
  ['tuna', 'Raw Tuna', ['#c0283a', '#a81e30', '#d03a4a'], 'searedtuna', 'Seared Tuna', ['#8a5a4a', '#c04050', '#7a4a3a'], 50],
  ['rawmeatball', 'Raw Meatball', ['#c84a44', '#d8a090', '#b83a36'], 'meatball', 'Meatball', ['#6a3420', '#7a4028', '#5a2a18'], 70],
];
for (const [k, n, rc, ck, cn, cc, t] of MEAT) {
  el(k, n, rc[0], 'meat', 'powder', { dens: 11, slide: 0.1, fd: 1, w: 1, spoil: 0.00004, colors: rc, hot: [t, ck, 0.004] });
  el(ck, cn, cc[0], 'meat', 'powder', { dens: 11, slide: 0.1, fd: 1, spoil: 0.00001, colors: cc, emit: ['aroma', 0.005, 70], hot: [240, 'burntfood', 0.002] });
}
BB.by.bacon.hot = [120, 'crispybacon', 0.004, 'oil'];
el('brisket', 'Smoked Brisket', '#4a2014', 'meat', 'powder', { dens: 11, slide: 0.1, fd: 1, colors: ['#4a2014', '#2a120a', '#d86a4a'], hot: [260, 'burntfood', 0.002] });
el('jerky', 'Jerky', '#5a2414', 'meat', 'powder', { dens: 9, slide: 0.2, colors: ['#5a2414', '#6a2e1a', '#4a1c10'] });
el('friedchicken', 'Fried Chicken', '#c8802a', 'meat', 'powder', { dens: 10, slide: 0.15, fd: 1, colors: ['#c8802a', '#d8963a', '#b06a1e'], emit: ['aroma', 0.005, 70], hot: [240, 'burntfood', 0.002] });
el('battered', 'Battered Shrimp', '#efd697', 'meat', 'powder', { dens: 11, slide: 0.15, fd: 1 });
el('tempura', 'Tempura', '#f2d080', 'meat', 'powder', { dens: 8, slide: 0.2, fd: 1, colors: ['#f2d080', '#f8e0a0', '#e8c060'], hot: [240, 'burntfood', 0.002] });
el('sushi', 'Sushi', '#f4f0e2', 'meat', 'powder', { dens: 12, slide: 0, colors: ['#f4f0e2', '#f07a5a', '#1a2a1a', '#f4f0e2'] });
el('ceviche', 'Ceviche', '#f2ede2', 'meat', 'powder', { dens: 11, slide: 0.2, colors: ['#f2ede2', '#c2e47a', '#e8453a'] });
el('burger', 'Burger', '#8a4a24', 'meat', 'powder', { dens: 10, slide: 0, colors: ['#d39a4e', '#6a3a24', '#8ccf58', '#d6261a', '#f6be2e'] });
el('hotdog', 'Hot Dog', '#d39a4e', 'meat', 'powder', { dens: 10, slide: 0, colors: ['#d39a4e', '#9a4a2a', '#e3be12'] });
el('taco', 'Taco', '#efd9a0', 'meat', 'powder', { dens: 10, slide: 0.1, colors: ['#efd9a0', '#6a3a24', '#b4e088', '#f6cf47'] });
el('curryplate', 'Chicken Curry', '#d68d1c', 'meat', 'liquid', { dens: 11, visc: 0.7, fd: 1, emit: ['aroma', 0.006, 60], colors: ['#d68d1c', '#e8a030', '#d99a4a'] });
