export const SEED_MEALS = [
  {
    id: 'm1',
    meal: 'Breakfast',
    glyph: 'b',
    tone: 'sun',
    time: '8:14 am',
    timeSort: 8.23,
    items: [
      { name: 'Oatmeal, ½ cup dry', carbs: 27 },
      { name: 'Banana, medium', carbs: 27 },
      { name: 'Honey, 1 tsp', carbs: 6 },
    ],
  },
  {
    id: 'm2',
    meal: 'Morning snack',
    glyph: 's',
    tone: 'sage',
    time: '10:30 am',
    timeSort: 10.5,
    items: [{ name: 'Apple, medium', carbs: 25 }],
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
      { name: 'Side salad, vinaigrette', carbs: 6 },
      { name: 'Iced tea, unsweetened', carbs: 0 },
    ],
  },
]

export const MEAL_TONE = {
  Breakfast: 'sun',
  'Morning snack': 'sage',
  Lunch: 'clay',
  'Afternoon snack': 'sky',
  Dinner: 'paper',
  Snack: 'sage',
}
export const MEAL_GLYPH = {
  Breakfast: 'b',
  'Morning snack': 's',
  Lunch: 'l',
  'Afternoon snack': 'a',
  Dinner: 'd',
  Snack: 's',
}

export const RECENT_TOTALS = [168, 142, 215, 195, 132, 158]

export const QUICK_FOODS = [
  { id: 'q1', name: 'Apple', glyph: 'a', carbs: 25, base: 25, units: ['small', 'medium', 'large'], unitVals: [20, 25, 31], defaultUnit: 1 },
  { id: 'q2', name: 'Coffee · oat milk', glyph: 'c', carbs: 8, base: 8, units: ['short', 'tall', 'grande'], unitVals: [5, 8, 12], defaultUnit: 1 },
  { id: 'q3', name: 'Greek yogurt', glyph: 'g', carbs: 12, base: 12, units: ['½ cup', '1 cup'], unitVals: [6, 12], defaultUnit: 1 },
  { id: 'q4', name: 'Brown rice', glyph: 'r', carbs: 45, base: 45, units: ['½ cup', '1 cup'], unitVals: [22, 45], defaultUnit: 1 },
  { id: 'q5', name: 'Almonds', glyph: 'n', carbs: 6, base: 6, units: ['¼ cup', '½ cup'], unitVals: [6, 12], defaultUnit: 0 },
]

export const MEAL_CHOICES = [
  { id: 'breakfast', label: 'Breakfast', glyph: 'b' },
  { id: 'snack', label: 'Snack', glyph: 's' },
  { id: 'lunch', label: 'Lunch', glyph: 'l' },
  { id: 'dinner', label: 'Dinner', glyph: 'd' },
]

// Returns today's date as YYYY-MM-DD
export const todayKey = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const HISTORY_KEY = 'crumb.history'
const CUSTOM_KEY  = 'crumb.customFoods'
const FAVS_KEY    = 'crumb.favourites'

// --- History (31-day meal log) ---

const pruneOldEntries = (history) => {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 31)
  cutoff.setHours(0, 0, 0, 0)
  const pruned = {}
  for (const [key, val] of Object.entries(history)) {
    if (new Date(key) >= cutoff) pruned[key] = val
  }
  return pruned
}

export const loadHistory = () => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (!raw) return {}
    return JSON.parse(raw) || {}
  } catch { return {} }
}

export const saveHistory = (history) => {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(pruneOldEntries(history)))
  } catch {}
}

export const loadTodayMeals = () => {
  // Migrate from old single-day key if present
  try {
    const oldRaw = localStorage.getItem('crumb.meals')
    if (oldRaw) {
      const old = JSON.parse(oldRaw)
      if (old?.date === new Date().toDateString() && Array.isArray(old?.meals)) {
        const history = loadHistory()
        history[todayKey()] = old.meals
        saveHistory(history)
        localStorage.removeItem('crumb.meals')
        return old.meals
      }
      localStorage.removeItem('crumb.meals')
    }
  } catch {}
  const history = loadHistory()
  return history[todayKey()] || null
}

export const saveTodayMeals = (meals) => {
  const history = loadHistory()
  history[todayKey()] = meals
  saveHistory(history)
}

// --- Custom foods ---

export const loadCustomFoods = () => {
  try {
    const raw = localStorage.getItem(CUSTOM_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch { return [] }
}

export const saveCustomFoods = (foods) => {
  try { localStorage.setItem(CUSTOM_KEY, JSON.stringify(foods)) } catch {}
}

// --- Favourites ---

export const loadFavourites = () => {
  try {
    const raw = localStorage.getItem(FAVS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch { return [] }
}

export const saveFavourites = (favs) => {
  try { localStorage.setItem(FAVS_KEY, JSON.stringify(favs)) } catch {}
}
