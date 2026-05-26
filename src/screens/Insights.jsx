import { Icon } from '../components/Icons.jsx'

export const Insights = ({ todayTotal }) => {
  const days = [
    { label: 'W', carbs: 168 },
    { label: 'T', carbs: 142 },
    { label: 'F', carbs: 215 },
    { label: 'S', carbs: 195 },
    { label: 'S', carbs: 132 },
    { label: 'M', carbs: 158 },
    { label: 'T', carbs: todayTotal, isToday: true },
  ]
  const avg = Math.round(days.reduce((a, d) => a + d.carbs, 0) / days.length)
  const max = Math.max(avg * 1.5, ...days.map(d => d.carbs))
  const avgPct = (avg / max) * 100
  const low  = Math.min(...days.map(d => d.carbs))
  const high = Math.max(...days.map(d => d.carbs))

  return (
    <div className="crumb-scroll">
      <div className="c-header">
        <div>
          <div className="c-greeting">Looking <em>back, kindly.</em></div>
          <div className="c-date">Past seven days · no goals, just numbers</div>
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
          {days.map((d, i) => {
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
            <span className="c-week-foot-num">{low} g · Sun</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div>Heaviest day</div>
            <span className="c-week-foot-num">{high} g · Fri</span>
          </div>
        </div>
      </div>

      <div className="c-section-head">
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
