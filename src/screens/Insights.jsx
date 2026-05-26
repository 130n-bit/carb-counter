import { useState } from 'react'
import { Icon } from '../components/Icons.jsx'
import { todayKey } from '../data.js'

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAY_SHORT  = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

const mealTotal = (meal) => meal.items.reduce((s, i) => s + i.carbs, 0)
const dayTotal  = (meals) => meals.reduce((s, m) => s + mealTotal(m), 0)

const formatDate = (key) => {
  const [y, mo, d] = key.split('-').map(Number)
  const date = new Date(y, mo - 1, d)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.round((today - date) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

const HistoryDay = ({ dateKey, meals }) => {
  const [open, setOpen] = useState(false)
  const total = dayTotal(meals)
  const label = formatDate(dateKey)

  return (
    <div className="c-hist-day">
      <button className="c-hist-day-row" onClick={() => setOpen(o => !o)}>
        <div className="c-hist-day-date">{label}</div>
        <div className="c-hist-day-total">{total} g</div>
        <span className={`c-hist-chev ${open ? 'is-open' : ''}`}>
          <Icon name="chev" size={16}/>
        </span>
      </button>
      {open && (
        <div className="c-hist-meals">
          {meals.map((meal, i) => (
            <div key={i} className="c-hist-meal">
              <div className="c-hist-meal-name">{meal.meal} · {mealTotal(meal)} g</div>
              {meal.items.map((item, j) => (
                <div key={j} className="c-hist-item">
                  <span>{item.name}</span>
                  <span>{item.carbs} g</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const Insights = ({ todayTotal, history }) => {
  const today = todayKey()

  // Build last 7 days for bar chart (most recent last)
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

  const daysWithData = last7.filter(d => d.carbs > 0)
  const low  = daysWithData.length ? Math.min(...daysWithData.map(d => d.carbs)) : 0
  const high = daysWithData.length ? Math.max(...daysWithData.map(d => d.carbs)) : 0
  const lowDay  = daysWithData.find(d => d.carbs === low)
  const highDay = daysWithData.find(d => d.carbs === high)

  // Past days sorted newest first, excluding today
  const pastDays = Object.entries(history)
    .filter(([k]) => k !== today)
    .sort(([a], [b]) => b.localeCompare(a))

  return (
    <div className="crumb-scroll">
      <div className="c-header">
        <div>
          <div className="c-greeting">Looking <em>back, kindly.</em></div>
          <div className="c-date">Past 31 days · no goals, just numbers</div>
        </div>
      </div>

      <div className="c-week">
        <div className="c-week-head">
          <div className="c-week-title">This week</div>
          <div className="c-week-avg">
            <div className="c-week-avg-num">{avg}<span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-soft)', marginLeft: 2 }}>g</span></div>
            <div className="c-week-avg-label">Daily avg</div>
          </div>
        </div>

        <div className="c-bars">
          <div className="c-bar-target-line" style={{ bottom: avgPct + '%' }}>
            <span className="c-bar-target-label">7-day avg · {avg} g</span>
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

        <div className="c-week-foot">
          <div>
            <div>Lightest day</div>
            <span className="c-week-foot-num">{low} g{lowDay ? ` · ${DAY_LABELS[new Date(lowDay.key).getDay()]}` : ''}</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div>Heaviest day</div>
            <span className="c-week-foot-num">{high} g{highDay ? ` · ${DAY_LABELS[new Date(highDay.key).getDay()]}` : ''}</span>
          </div>
        </div>
      </div>

      {pastDays.length > 0 && (
        <>
          <div className="c-section-head">
            <h3 className="c-section-title">Meal history</h3>
            <span className="c-section-sub">{pastDays.length} day{pastDays.length !== 1 ? 's' : ''} logged</span>
          </div>

          <div className="c-hist-list">
            {pastDays.map(([key, meals]) => (
              <HistoryDay key={key} dateKey={key} meals={meals}/>
            ))}
          </div>
        </>
      )}

      {pastDays.length === 0 && (
        <div className="c-section-head" style={{ marginTop: 8 }}>
          <div className="c-section-sub" style={{ textAlign: 'center', width: '100%', paddingBlock: 12 }}>
            Log meals for a few days to see your history here.
          </div>
        </div>
      )}

      <div className="c-section-head" style={{ marginTop: 8 }}>
        <h3 className="c-section-title">Patterns we noticed</h3>
      </div>

      <div className="c-insight tone-sun">
        <div className="c-insight-icon"><Icon name="sun" size={16}/></div>
        <div className="c-insight-body">
          Your <em>mornings</em> are your highest-carb time. Usually around <em>52 g</em> at breakfast.
        </div>
      </div>

      <div className="c-insight">
        <div className="c-insight-icon"><Icon name="leaf" size={16}/></div>
        <div className="c-insight-body">
          On Sundays, you tend to eat <em>30% fewer carbs</em>. Slower mornings, maybe.
        </div>
      </div>

      <div className="c-insight tone-clay">
        <div className="c-insight-icon"><Icon name="info" size={16}/></div>
        <div className="c-insight-body">
          Bread and rice show up <em>most often</em> in your log. Not a problem — just a pattern.
        </div>
      </div>
    </div>
  )
}
