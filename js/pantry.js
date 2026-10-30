// Bean Box — prepared foods: sauces, soups, drinks, dairy, bakery, sweets and living things.
'use strict';

// ---------- Soups & broths ----------
const SOUPS = [
  ['broth', 'Broth', '#c88e3e'], ['vegsoup', 'Veggie Soup', '#cf7f2f'], ['beansoup', 'Bean Soup', '#8a5a2e'],
  ['tomatosoup', 'Tomato Soup', '#c8411f'], ['chiliconcarne', 'Chili con Carne', '#8a2a10'], ['currysauce', 'Curry Sauce', '#d68d1c'],
  ['dal', 'Dal', '#d99a2c'], ['misosoup', 'Miso Soup', '#c9a46a'], ['chickensoup', 'Chicken Soup', '#e0b55a'],
  ['ramen', 'Ramen', '#d8a050'], ['umamibroth', 'Umami Broth', '#b0702a'], ['oatmeal', 'Oatmeal', '#d3b97c'],
];
for (const [k, n, c] of SOUPS) {
  el(k, n, c, 'liquids', 'liquid', { dens: 10.6, visc: 0.3, w: 1, fd: 1, spoil: 0.000005, emit: ['aroma', 0.004, 70], hot: [104, 'gravy', 0.0015, 'steam'] });
}
BB.by.chiliconcarne.colors = ['#8a2a10', '#6a3a24', '#7a2a28', '#a03a18'];
BB.by.ramen.colors = ['#d8a050', '#f6e2a2', '#f6e2a2', '#3a8a28'];
BB.by.oatmeal.visc = 0.85;
BB.by.oatmeal.hot = [200, 'burntfood', 0.002];
BB.by.currysauce.cat = 'sauces';

// ---------- Sauces ----------
const sauce = (k, n, c, p) => el(k, n, c, 'sauces', 'liquid', Object.assign({ dens: 11.5, visc: 0.7 }, p));
sauce('ketchup', 'Ketchup', '#c4170f');
sauce('mustard', 'Mustard', '#e3be12');
sauce('mayo', 'Mayonnaise', '#f6eed0', { visc: 0.85 });
sauce('hotsauce', 'Hot Sauce', '#e22f10', { visc: 0.2, emit: ['spicyfumes', 0.01, 60] });
sauce('bbqsauce', 'BBQ Sauce', '#651f0c', { visc: 0.8, hot: [180, 'burntfood', 0.002] });
sauce('tomatosauce', 'Tomato Sauce', '#cd2717', { visc: 0.5, w: 1, hot: [102, 'tomatopaste', 0.002, 'steam'] });
sauce('tomatopaste', 'Tomato Paste', '#9e140c', { visc: 0.92 });
sauce('marinara', 'Marinara', '#b51b10', { visc: 0.55, emit: ['aroma', 0.004, 80], colors: ['#b51b10', '#c42418', '#4a7a22'] });
sauce('salsa', 'Salsa', '#d0361d', { visc: 0.5, colors: ['#d0361d', '#e85a35', '#4c8f2c', '#f2efe2'] });
sauce('guacamole', 'Guacamole', '#7c9b2f', { visc: 0.9, colors: ['#7c9b2f', '#93b53e', '#5f7d22'] });
sauce('hummus', 'Hummus', '#d6be86', { visc: 0.92 });
sauce('pesto', 'Pesto', '#4b7a22', { visc: 0.85, colors: ['#4b7a22', '#5a8a2a', '#3a6a1a'] });
sauce('gravy', 'Gravy', '#7a4a1f', { visc: 0.6 });
sauce('soysauce', 'Soy Sauce', '#3b1b0d', { visc: 0, dens: 11.5, hot: [110, 'salt', 0.004, 'steam'] });
sauce('fishsauce', 'Fish Sauce', '#a5591c', { visc: 0 });
sauce('teriyaki', 'Teriyaki', '#4a1e0a', { visc: 0.6, sw: 1, hot: [200, 'burntsugar', 0.003] });
sauce('cheesesauce', 'Cheese Sauce', '#f6b020', { visc: 0.8, fd: 1, hot: [220, 'burntfood', 0.002] });
sauce('peanutbutter', 'Peanut Butter', '#bd7d3d', { visc: 0.96, dens: 12 });
sauce('tahini', 'Tahini', '#c9a46a', { visc: 0.9 });
sauce('chilioil', 'Chili Oil', '#c4280f', { dens: 9.2, visc: 0.1, burn: 0.12, ign: 330, burnTo: 'burningoil', emit: ['spicyfumes', 0.01, 140] });
sauce('garlicoil', 'Garlic Oil', '#dfbf5a', { dens: 9.2, visc: 0.1, burn: 0.12, ign: 330, burnTo: 'burningoil', emit: ['aroma', 0.006, 100] });
sauce('vinaigrette', 'Vinaigrette', '#c7ad4e', { dens: 9.8, visc: 0.2, decay: [0.0004, ['oil', 'vinegar']], desc: 'An emulsion. Slowly separates back into oil and vinegar.' });
sauce('honey', 'Honey', '#e8a00f', { dens: 14, visc: 0.88, sw: 1, hot: [170, 'caramel', 0.005], desc: 'Never spoils.' });
sauce('maplesyrup', 'Maple Syrup', '#9e5a14', { dens: 13.3, visc: 0.7, sw: 1, hot: [150, 'caramel', 0.005] });
sauce('cornsyrup', 'Corn Syrup', '#efe6c4', { dens: 13.8, visc: 0.8, sw: 1, alpha: 0.8, hot: [170, 'caramel', 0.003] });
sauce('molasses', 'Molasses', '#2b1407', { dens: 14.5, visc: 0.9, sw: 1, hot: [200, 'burntsugar', 0.003] });
sauce('caramelsauce', 'Caramel Sauce', '#cf8a3c', { dens: 12.5, sw: 1, hot: [210, 'burntsugar', 0.003] });
sauce('ganache', 'Ganache', '#4a1f0f', { dens: 12, visc: 0.85, sw: 1, cold: [16, 'truffle', 0.002] });
sauce('frosting', 'Frosting', '#f7eff5', { dens: 11, visc: 0.96, sw: 1, colors: ['#f7eff5', '#fff8fb', '#f2e4ee'] });
sauce('glaze', 'Sugar Glaze', '#f8f6ef', { dens: 12, visc: 0.6, sw: 1 });

