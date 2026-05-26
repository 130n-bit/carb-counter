import { useState } from 'react'
import { Icon } from '../components/Icons.jsx'
import { todayKey } from '../data.js'

const DAY_SHORT  = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

const mealTotal = (meal) => meal.items.reduce((s, i) => s + i.carbs, 0)
const dayTotal  = (meals) => meals.reduce((s, m) => s + mealTotal(m), 0)

const fullDate = (key) => {
  const [y, mo, d] = key.split('-').map(Number)
  return new Date(y, mo - 1, d).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

const shortDate = (key) => {
  const [y, mo, d] = key.split('-').map(Number)
  const date = new Date(y, mo - 1, d)
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const diff = Math.round((today - date) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

const HistoryDay = ({ dateKey, meals, isToday }) => {
  const [open, setOpen] = useState(isToday)
  const total = dayTotal(meals)

  return (
    <div className={`c-hist-day ${open ? 'is-open' : ''}`}>
      <button className="c-hist-day-row" onClick={() => setOpen(o => !o)}>
        <div className="c-hist-day-left">
          <div className="c-hist-day-date">{shortDate(dateKey)}</div>
          {open && <div className="c-hist-day-full">{fullDate(dateKey)}</div>}
        </div>
        <div className="c-hist-day-total">{total} g</div>
        <span className={`c-hist-chev ${open ? 'is-open' : ''}`}>
          <Icon name="chev" size={16}/>
        </span>
      </button>

      {open && (
        <div className="c-hist-meals">
          {meals.map((meal, i) => (
            <div key={i} className="c-hist-meal">
              <div className="c-hist-meal-head">
                <span className="c-hist-meal-name">{meal.meal}</span>
                {meal.time && <span className="c-hist-meal-time">{meal.time}</span>}
                <span className="c-hist-meal-sub">{mealTotal(meal)} g</span>
              </div>
              {meal.items.map((item, j) => (
                <div key={j} className="c-hist-item">
                  <span className="c-hist-item-name">{item.name}</span>
                  <span className="c-hist-item-carbs">{item.carbs} g</span>
                </div>
              ))}
            </div>
          ))}
          <div className="c-hist-day-footer">
            <span>Total carbs</span>
            <span className="c-hist-day-footer-num">{total} g</span>
          </div>
        </div>
      )}
    </div>
  )
}

export const Insights = ({ todayTotal, history }) => {
  const today = todayKey()

  // All days sorted newest first, today always first
  const allDays = Object.entries(history).sort(([a], [b]) => b.localeCompare(a))

  // Last 7 days for bar chart
  const last7 = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    const meals = history[key] || []
    const carbs = key === today ? todayTotal : dayTotal(meals)
    last7.push({ key, label: DAY_SHORT[d.getDay()], carbs, isToday: key === today })
  }

  const avg = Math.round(last7.reduce((a, d) => a + d.carbs, 0) / last7.length)
  const max = Math.max(avg * 1.5, ...last7.map(d => d.carbs), 1)
  const avgPct = (avg / max) * 100

  return (
    <div className="crumb-scroll">
      <div className="c-header">
        <div>
          <div className="c-greeting">Meal <em>log.</em></div>
          <div className="c-date">Tap any day to see the full breakdown</div>
        </div>
      </div>

      {allDays.length === 0 && (
        <div className="c-hist-empty">
          <Icon name="leaf" size={28}/>
          <div>Nothing logged yet.<br/>Start adding meals to build your history.</div>
        </div>
      )}

      {allDays.length > 0 && (
        <div className="c-hist-list">
          {allDays.map(([key, meals]) => (
            <HistoryDay key={key} dateKey={key} meals={meals} isToday={key === today}/>
          ))}
        </div>
      )}

      <div className="c-section-head" style={{ marginTop: 24 }}>
        <h3 className="c-section-title">This week</h3>
        <span className="c-section-sub">{avg} g avg</span>
      </div>

      <div className="c-week">
        <div className="c-bars">
          <div className="c-bar-target-line" style={{ bottom: avgPct + '%' }}>
            <span className="c-bar-target-label">avg · {avg} g</span>
          </div>
          {last7.map((d, i) => {
            const h = (d.carbs / max) * 100
            return (
              <div key={i} className="c-bar-col">
                <div className="c-bar-track">
                  <div className={`c-bar-fill ${d.isToday ? 'is-today' : ''}`}
                       style={{ height: h + '%' }}/>
                </div>
                <div className={`c-bar-label ${d.isToday ? 'is-today' : ''}`}>{d.label}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
