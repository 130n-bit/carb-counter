import { useState } from 'react'
import { Icon } from '../components/Icons.jsx'

const Toggle = ({ on, onClick }) => (
  <div className={`c-toggle ${on ? 'is-on' : ''}`} onClick={onClick} role="switch" aria-checked={on}/>
)

export const You = () => {
  const [reminders, setReminders] = useState(true)
  const [largeText, setLargeText] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [healthSync, setHealthSync] = useState(true)

  return (
    <div className="crumb-scroll">
      <div className="c-header">
        <div>
          <div className="c-greeting">Your account.</div>
          <div className="c-date">Plain language. No surprises.</div>
        </div>
      </div>

      <div className="c-profile">
        <div className="c-profile-avatar">C</div>
        <div>
          <div className="c-profile-name">Crumb User</div>
          <div className="c-profile-sub">Counting carbs since today</div>
        </div>
      </div>

      <div className="c-set-section">Your numbers</div>
      <div className="c-set-group">
        <div className="c-set-row">
          <div className="c-set-icon"><Icon name="droplet" size={18}/></div>
          <div className="c-set-label">Show net carbs
            <div className="c-set-sub">Subtract fibre from totals.</div>
          </div>
          <Toggle on={false} onClick={() => {}}/>
        </div>
        <div className="c-set-row">
          <div className="c-set-icon"><Icon name="chart" size={18}/></div>
          <div className="c-set-label">Show 7-day average
            <div className="c-set-sub">A line on charts, showing your typical week.</div>
          </div>
          <Toggle on={true} onClick={() => {}}/>
        </div>
      </div>

      <div className="c-set-section">Reminders</div>
      <div className="c-set-group">
        <div className="c-set-row">
          <div className="c-set-icon"><Icon name="bell" size={18}/></div>
          <div className="c-set-label">Gentle mealtime nudge
            <div className="c-set-sub">Around 8, 12, 6. Never escalates.</div>
          </div>
          <Toggle on={reminders} onClick={() => setReminders(!reminders)}/>
        </div>
        <div className="c-set-row">
          <div className="c-set-icon"><Icon name="bookmark" size={18}/></div>
          <div className="c-set-label">Save favourites
            <div className="c-set-sub">Tap the star on any food result.</div>
          </div>
          <Toggle on={true} onClick={() => {}}/>
        </div>
      </div>

      <div className="c-set-section">Accessibility</div>
      <div className="c-set-group">
        <div className="c-set-row">
          <div className="c-set-icon"><Icon name="type" size={18}/></div>
          <div className="c-set-label">Larger text
            <div className="c-set-sub">Bumps everything up one step.</div>
          </div>
          <Toggle on={largeText} onClick={() => setLargeText(!largeText)}/>
        </div>
        <div className="c-set-row">
          <div className="c-set-icon"><Icon name="eye" size={18}/></div>
          <div className="c-set-label">Reduce motion
            <div className="c-set-sub">Soft fades only.</div>
          </div>
          <Toggle on={reduceMotion} onClick={() => setReduceMotion(!reduceMotion)}/>
        </div>
      </div>

      <div className="c-set-section">Your data</div>
      <div className="c-set-group">
        <div className="c-set-row">
          <div className="c-set-icon"><Icon name="heart" size={18}/></div>
          <div className="c-set-label">Sync with Health
            <div className="c-set-sub">Just carbs. You pick the rest.</div>
          </div>
          <Toggle on={healthSync} onClick={() => setHealthSync(!healthSync)}/>
        </div>
        <div className="c-set-row">
          <div className="c-set-icon"><Icon name="shield" size={18}/></div>
          <div className="c-set-label">Privacy
            <div className="c-set-sub">Your meals never leave your device.</div>
          </div>
          <span className="c-set-chev"><Icon name="chev" size={18}/></span>
        </div>
        <div className="c-set-row">
          <div className="c-set-icon"><Icon name="download" size={18}/></div>
          <div className="c-set-label">Export as CSV
            <div className="c-set-sub">Take it anywhere you like.</div>
          </div>
          <span className="c-set-chev"><Icon name="chev" size={18}/></span>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 22, fontSize: 11, color: 'var(--stone-500)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>
        crumb · v1.0.0 · carb counting
      </div>
    </div>
  )
}