// ---------- Drinks ----------
const drink = (k, n, c, p) => el(k, n, c, 'drinks', 'liquid', Object.assign({ dens: 10.2, w: 1, cond: 0.3 }, p));
drink('lemonade', 'Lemonade', '#f8f0a0', { sw: 1, cold: [-3, 'slushie', 0.006] });
drink('limeade', 'Limeade', '#d8f0a0', { sw: 1, cold: [-3, 'slushie', 0.006] });
drink('wine', 'Red Wine', '#6e0f2d', { dens: 9.9, hot: [85, 'grape_juice', 0.01, 'alcvapor'], decay: [0.00002, 'vinegar'] });
drink('beer', 'Beer', '#d49e1e', { dens: 10.1, emit: ['foam', 0.002, -50], hot: [85, 'water', 0.01, 'alcvapor'] });
drink('cider', 'Hard Cider', '#cf8f2e', { hot: [85, 'apple_juice', 0.01, 'alcvapor'], decay: [0.00002, 'vinegar'] });
drink('coffee', 'Coffee', '#3a1f0e', { emit: ['coffeearoma', 0.01, 70], hot: [101, 'steam', 0.01] });
drink('icedcoffee', 'Iced Coffee', '#6a4028', { emit: ['coffeearoma', 0.002, 0] });
drink('latte', 'Latte', '#bf8f5f', { colors: ['#bf8f5f', '#c89a6a', '#f3f2ec'] });
drink('tea', 'Black Tea', '#9b5717', { alpha: 0.9 });
drink('greentea', 'Green Tea', '#a7ad46', { alpha: 0.9 });
drink('matchalatte', 'Matcha Latte', '#a6c26c');
drink('chai', 'Chai', '#bd8655', { emit: ['sweetaroma', 0.004, 60] });
drink('hotcocoa', 'Hot Cocoa', '#7a3f1f', { sw: 1, emit: ['sweetaroma', 0.004, 60] });
drink('chocmilk', 'Chocolate Milk', '#9a5f3e', { sw: 1, fd: 1, hot: [75, 'hotcocoa', 0.004] });
drink('cola', 'Cola', '#3b1407', { dens: 10.4, sw: 1, emit: ['co2', 0.004, -50], desc: 'Fizzy. Do NOT drop a mint candy in it.' });
drink('sodawater', 'Soda Water', '#c6e4fa', { alpha: 0.7, emit: ['co2', 0.006, -50] });
drink('smoothie', 'Smoothie', '#e56a8a', { visc: 0.6, sw: 1, fd: 1, colors: ['#e56a8a', '#f08aa0', '#f3d0d8'] });
drink('milkshake', 'Milkshake', '#f0d6de', { visc: 0.7, sw: 1, fd: 1 });
drink('soymilk', 'Soy Milk', '#ece0c2', { dens: 10.3 });
drink('coconutmilk', 'Coconut Milk', '#faf5ea', { dens: 10.1 });
drink('kombucha', 'Kombucha', '#c08a3a', { emit: ['co2', 0.002, -50], alpha: 0.85 });

