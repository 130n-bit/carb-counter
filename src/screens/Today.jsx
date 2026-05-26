import { Icon } from '../components/Icons.jsx'
import { QUICK_FOODS, RECENT_TOTALS } from '../data.js'

const TYPICAL_BY_HOUR = 125

const HeroCarbs = ({ total, meals, detail, tone, unit }) => {
  const typicalRatio = total / TYPICAL_BY_HOUR
  let note
  if (meals.length === 0)      note = <><em>Nothing logged yet. No rush.</em></>
  else if (meals.length === 1) note = <>One meal in. <em>Day's just starting.</em></>
  else if (typicalRatio < 0.7) note = <>A lighter afternoon than usual. <em>That's a pattern.</em></>
  else if (typicalRatio < 1.2) note = <>About on pace with a usual Tuesday.</>
  else                         note = <>A bigger carb day than your average. <em>It happens.</em></>

  const totalForBar = Math.max(total, 1)
  const mealsForBar = meals.map(m => ({
    label: m.meal,
    carbs: m.items.reduce((a, b) => a + b.carbs, 0),
    tone: m.tone,
  })).filter(m => m.carbs > 0)

  const allDays = [...RECENT_TOTALS, total]
  const trendMax = Math.max(...allDays, 1)
  const avg7 = Math.round(allDays.reduce((a, b) => a + b, 0) / 7)

  return (
    <div className={`c-hero tone-${tone}`}>
      <div className="c-hero-top">
        <div className="c-hero-eyebrow">Today's carbs · so far</div>
        <div className="c-hero-meta">
          <Icon name="clock" size={12}/>
          <span>updated just now</span>
        </div>
      </div>

      <div className="c-hero-num">
        <span className="c-hero-num-big">{unit === 'exchanges' ? (total/15).toFixed(1) : total}</span>
        <span className="c-hero-num-unit">{unit === 'exchanges' ? 'exchanges' : 'g'}</span>
      </div>

      {detail === 'breakdown' && mealsForBar.length > 0 && (
        <div className="c-hero-breakdown">
          <div className="c-hero-breakbar">
            {mealsForBar.map((m, i) => (
              <div key={i}
                   className={`c-hero-breakseg tone-${m.tone}`}
                   style={{ flex: m.carbs / totalForBar }}
                   title={`${m.label}: ${m.carbs} g`}/>
            ))}
          </div>
          <div className="c-hero-breaklegend">
            {mealsForBar.map((m, i) => (
              <div key={i} className="c-hero-breakchip">
                <span className={`c-hero-breakdot tone-${m.tone}`}/>
                <span className="c-hero-breakchip-label">{m.label}</span>
                <span className="c-hero-breakchip-num">{m.carbs} g</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {detail === 'trend' && (
        <div className="c-hero-trend">
          <div className="c-hero-trend-bars">
            {allDays.map((d, i) => {
              const h = (d / trendMax) * 100
              const isToday = i === allDays.length - 1
              return (
                <div key={i} className="c-hero-trend-col">
                  <div className={`c-hero-trend-bar ${isToday ? 'is-today' : ''}`}
                       style={{ height: h + '%' }}/>
                  <div className={`c-hero-trend-label ${isToday ? 'is-today' : ''}`}>
                    {['W','T','F','S','S','M','T'][i]}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="c-hero-trend-meta">
            <span>7-day avg</span>
            <span className="c-hero-trend-meta-num">{avg7} g</span>
          </div>
        </div>
      )}

      <div className="c-hero-note">{note}</div>
    </div>
  )
}

const MealCard = ({ meal, unit }) => {
  const total = meal.items.reduce((a, b) => a + b.carbs, 0)
  return (
    <div className="c-meal">
      <div className="c-meal-head">
        <div className={`c-meal-icon tone-${meal.tone}`}>{meal.glyph}</div>
        <div className="c-meal-titleblock">
          <div className="c-meal-when">{meal.meal} · {meal.time}</div>
          <div className="c-meal-name">
            {meal.items.length === 1
              ? meal.items[0].name
              : `${meal.items[0].name} + ${meal.items.length - 1} more`}
          </div>
        </div>
        <div>
          <span className="c-meal-total">{unit === 'exchanges' ? (total/15).toFixed(1) : total}</span>
          <span className="c-meal-total-unit">{unit === 'exchanges' ? 'ex' : 'g'}</span>
        </div>
      </div>
      <ul className="c-meal-items">
        {meal.items.map((it, i) => (
          <li key={i} className="c-meal-item">
            <span className="c-meal-item-name">{it.name}</span>
            <span className="c-meal-item-carbs">{it.carbs} g</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export const Today = ({ meals, tweaks, onSearchTap, onPickQuick }) => {
  const total = meals.reduce((a, m) => a + m.items.reduce((x, y) => x + y.carbs, 0), 0)
  const now = new Date()
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const timeH = now.getHours()
  const timeM = now.getMinutes().toString().padStart(2, '0')
  const ampm = timeH >= 12 ? 'pm' : 'am'
  const h12 = timeH % 12 === 0 ? 12 : timeH % 12
  const dateStr = `${now.getDate()} ${months[now.getMonth()]} · ${h12}:${timeM} ${ampm}`

  return (
    <div className="crumb-scroll">
      <div className="c-header">
        <div>
          <div className="c-greeting">Good day. <em>{days[now.getDay()]}.</em></div>
          <div className="c-date">{dateStr}</div>
        </div>
        <div className="c-avatar">C</div>
      </div>

      <HeroCarbs total={total} meals={meals}
                 detail={tweaks.heroDetail} tone={tweaks.heroTone}
                 unit={tweaks.units}/>

      <div className="c-search" onClick={onSearchTap} role="button" tabIndex={0}
           onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSearchTap()}>
        <span className="c-search-icon"><Icon name="search" size={18}/></span>
        <input readOnly placeholder="What did you eat?" tabIndex={-1}/>
        <div className="c-search-trailing">
          <button className="c-search-icon-btn" title="Scan barcode"
                  onClick={(e) => { e.stopPropagation(); onSearchTap('scan') }}>
            <Icon name="barcode" size={16}/>
          </button>
        </div>
      </div>

      {tweaks.showQuick && (
        <>
          <div className="c-section-head">
            <h3 className="c-section-title">Recent</h3>
            <span className="c-section-action">All foods</span>
          </div>
          <div className="c-quick-row">
            {QUICK_FOODS.map(f => (
              <button key={f.id} className="c-quick" onClick={() => onPickQuick(f)}>
                <span className="c-quick-glyph">{f.glyph}</span>
                <span>{f.name}</span>
                <span className="c-quick-carbs">{f.carbs}g</span>
              </button>
            ))}
          </div>
        </>
      )}

      <div className="c-section-head">
        <h3 className="c-section-title">Today, so far</h3>
        <span className="c-section-action">{meals.length} meal{meals.length === 1 ? '' : 's'}</span>
      </div>

      {meals.length === 0 && (
        <div className="c-empty-log">
          <div className="c-empty-log-text">Nothing logged yet. <em>Tap to add your first meal.</em></div>
        </div>
      )}

      {meals.map(m => <MealCard key={m.id} meal={m} unit={tweaks.units}/>)}

      <div className="c-suggest" onClick={onSearchTap}>
        <div className="c-suggest-icon"><Icon name="plus" size={18}/></div>
        <div className="c-suggest-body">
          <div className="c-suggest-title">Log a meal</div>
          <div className="c-suggest-sub">Search for a food or scan a barcode.</div>
        </div>
        <span style={{ color: 'var(--stone-400)' }}><Icon name="chev" size={18}/></span>
      </div>
    </div>
  )
}
