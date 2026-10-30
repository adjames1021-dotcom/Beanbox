# Bean Box

A falling-sand kitchen sandbox. Pour, pile, heat, stir and chop more than 550 cooking elements and watch around 950 recipes and chemical reactions play out pixel by pixel.

Open `index.html` in any modern browser. No build step or server is needed.

## Controls

| Input | Action |
| --- | --- |
| Left drag | Draw the left (red) element |
| Right drag | Draw the right (blue) element, the Eraser by default |
| Shift + drag | Straight line |
| Middle click | Pick the element under the cursor |
| Wheel or `[` `]` | Brush size |
| `Space` / `F` | Pause / step one frame |
| `H` / `G` | Heat view / fire glow |
| `R` | Replace mode (paint over existing particles) |
| `Tab` | Round or square brush |
| `/` | Search elements |

## What's in the kitchen

- **Tools**: Eraser, Heat, Cool, Stir (whisk), Chop (knife and grinder), Lighter, Sample.
- **Kitchen**: pans in steel, cast iron and copper, foil, glass, burners, gas rings, oven coils, fridge and freezer coils, a microwave, faucet, spout, drain, sponges and more.
- **Food**: 13 kinds of beans (dry, soaked and cooked), 22 vegetables (raw, chopped and cooked), 17 fruits (whole, juice, jam and ice pops), 13 meats and seafoods, dairy and eggs, breads, pastas, pizza, cakes, candy, sauces, soups and drinks.
- **Physics**: every particle carries a temperature. Heat spreads through metal and is blocked by glass and the counter. Powders pile, liquids layer by density (oil floats on water), gases rise or sink (CO2 sinks and smothers fire), and things boil, freeze, melt, cook, burn, ferment, rot and grow.

## A few combos to try

- Steel pot of water on a Burner, then dry beans: they soak, cook, and slowly release Bean Gas. Keep flames away.
- Cooking Oil and Popcorn Kernels in a hot pan.
- Mint Candy dropped into Cola.
- Baking Soda and Vinegar.
- A Grease Fire hit with Water (stand back), or smothered with Salt.
- Flour + Water = Dough, add Yeast, bake on an Oven Coil.
- Heavy Cream + Stir = Whipped Cream, keep stirring for Butter.
- A Magic Bean planted in Soil.
- Grapes in the Microwave.

The **Cookbook** button lists every recipe; results you have not made yet stay hidden until you discover them. Discoveries and saves are kept in your browser.

## Code layout

- `js/elements.js`: element registry, tools, kitchen hardware, base liquids, powders, spices, gases, fire and frozen elements
- `js/food.js`: generated families of beans, produce, fruit and meat
- `js/pantry.js`: soups, sauces, drinks, dairy, bakery, sweets and living things
- `js/reactions.js`: touch, stir and chop recipes
- `js/engine.js`: simulation (movement, heat conduction, reactions, special behaviours, save/load)
- `js/ui.js`: rendering, input, menus, cookbook and the main loop