// ---------- Dairy & egg ----------
const dairy = (k, n, c, state, p) => el(k, n, c, 'dairy', state, p);
dairy('milk', 'Milk', '#f3f2ec', 'liquid', { dens: 10.3, w: 1, fd: 1, cond: 0.3, spoil: 0.00002, hot: [100, 'foam', 0.012], cold: [-1, 'ice', 0.01], desc: 'Boils over into foam. Curdles with acid.' });
dairy('cream', 'Heavy Cream', '#fff6dc', 'liquid', { dens: 10.0, w: 1, fd: 1, spoil: 0.00002, hot: [100, 'foam', 0.005], desc: 'Stir to whip. Keep stirring for butter.' });
dairy('buttermilk', 'Buttermilk', '#efeed6', 'liquid', { dens: 10.3, w: 1, fd: 1 });
dairy('whey', 'Whey', '#e6e3b0', 'liquid', { dens: 10.1, w: 1, alpha: 0.85 });
dairy('condensedmilk', 'Condensed Milk', '#efd9a6', 'liquid', { dens: 12.8, visc: 0.7, sw: 1, hot: [110, 'dulce', 0.003] });
dairy('dulce', 'Dulce de Leche', '#ad6a2a', 'liquid', { dens: 13, visc: 0.8, sw: 1, hot: [220, 'burntsugar', 0.003] });
dairy('yogurt', 'Yogurt', '#f7f6ef', 'liquid', { dens: 10.6, visc: 0.85, fd: 1, desc: 'Live cultures. Turns warm milk into more yogurt.' });
dairy('butter', 'Butter', '#f6d65a', 'powder', { dens: 9.1, slide: 0, fd: 1, hot: [32, 'meltedbutter', 0.01] });
dairy('meltedbutter', 'Melted Butter', '#f0c43a', 'liquid', { dens: 9.1, cold: [30, 'butter', 0.008], hot: [140, 'brownbutter', 0.004], burn: 0.05, ign: 350, burnTo: 'burningoil' });
dairy('brownbutter', 'Brown Butter', '#a8702a', 'liquid', { dens: 9.1, emit: ['aroma', 0.02, 100], hot: [210, 'burntfood', 0.004, 'smoke'], cold: [30, 'butter', 0.004] });
dairy('whippedcream', 'Whipped Cream', '#fffdf6', 'powder', { dens: 3, slide: 0.05, sw: 1, fd: 1, hot: [40, 'cream', 0.005] });
dairy('cheese', 'Cheddar', '#f4c339', 'powder', { dens: 11, slide: 0, fd: 1, spoil: 0.000004, hot: [70, 'meltedcheese', 0.005] });
dairy('meltedcheese', 'Melted Cheese', '#f6be2e', 'liquid', { dens: 11, visc: 0.88, fd: 1, cold: [38, 'cheese', 0.004], hot: [220, 'frico', 0.005] });
dairy('gratedcheese', 'Grated Cheese', '#f6cf47', 'powder', { dens: 11, slide: 0.5, fd: 1, hot: [60, 'meltedcheese', 0.02] });
dairy('parmesan', 'Parmesan', '#efdf9e', 'powder', { dens: 11, slide: 0.6, hot: [80, 'meltedcheese', 0.01] });
dairy('mozzarella', 'Mozzarella', '#fbf8ee', 'powder', { dens: 10.5, slide: 0, fd: 1, w: 1, hot: [60, 'meltedcheese', 0.01] });
dairy('curds', 'Curds', '#f7f3df', 'powder', { dens: 10.6, slide: 0.2, fd: 1, w: 1 });
dairy('frico', 'Crispy Cheese', '#d99a28', 'powder', { dens: 8, slide: 0, hot: [300, 'burntfood', 0.004] });
dairy('egg', 'Egg', '#f2e6d4', 'powder', { dens: 10.4, slide: 0.3, fd: 1, colors: ['#f2e6d4', '#e8d8c0', '#f8efe2'], hot: [85, 'boiledegg', 0.003], desc: 'Chop to crack it. Boil it whole for a boiled egg.' });
dairy('rawegg', 'Raw Egg', '#f6c93a', 'liquid', { dens: 10.3, visc: 0.4, fd: 1, spoil: 0.00003, hot: [70, 'friedegg', 0.02], colors: ['#f6c93a', '#f7e9b0', '#f4c02a', '#f9f3dc'] });
dairy('beatenegg', 'Beaten Egg', '#f6d24a', 'liquid', { dens: 10.3, visc: 0.3, fd: 1, hot: [70, 'scrambled', 0.02] });
dairy('eggwhite', 'Egg White', '#ece9da', 'liquid', { dens: 10.3, visc: 0.35, alpha: 0.8, hot: [63, 'cookedwhite', 0.02], desc: 'Stir with sugar for meringue.' });
dairy('friedegg', 'Fried Egg', '#fbfaf5', 'powder', { dens: 10, slide: 0.05, fd: 1, colors: ['#fbfaf5', '#fbfaf5', '#f6c93a', '#ffffff'], hot: [210, 'burntfood', 0.003] });
dairy('scrambled', 'Scrambled Egg', '#f8d646', 'powder', { dens: 10, slide: 0.3, fd: 1, colors: ['#f8d646', '#fbe070', '#f0c830'], hot: [210, 'burntfood', 0.003] });
dairy('boiledegg', 'Boiled Egg', '#f7f2e8', 'powder', { dens: 10.4, slide: 0.3, fd: 1, hot: [150, 'scrambled', 0.01, 'steam'], desc: 'Overheat it and it pops.' });
dairy('cookedwhite', 'Cooked Egg White', '#fbfaf5', 'powder', { dens: 10, slide: 0.05, fd: 1, hot: [210, 'burntfood', 0.003] });
dairy('eggshell', 'Eggshell', '#efe3cf', 'powder', { dens: 12, slide: 0.6 });
dairy('custardmix', 'Custard Mix', '#f4e2a2', 'liquid', { dens: 10.6, visc: 0.3, fd: 1, hot: [80, 'custard', 0.01] });
dairy('custard', 'Custard', '#f6d968', 'liquid', { dens: 11, visc: 0.85, sw: 1, fd: 1, hot: [200, 'burntfood', 0.002] });

