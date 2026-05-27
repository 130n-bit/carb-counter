import { useState, useEffect } from 'react'
import { Icon } from './components/Icons.jsx'
import { PortionSheet } from './components/PortionSheet.jsx'
import { Today } from './screens/Today.jsx'
import { AddFood } from './screens/AddFood.jsx'
import { AddCustomFood } from './screens/AddCustomFood.jsx'
import { Insights } from './screens/Insights.jsx'
import { You } from './screens/You.jsx'
import {
  MEAL_GLYPH, MEAL_TONE,
  loadCustomFoods, saveCustomFoods,
  loadHistory, loadTodayMeals, saveTodayMeals,
  loadFavourites, saveFavourites,
} from './data.js'

const TabBar = ({ tab, onTab }) => {
  const tabs = [
    { id: 'today',    label: 'Today',    icon: 'home' },
    { id: 'add',      label: 'Add food', icon: 'plus' },
    { id: 'insights', label: 'Insights', icon: 'chart' },
    { id: 'you',      label: 'You',      icon: 'user' },
  ]
  return (
    <div className="c-tabs">
      {tabs.map(t => (
        <button key={t.id}
                className={`c-tab ${tab === t.id ? 'is-active' : ''}`}
                onClick={() => onTab(t.id)}>
          <Icon name={t.icon} size={16}/>
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  )
}

const Toast = ({ message, onUndo }) => (
  <div className="c-toast">
    <div className="c-toast-icon"><Icon name="check" size={14}/></div>
    <div className="c-toast-body">{message}</div>
    <button className="c-toast-action" onClick={onUndo}>Undo</button>
  </div>
)

export default function App() {
  const [tab, setTab] = useState('today')
  const [meals, setMeals] = useState(() => loadTodayMeals() || [])
  const [history, setHistory] = useState(() => loadHistory())
  const [sheetFood, setSheetFood] = useState(null)
  const [toast, setToast] = useState(null)
  const [addFocus, setAddFocus] = useState(false)
  const [customFoodScreen, setCustomFoodScreen] = useState(null) // null | { initialName }
  const [customFoods, setCustomFoods] = useState(() => loadCustomFoods())
  const [favourites, setFavourites] = useState(() => loadFavourites())

  // Persist meals whenever they change
  useEffect(() => {
    saveTodayMeals(meals)
    setHistory(loadHistory())
  }, [meals])

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3200)
    return () => clearTimeout(t)
  }, [toast])

  const todayTotal = meals.reduce((a, m) => a + m.items.reduce((x, y) => x + y.carbs, 0), 0)

  const openSearch = () => {
    setAddFocus(true)
    setTab('add')
  }

  const handlePickFood = (food) => setSheetFood(food)
  const handlePickQuick = (food) => setSheetFood(food)

  const handleSave = (entry) => {
    setMeals(prev => {
      const existing = prev.find(m => m.meal === entry.meal)
      const time = new Date()
      const hh = time.getHours()
      const mm = time.getMinutes().toString().padStart(2, '0')
      const ampm = hh >= 12 ? 'pm' : 'am'
      const h12 = hh % 12 === 0 ? 12 : hh % 12
      const timeStr = `${h12}:${mm} ${ampm}`
      const newItem = { name: `${entry.foodName}, ${entry.portion}`, carbs: entry.carbs }
      if (existing) {
        return prev.map(m => m === existing
          ? { ...m, items: [...m.items, newItem] }
          : m)
      }
      return [...prev, {
        id: 'm' + Date.now(),
        meal: entry.meal,
        glyph: MEAL_GLYPH[entry.meal] || 'm',
        tone: MEAL_TONE[entry.meal] || 'paper',
        time: timeStr,
        timeSort: hh + (parseInt(mm) / 60),
        items: [newItem],
      }]
    })
    setSheetFood(null)
    setTab('today')
    setToast({ message: `${entry.foodName} · ${entry.carbs} g`, lastEntry: entry })
  }

  const handleUndo = () => {
    if (!toast) return
    const entry = toast.lastEntry
    setMeals(prev => prev.map(m => {
      if (m.meal !== entry.meal) return m
      const items = m.items.slice(0, -1)
      return { ...m, items }
    }).filter(m => m.items.length > 0))
    setToast(null)
  }

  const handleAddByHand = (initialName) => {
    setCustomFoodScreen({ initialName: initialName || '' })
    setTab('add')
  }

  const handleCustomFoodSave = (food) => {
    const updated = [food, ...customFoods]
    setCustomFoods(updated)
    saveCustomFoods(updated)
    setCustomFoodScreen(null)
    // Open portion sheet immediately
    setSheetFood(food)
  }

  const handleToggleFav = (food) => {
    setFavourites(prev => {
      const exists = prev.some(f => f.id === food.id)
      const updated = exists ? prev.filter(f => f.id !== food.id) : [food, ...prev]
      saveFavourites(updated)
      return updated
    })
  }

  const tweaks = { heroDetail: 'breakdown', heroTone: 'sky', units: 'g', showQuick: true }

  return (
    <div className="app-shell">
      <div className="crumb">
        {tab === 'today' && !customFoodScreen && (
          <Today meals={meals} tweaks={tweaks}
                 onSearchTap={openSearch}
                 onPickQuick={handlePickQuick}/>
        )}

        {tab === 'add' && customFoodScreen && (
          <AddCustomFood
            initialName={customFoodScreen.initialName}
            onCancel={() => setCustomFoodScreen(null)}
            onSave={handleCustomFoodSave}/>
        )}

        {tab === 'add' && !customFoodScreen && (
          <AddFood
            onClose={() => { setAddFocus(false); setTab('today') }}
            onPick={handlePickFood}
            onPickQuick={handlePickQuick}
            initialFocus={addFocus}
            customFoods={customFoods}
            favourites={favourites}
            onAddByHand={handleAddByHand}
            onToggleFav={handleToggleFav}/>
        )}

        {tab === 'insights' && (
          <Insights todayTotal={todayTotal} history={history}/>
        )}

        {tab === 'you' && (
          <You/>
        )}

        {toast && <Toast message={toast.message} onUndo={handleUndo}/>}

        {sheetFood && (
          <PortionSheet food={sheetFood}
                        onCancel={() => setSheetFood(null)}
                        onSave={handleSave}/>
        )}

        <TabBar tab={tab} onTab={(t) => { setCustomFoodScreen(null); setTab(t) }}/>
      </div>
    </div>
  )
}
