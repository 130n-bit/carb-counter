// Crumb — data layer (seed meals, food database, copy)

// Today's seed meals (logged earlier today)
const SEED_MEALS = [
  {
    id: 'm1',
    meal: 'Breakfast',
    glyph: 'b',
    tone: 'sun',
    time: '8:14 am',
    timeSort: 8.23,
    items: [
      { name: 'Oatmeal, ½ cup dry',          carbs: 27 },
      { name: 'Banana, medium',              carbs: 27 },
      { name: 'Honey, 1 tsp',                carbs: 6  },
    ],
  },
  {
    id: 'm2',
    meal: 'Morning snack',
    glyph: 's',
    tone: 'sage',
    time: '10:30 am',
    timeSort: 10.5,
    items: [
      { name: 'Apple, medium',               carbs: 25 },
    ],
  },
  {
    id: 'm3',
    meal: 'Lunch',
    glyph: 'l',
    tone: 'clay',
    time: '12:45 pm',
    timeSort: 12.75,
    items: [
      { name: 'Turkey sandwich, whole-wheat', carbs: 30 },
      { name: 'Side salad, vinaigrette',      carbs: 6  },
      { name: 'Iced tea, unsweetened',        carbs: 0  },
    ],
  },
];

const MEAL_TONE = { Breakfast: 'sun', 'Morning snack': 'sage', Lunch: 'clay', 'Afternoon snack': 'sky', Dinner: 'paper', Snack: 'sage' };
const MEAL_GLYPH = { Breakfast: 'b', 'Morning snack': 's', Lunch: 'l', 'Afternoon snack': 'a', Dinner: 'd', Snack: 's' };

// Quick recent chips for Today
const QUICK_FOODS = [
  { id: 'q1', name: 'Apple',            glyph: 'a', carbs: 25, base: 25, units: ['small', 'medium', 'large'], unitVals: [20, 25, 31], defaultUnit: 1 },
  { id: 'q2', name: 'Coffee · oat milk',glyph: 'c', carbs: 8,  base: 8,  units: ['short','tall','grande'],   unitVals: [5, 8, 12], defaultUnit: 1 },
  { id: 'q3', name: 'Greek yogurt',     glyph: 'g', carbs: 12, base: 12, units: ['½ cup','1 cup'],           unitVals: [6, 12], defaultUnit: 1 },
  { id: 'q4', name: 'Brown rice',       glyph: 'r', carbs: 45, base: 45, units: ['½ cup','1 cup'],           unitVals: [22, 45], defaultUnit: 1 },
  { id: 'q5', name: 'Almonds',          glyph: 'n', carbs: 6,  base: 6,  units: ['¼ cup','½ cup'],           unitVals: [6, 12], defaultUnit: 0 },
];

// Food database — used for search
const FOOD_DB = [
  // Bananas & breakfast
  { id: 'f1', name: 'Banana',            sub: 'Whole · raw',          glyph: 'b', base: 27, units: ['small','medium','large'], unitVals: [23, 27, 35], defaultUnit: 1 },
  { id: 'f2', name: 'Banana bread',      sub: 'Homemade · 1 slice',   glyph: 'b', base: 32, units: ['slice'],                 unitVals: [32], defaultUnit: 0 },
  { id: 'f3', name: 'Banana smoothie',   sub: 'With almond milk',     glyph: 'b', base: 41, units: ['12 oz'],                 unitVals: [41], defaultUnit: 0 },
  { id: 'f4', name: 'Banana pancakes',   sub: 'Stack of two',         glyph: 'b', base: 48, units: ['1 pancake','2 pancakes','3 pancakes'], unitVals: [24, 48, 72], defaultUnit: 1 },
  { id: 'f5', name: 'Banana muffin',     sub: 'Bakery · medium',      glyph: 'b', base: 35, units: ['medium'],                unitVals: [35], defaultUnit: 0 },
  { id: 'f6', name: 'Banana chips',      sub: '1 oz · ~17 chips',     glyph: 'b', base: 18, units: ['1 oz'],                  unitVals: [18], defaultUnit: 0 },

  // Apple-ish
  { id: 'f10', name: 'Apple',            sub: 'Whole · raw',          glyph: 'a', base: 25, units: ['small','medium','large'], unitVals: [20, 25, 31], defaultUnit: 1 },
  { id: 'f11', name: 'Apple juice',      sub: '8 oz · unsweetened',   glyph: 'a', base: 28, units: ['8 oz','12 oz'],           unitVals: [28, 42], defaultUnit: 0 },
  { id: 'f12', name: 'Apple pie',        sub: 'Bakery · 1 slice',     glyph: 'a', base: 41, units: ['slice'],                 unitVals: [41], defaultUnit: 0 },

  // Bread & grains
  { id: 'f20', name: 'Bread, whole-wheat', sub: '1 slice',            glyph: 'b', base: 14, units: ['1 slice','2 slices'],    unitVals: [14, 28], defaultUnit: 0 },
  { id: 'f21', name: 'Bagel, plain',     sub: 'Medium · 1 whole',     glyph: 'b', base: 48, units: ['½','whole'],             unitVals: [24, 48], defaultUnit: 1 },
  { id: 'f22', name: 'Brown rice',       sub: 'Cooked',               glyph: 'r', base: 45, units: ['½ cup','1 cup'],         unitVals: [22, 45], defaultUnit: 1 },
  { id: 'f23', name: 'Pasta, spaghetti', sub: 'Cooked',               glyph: 'p', base: 43, units: ['½ cup','1 cup'],         unitVals: [22, 43], defaultUnit: 1 },

  // Beans & sides
  { id: 'f30', name: 'Black beans',      sub: 'Canned · drained',     glyph: 'b', base: 20, units: ['½ cup','1 cup'],         unitVals: [20, 40], defaultUnit: 0 },
  { id: 'f31', name: 'Berries, mixed',   sub: 'Fresh',                glyph: 'b', base: 14, units: ['½ cup','1 cup'],         unitVals: [7, 14], defaultUnit: 1 },

  // Drinks
  { id: 'f40', name: 'Beer, lager',      sub: '12 oz · regular',      glyph: 'b', base: 13, units: ['12 oz'],                 unitVals: [13], defaultUnit: 0 },
];

const POPULAR_FOODS = [FOOD_DB[0], FOOD_DB[9], FOOD_DB[20], FOOD_DB[22]];
const RECENT_SEARCHES = ['banana', 'oatmeal', 'whole-wheat bread', 'greek yogurt'];

const MEAL_CHOICES = [
  { id: 'breakfast', label: 'Breakfast', glyph: 'b' },
  { id: 'snack', label: 'Snack', glyph: 's' },
  { id: 'lunch', label: 'Lunch', glyph: 'l' },
  { id: 'dinner', label: 'Dinner', glyph: 'd' },
];

Object.assign(window, {
  SEED_MEALS, FOOD_DB, QUICK_FOODS, POPULAR_FOODS, RECENT_SEARCHES, MEAL_CHOICES,
  MEAL_TONE, MEAL_GLYPH,
});