// ---------- Bakery ----------
const bake = (k, n, c, state, p) => el(k, n, c, 'bakery', state, p);
bake('dough', 'Dough', '#efe0be', 'powder', { dens: 12, slide: 0, fd: 1, spoil: 0.00001, hot: [150, 'bread', 0.005], desc: 'Bake at 150°C+. Add yeast first for fluffy bread.' });
bake('proofdough', 'Proofing Dough', '#efdfba', 'powder', { dens: 11, slide: 0, beh: 'proof', life: [300, 600], die: 'risendough', hot: [60, 'risendough', 0.05], desc: 'Yeast at work. It grows!' });
bake('risendough', 'Risen Dough', '#f2e4c4', 'powder', { dens: 8, slide: 0, fd: 1, hot: [150, 'bread', 0.008] });
bake('bread', 'Bread', '#d39a4e', 'powder', { dens: 4, slide: 0, fd: 1, spoil: 0.00001, colors: ['#d39a4e', '#e6c088', '#f2e2c0', '#c88a3e'], hot: [200, 'toast', 0.003] });
bake('toast', 'Toast', '#b5732e', 'powder', { dens: 4, slide: 0, colors: ['#b5732e', '#a8682a', '#c48238'], hot: [260, 'burnttoast', 0.003] });
bake('burnttoast', 'Burnt Toast', '#3a2414', 'powder', { dens: 4, slide: 0, emit: ['smoke', 0.02, 150], hot: [380, 'charcoal', 0.005] });
bake('frenchtoast', 'French Toast', '#d8a040', 'powder', { dens: 5, slide: 0, sw: 1, hot: [240, 'burntfood', 0.003] });
bake('cinnamontoast', 'Cinnamon Toast', '#b06a30', 'powder', { dens: 4, slide: 0, sw: 1, colors: ['#b06a30', '#c48c5b', '#9d5429'] });
bake('garlicbread', 'Garlic Bread', '#c89a4a', 'powder', { dens: 4, slide: 0, colors: ['#c89a4a', '#efe0a6', '#4aa832'], emit: ['aroma', 0.004, 60] });
bake('grilledcheese', 'Grilled Cheese', '#c8902e', 'powder', { dens: 5, slide: 0, colors: ['#c8902e', '#f6be2e', '#b5732e'] });
bake('croutons', 'Croutons', '#c48a3c', 'powder', { dens: 4, slide: 0.6 });
bake('batter', 'Batter', '#efd697', 'liquid', { dens: 11.5, visc: 0.75, fd: 1, hot: [150, 'pancake', 0.02], desc: 'Pour on a hot pan for pancakes.' });
bake('cakebatter', 'Cake Batter', '#f6dd9e', 'liquid', { dens: 11.5, visc: 0.8, sw: 1, fd: 1, hot: [155, 'cake', 0.008] });
bake('browniebatter', 'Brownie Batter', '#55301a', 'liquid', { dens: 12, visc: 0.85, sw: 1, fd: 1, hot: [155, 'brownie', 0.008] });
bake('bananabatter', 'Banana Batter', '#efd88a', 'liquid', { dens: 11.5, visc: 0.85, sw: 1, fd: 1, hot: [155, 'bananabread', 0.008] });
bake('pancake', 'Pancake', '#d8a050', 'powder', { dens: 6, slide: 0, sw: 1, colors: ['#d8a050', '#e8b866', '#c88a3e'], hot: [230, 'burntfood', 0.003] });
bake('cake', 'Cake', '#f4d58a', 'powder', { dens: 5, slide: 0, sw: 1, fd: 1, colors: ['#f4d58a', '#f8e2a8', '#e8c070'], emit: ['sweetaroma', 0.003, 80], hot: [220, 'burntfood', 0.002] });
bake('frostedcake', 'Frosted Cake', '#f7eff5', 'powder', { dens: 5, slide: 0, sw: 1, colors: ['#f7eff5', '#f4d58a', '#ff4f6d', '#4fd6ff'] });
bake('brownie', 'Brownie', '#4a2412', 'powder', { dens: 6, slide: 0, sw: 1, colors: ['#4a2412', '#3a1c0e', '#5a2e18'], hot: [230, 'burntfood', 0.002] });
bake('bananabread', 'Banana Bread', '#a8682a', 'powder', { dens: 6, slide: 0, sw: 1, emit: ['sweetaroma', 0.003, 80], hot: [230, 'burntfood', 0.002] });
bake('creamedbutter', 'Creamed Butter', '#f8e6a0', 'powder', { dens: 9, slide: 0.05, sw: 1, hot: [40, 'meltedbutter', 0.005] });
bake('cookiedough', 'Cookie Dough', '#d8b07a', 'powder', { dens: 11, slide: 0, sw: 1, colors: ['#d8b07a', '#d0a46a', '#3a1a0a', '#d8b07a'], hot: [160, 'cookie', 0.006] });
bake('cookie', 'Cookie', '#c88a46', 'powder', { dens: 6, slide: 0.1, sw: 1, colors: ['#c88a46', '#b87a38', '#3a1a0a', '#d89a56'], emit: ['sweetaroma', 0.003, 80], hot: [230, 'burntfood', 0.003] });
bake('cookiecrumbs', 'Cookie Crumbs', '#ae7640', 'powder', { dens: 8, slide: 0.6, sw: 1 });
bake('graham', 'Graham Cracker', '#c88a46', 'powder', { dens: 6, slide: 0, sw: 1, colors: ['#c88a46', '#b87a3a', '#d49a56'] });
bake('grahamcrumbs', 'Graham Crumbs', '#c48a4a', 'powder', { dens: 8, slide: 0.6, sw: 1 });
bake('piecrust', 'Pie Crust', '#e8c890', 'powder', { dens: 9, slide: 0, hot: [190, 'burntfood', 0.001] });
bake('pie', 'Fruit Pie', '#c88a3a', 'powder', { dens: 8, slide: 0, sw: 1, colors: ['#c88a3a', '#d8a04a', '#a01030', '#e8c890'], emit: ['sweetaroma', 0.003, 80] });
bake('pastadough', 'Pasta Dough', '#f2d98a', 'powder', { dens: 12, slide: 0, decay: [0.001, 'pasta'], desc: 'Leave it to dry into pasta.' });
bake('pasta', 'Dry Pasta', '#f3d27a', 'powder', { dens: 15, slide: 0.5, colors: ['#f3d27a', '#e8c468', '#f8dc8c'], desc: 'Boil it.' });
bake('cookedpasta', 'Cooked Pasta', '#f6e2a2', 'powder', { dens: 11, slide: 0.25, fd: 1, hot: [230, 'burntfood', 0.003] });
bake('spaghetti', 'Spaghetti', '#e8a050', 'powder', { dens: 11, slide: 0.2, fd: 1, colors: ['#f6e2a2', '#b51b10', '#f6e2a2', '#c42418'], emit: ['aroma', 0.004, 60] });
bake('macncheese', 'Mac & Cheese', '#f6b72a', 'powder', { dens: 11, slide: 0.15, fd: 1, colors: ['#f6b72a', '#f8c840', '#e8a020'] });
bake('ramenblock', 'Instant Noodles', '#e8c070', 'powder', { dens: 6, slide: 0.1, desc: 'Just add boiling water.' });
bake('masa', 'Masa', '#e8cc78', 'powder', { dens: 12, slide: 0, hot: [150, 'tortilla', 0.006] });
bake('tortilla', 'Tortilla', '#efd9a0', 'powder', { dens: 6, slide: 0, colors: ['#efd9a0', '#d8b070', '#f6e4b8'], hot: [250, 'burntfood', 0.003] });
bake('tortillachips', 'Tortilla Chips', '#e8b84a', 'powder', { dens: 5, slide: 0.6 });
bake('pizzabase', 'Pizza Base', '#d8784a', 'powder', { dens: 11, slide: 0, colors: ['#efe0be', '#cd2717'] });
bake('rawpizza', 'Raw Pizza', '#f2d060', 'powder', { dens: 11, slide: 0, colors: ['#efe0be', '#cd2717', '#f6cf47', '#f6cf47'], hot: [180, 'pizza', 0.006] });
bake('pizza', 'Pizza', '#e8b03a', 'powder', { dens: 8, slide: 0, colors: ['#e8b03a', '#c8301a', '#f6d060', '#a0501a'], emit: ['aroma', 0.004, 80], hot: [260, 'burntfood', 0.002] });
bake('donut', 'Donut', '#c8803a', 'powder', { dens: 6, slide: 0.2, sw: 1, colors: ['#c8803a', '#d8904a', '#b87030'] });
bake('glazeddonut', 'Glazed Donut', '#e0a050', 'powder', { dens: 6, slide: 0.2, sw: 1, colors: ['#e0a050', '#f8f6ef', '#c8803a'] });
bake('sprinkledonut', 'Sprinkle Donut', '#f2a0c0', 'powder', { dens: 6, slide: 0.2, sw: 1, colors: ['#f2a0c0', '#ff4f6d', '#ffd13d', '#4fd6ff', '#c8803a'] });
bake('pretzeldough', 'Pretzel Dough', '#e8d4a8', 'powder', { dens: 11, slide: 0, hot: [150, 'pretzel', 0.006] });
bake('pretzel', 'Pretzel', '#7a3a12', 'powder', { dens: 6, slide: 0.1, colors: ['#7a3a12', '#8a4418', '#ffffff'] });

