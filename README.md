# Bean Box

A falling-sand kitchen and chemistry sandbox. Pour, pile, heat, stir, chop, electrify and magnetise more than 1,100 elements: food, every element of the periodic table from hydrogen to curium, metals, alloys, ores, rocks, gems, acids, bases, salts and gases. Around 1,100 recipes plus general chemistry rules decide how they all react.

Open `index.html` in any modern browser. No build step or server is needed. The kitchen starts empty; press **Demo** for a ready-made starter scene.

## Controls

| Input | Action |
| --- | --- |
| Left drag | Draw the left (red) element |
| Right drag | Draw the right (blue) element, the Eraser by default |
| Shift + drag | Straight line |
| Middle click | Pick the element under the cursor |
| `Delete` (hold) | Erase under the cursor; `Shift` + `Delete` removes the whole connected piece |
| Click a Switch | Flip it on or off |
| Wheel or `[` `]` | Brush size |
| `Space` / `F` | Pause / step one frame |
| `H` / `G` / `M` | Heat view / fire glow / magnetic field view |
| `R` | Replace mode (paint over existing particles) |
| `Tab` | Round or square brush |
| `Ctrl` + `S` | Saves |
| `/` | Search elements |

Soaked and cooked beans, frozen mercury and other in-between forms are made by cooking or reactions rather than picked from a menu. Search finds every element, including ones that are not in a menu.

## What's in the kitchen

- **Tools**: Eraser, Heat, Cool, Stir (whisk), Chop (knife and grinder), Lighter, Sample.
- **Kitchen**: pans in steel, cast iron and copper, foil, glass, burners, gas rings, oven coils, fridge and freezer coils, a microwave, faucet, spout, drain, sponges and more. Electric appliances only run while wired to a Battery or Wall Outlet and glow while on; gas rings must be lit with a flame and go out with water.
- **Food**: 13 kinds of beans (dry, soaked and cooked), 22 vegetables (raw, chopped and cooked), 17 fruits (whole, juice, jam and ice pops), 13 meats and seafoods, dairy and eggs, breads, pastas, pizza, cakes, candy, sauces, soups and drinks.
- **Periodic table**: elements 1 to 96, each with its real melting point, density and reactivity. Metals come as blocks, dust and molten liquid. The Periodic Table button opens a clickable table.
- **Earth and chemistry**: sand, rocks, clay, cement, plaster, lava, 21 ores, 17 gems, metal oxides, about 60 salt solutions and crystals, strong and weak acids, bases, explosives, coloured flames, radiation and noble gases.
- **Electricity**: batteries, wall outlets, copper wire, on/off switches, tungsten filaments, nichrome heating wire and neon tubes. Everything carrying current glows. Current splits water, lights gases and electroplates metal.
- **Magnets**: neodymium, samarium-cobalt, alnico, ferrite and fridge magnets, lodestone, magnetised steel, battery-powered electromagnets and liquid-helium superconducting magnets. They pull iron, steel, nickel, cobalt, magnetite and ferrofluid, lose their pull above their Curie point, and push away bismuth, pyrolytic graphite and chilled superconductors so they float. Mu-metal blocks fields, an Induction Hob heats only magnetic pans, a Magnetic Stirrer mixes what sits on it, and a Field Compass shows the field's direction.
- **Ant colonies**: worker ants dig tunnels through soil, sand and clay, cement the walls, pile dirt into anthills and carry food underground. A Queen Ant digs a den and lays eggs that hatch into more workers, faster when she is fed.
- **Physics**: every particle carries a temperature. Heat spreads through metal and is blocked by glass and the counter. Powders pile, liquids layer by density (oil floats on water), gases rise or sink (CO2 sinks and smothers fire), and things boil, freeze, melt, cook, burn, ferment, rot and grow.

## A few combos to try

- Sodium, potassium or cesium dropped in water (each bigger than the last).
- An iron nail in Copper Sulfate Solution, or copper in Silver Nitrate Solution.
- Zinc in Hydrochloric Acid; gold in Aqua Regia; vinegar on limestone or eggshell.
- Rust stirred with Aluminum Dust makes thermite. Light it with burning magnesium.
- Hematite or malachite heated with Charcoal smelts into molten metal. Molten copper and tin make bronze.
- A Battery touching Copper Wire that runs into a glass tube of Neon, Argon or Helium.
- Sulfuric Acid on sugar, Cooking Oil with Lye, Peroxide with Dish Soap and Yeast.
- Metal dust or salt crystals sprinkled into a flame.
- Iron Filings mixed into sand, then a Neodymium Magnet held above them.
- A Superconductor chilled in Liquid Nitrogen, dropped over a magnet.
- A cast-iron pan and a copper pot side by side on an Induction Hob.
- An Electromagnet wired to a Battery, then the battery erased.
- A glass tank of Soil with a Queen Ant, a few Ants and some sugar on top.
- Battery, Copper Wire, a Switch and an Electric Burner: click the switch.

- Steel pot of water on a Burner, then dry beans: they soak, cook, and slowly release Bean Gas. Keep flames away.
- Cooking Oil and Popcorn Kernels in a hot pan.
- Mint Candy dropped into Cola.
- Baking Soda and Vinegar.
- A Grease Fire hit with Water (stand back), or smothered with Salt.
- Flour + Water = Dough, add Yeast, bake on an Oven Coil.
- Heavy Cream + Stir = Whipped Cream, keep stirring for Butter.
- A Magic Bean planted in Soil.
- Grapes in the Microwave.

**Saves** keeps named kitchens with thumbnails in your browser, autosaves every minute, and can copy a compact save code to back up or share a kitchen.

The **Cookbook** button lists every recipe; results you have not made yet stay hidden until you discover them. Discoveries are kept in your browser too.

## Code layout

- `js/elements.js`: element registry, tools, kitchen hardware, base liquids, powders, spices, gases, fire and frozen elements
- `js/food.js`: generated families of beans, produce, fruit and meat
- `js/pantry.js`: soups, sauces, drinks, dairy, bakery, sweets and living things
- `js/metals.js`: metals, alloys, oxides, ores, salts and flame tests
- `js/minerals.js`: rocks, earth, building materials, molten minerals and gems
- `js/chemistry.js`: acids, bases, reagents, explosives, gases, coloured flames, radiation and power parts
- `js/periodic.js`: non-metals and halogens, plus the periodic table layout
- `js/magnets.js`: magnets, electromagnets, superconductors and magnetic materials
- `js/reactions.js`: touch, stir and chop recipes for food
- `js/engine.js`: simulation (movement, heat conduction, recipes, general chemistry, electricity, magnetism, radiation, save/load)
- `js/ui.js`: rendering, input, menus, cookbook and the main loop