// ---------- Sweets ----------
const sweet = (k, n, c, state, p) => el(k, n, c, 'sweets', state, Object.assign({ sw: 1 }, p));
sweet('chocolate', 'Chocolate', '#5a2e15', 'powder', { dens: 12, slide: 0, hot: [34, 'meltedchoc', 0.01] });
sweet('meltedchoc', 'Melted Chocolate', '#5a2f17', 'liquid', { dens: 12.5, visc: 0.7, cold: [28, 'chocolate', 0.01], hot: [230, 'burntfood', 0.003, 'smoke'] });
sweet('whitechoc', 'White Chocolate', '#f0e0c0', 'powder', { dens: 12, slide: 0, hot: [30, 'meltedwhite', 0.01] });
sweet('meltedwhite', 'Melted White Choc', '#efdcb8', 'liquid', { dens: 12.5, visc: 0.7, cold: [26, 'whitechoc', 0.01], hot: [200, 'burntfood', 0.003] });
sweet('chocchips', 'Chocolate Chips', '#3a1a0a', 'powder', { dens: 12, slide: 0.8, hot: [34, 'meltedchoc', 0.02] });
sweet('caramel', 'Caramel', '#c06a1a', 'liquid', { dens: 13.5, visc: 0.75, hot: [205, 'burntsugar', 0.004, 'smoke'], cold: [50, 'hardcandy', 0.003], emit: ['sweetaroma', 0.004, 120] });
sweet('burntsugar', 'Burnt Sugar', '#3a1a08', 'liquid', { dens: 13.5, visc: 0.7, emit: ['smoke', 0.01, 150], hot: [320, 'charcoal', 0.01, 'smoke'] });
sweet('hardcandy', 'Hard Candy', '#e8303a', 'powder', { dens: 15, slide: 0.2, colors: ['#e8303a', '#f0a020', '#30a0e8', '#40c040'], hot: [150, 'caramel', 0.01] });
sweet('marshmallow', 'Marshmallow', '#fbf7f7', 'powder', { dens: 3, slide: 0.3, hot: [110, 'toastedmallow', 0.01], desc: 'Toast it over a flame.' });
sweet('toastedmallow', 'Toasted Marshmallow', '#d8a060', 'powder', { dens: 3, slide: 0.2, emit: ['sweetaroma', 0.006, 80], hot: [200, 'burntmallow', 0.01] });
sweet('burntmallow', 'Burnt Marshmallow', '#2a1810', 'powder', { dens: 3, slide: 0.2, burn: 0.1, ign: 260 });
sweet('mallowgoo', 'Marshmallow Goo', '#f7efef', 'liquid', { dens: 10, visc: 0.92, cold: [30, 'marshmallow', 0.003] });
sweet('smore', "S'more", '#c88a46', 'powder', { dens: 5, slide: 0, colors: ['#c88a46', '#fbf7f7', '#5a2e15', '#d8a060'] });
sweet('gummy', 'Gummy Bears', '#ff6a4a', 'powder', { dens: 13, slide: 0.6, colors: ['#ff6a4a', '#ffd040', '#40d060', '#ff3050', '#ffffff'], hot: [60, 'meltedcandy', 0.01] });
sweet('meltedcandy', 'Melted Candy', '#e0508a', 'liquid', { dens: 13, visc: 0.8, cold: [40, 'gummy', 0.004] });
sweet('cottoncandy', 'Cotton Candy', '#f8a3d2', 'powder', { dens: 1.5, slide: 0.2, colors: ['#f8a3d2', '#a8d8f8', '#fcc8e4'], hot: [100, 'caramel', 0.05], desc: 'Dissolves the instant it gets wet.' });
sweet('rockcandy', 'Rock Candy', '#bfe6ff', 'powder', { dens: 16, slide: 0, alpha: 0.85, colors: ['#bfe6ff', '#d8f0ff', '#a8d8f8'], hot: [186, 'caramel', 0.01], desc: 'Grows slowly in sugar water.' });
sweet('toffee', 'Toffee', '#b8702a', 'powder', { dens: 13, slide: 0 });
sweet('fudge', 'Fudge', '#4a2412', 'powder', { dens: 13, slide: 0, hot: [60, 'meltedchoc', 0.003] });
sweet('truffle', 'Truffles', '#3a1a0a', 'powder', { dens: 12, slide: 0.4, colors: ['#3a1a0a', '#5a2e15', '#2a1206'] });
sweet('mint', 'Mint Candy', '#f4fff8', 'powder', { dens: 15, slide: 0.7, colors: ['#f4fff8', '#ff3a3a', '#f4fff8', '#e0f8ec'], desc: 'Drop into cola. Trust us.' });
sweet('honeycomb', 'Honeycomb Toffee', '#e0a030', 'powder', { dens: 4, slide: 0, colors: ['#e0a030', '#f0c050', '#c88a20'] });
sweet('brittle', 'Peanut Brittle', '#c07a2a', 'powder', { dens: 13, slide: 0, colors: ['#c07a2a', '#c99558', '#a86420'] });
sweet('meringue', 'Meringue', '#fbf7f0', 'powder', { dens: 2.5, slide: 0.05, hot: [95, 'meringuecookie', 0.006] });
sweet('meringuecookie', 'Meringue Cookie', '#f2dcb4', 'powder', { dens: 2.5, slide: 0.2, hot: [200, 'burntfood', 0.003] });
sweet('cremebrulee', 'Creme Brulee', '#c48a2c', 'powder', { dens: 11, slide: 0, colors: ['#c48a2c', '#f6d968', '#a86a1e'] });
sweet('pudding', 'Chocolate Pudding', '#86562f', 'liquid', { dens: 11, visc: 0.85, fd: 1 });
sweet('jellomix', 'Jello Mix', '#de1a4a', 'liquid', { dens: 10.4, w: 1, cold: [8, 'jello', 0.004] });
sweet('jello', 'Jello', '#e8285a', 'powder', { dens: 10.6, slide: 0.02, alpha: 0.85, hot: [40, 'jellomix', 0.005], colors: ['#e8285a', '#f03a6a', '#d0184a'] });
sweet('sherbet', 'Sherbet Powder', '#f7ee9d', 'powder', { dens: 24, slide: 0.8, colors: ['#f7ee9d', '#f8c0d0', '#c0f0d0'], desc: 'Fizzes on anything wet.' });

// ---------- Living things & garden ----------
const bio = (k, n, c, state, p) => el(k, n, c, 'life', state, p);
bio('soil', 'Soil', '#5b3a1f', 'powder', { dens: 30, slide: 0.3, diggable: 1, colors: ['#5b3a1f', '#4a2e18', '#6a4426'], desc: 'Plant beans or wheat in it.' });
bio('compost', 'Compost', '#3a2a14', 'powder', { dens: 28, slide: 0.3, diggable: 1, colors: ['#3a2a14', '#2e2210', '#4a361c'] });
bio('mold', 'Mold', '#6fa34a', 'powder', { dens: 8, slide: 0.15, beh: 'mold', hot: [70, 'ash', 0.02], colors: ['#6fa34a', '#4c7f30', '#a3c46e', '#e0e8d0'], desc: 'Grows on food left out warm. Spreads.' });
bio('ant', 'Ant', '#a8301a', 'life', { beh: 'ant', colors: ['#a8301a', '#c03a20', '#8a2412'], burn: 0.3, ign: 60, burnTo: 'deadbug', desc: 'Worker ant. Digs tunnels in soil, piles the dirt into anthills and carries food home to the queen.' });
bio('antqueen', 'Queen Ant', '#f0b040', 'life', { beh: 'antqueen', burn: 0.3, ign: 60, burnTo: 'deadbug', alive: 1, deadTo: 'deadbug', desc: 'Drop her on soil. She digs down, carves a den and lays eggs. Workers bring her food so she lays faster.' });
bio('antegg', 'Ant Egg', '#f4f0e4', 'powder', { dens: 8, slide: 0.2, alive: 1, deadTo: 'deadbug', life: [900, 1600], die: 'ant', hot: [45, 'deadbug', 0.02], cold: [0, 'deadbug', 0.01], colors: ['#f4f0e4', '#fffaf0', '#ece6d6'], desc: 'Hatches into a worker ant.' });
bio('packedsoil', 'Packed Soil', '#3e2616', 'solid', { cond: 0.1, colors: ['#3e2616', '#352012', '#48301c'], desc: 'Tunnel walls cemented by ants. Holds its shape.' });
bio('antfood', 'Stored Food', '#c8a050', 'powder', { dens: 12, slide: 0.1, colors: ['#c8a050', '#d8b468', '#a8803a'], desc: 'Food the workers carried home for the queen.' });
R('antqueen', 'water', 'deadbug', '=', 0.002);
R('antegg', 'water', 'deadbug', '=', 0.004);
C('packedsoil', 'soil');
bio('fly', 'Fruit Fly', '#6a5a46', 'life', { beh: 'fly', burn: 0.3, ign: 60, burnTo: 'deadbug', desc: 'Loves fruit and mold.' });
bio('worm', 'Worm', '#d47a7a', 'life', { beh: 'worm', burn: 0.3, ign: 60, burnTo: 'deadbug', desc: 'Turns scraps into compost.' });
bio('deadbug', 'Dead Bug', '#3a2f28', 'powder', { dens: 10, slide: 0.5, hidden: 1 });
bio('seedling', 'Bean Seedling', '#8ccf4a', 'solid', { beh: 'grow', grow: { stem: 'beanvine', leaf: 'leaf', top: 'greenbeans', h: [20, 45], branch: 0.12, fruit: 3 }, burn: 0.05, ign: 200 });
bio('beanvine', 'Bean Vine', '#3f8a2a', 'solid', { burn: 0.03, ign: 250, hot: [140, 'burntfood', 0.002], colors: ['#3f8a2a', '#357a24', '#4a9a32'] });
bio('leaf', 'Leaf', '#5fb03a', 'solid', { burn: 0.05, ign: 220, hot: [140, 'burntfood', 0.002], colors: ['#5fb03a', '#6cc044', '#52a032'] });
bio('beanstalk', 'Giant Beanstalk', '#2f7a22', 'solid', { beh: 'grow', grow: { stem: 'beanvine', leaf: 'leaf', top: 'magicbean', h: [150, 200], branch: 0.3, fruit: 6, wide: 1 }, burn: 0.02, ign: 250 });
bio('wheatsprout', 'Wheat Sprout', '#b5d06a', 'solid', { beh: 'grow', grow: { stem: 'wheatstalk', top: 'wheat', h: [12, 26], branch: 0, fruit: 4 }, burn: 0.1, ign: 200 });
bio('wheatstalk', 'Wheat Stalk', '#c9a84a', 'solid', { burn: 0.1, ign: 220, colors: ['#c9a84a', '#bfa040', '#d4b258'] });
bio('spores', 'Mushroom Spores', '#cfc6b2', 'powder', { dens: 4, slide: 0.8, desc: 'Sprinkle on compost.' });
bio('mycelium', 'Mycelium', '#e8e0cc', 'powder', { dens: 26, slide: 0.2, emit: ['mushroom', 0.0006, 5], colors: ['#e8e0cc', '#3a2a14', '#d8d0bc'] });
