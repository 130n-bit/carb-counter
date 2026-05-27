import { Icon } from '../components/Icons.jsx'

const Toggle = ({ on, onClick }) => (
  <div className={`c-toggle ${on ? 'is-on' : ''}`} onClick={onClick}
       role="switch" aria-checked={on} tabIndex={0}
       onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick()}/>
)

const DIABETES_TYPES = ['Type 1', 'Type 2', 'Gestational', 'Other']

export const You = ({ settings, onSave }) => {
  const update = (key, val) => onSave({ [key]: val })
  const name = settings.name?.trim() || ''
  const initial = name[0]?.toUpperCase() || 'C'

  return (
    <div className="crumb-scroll">
      <div className="c-header">
        <div>
          <div className="c-greeting">Your <em>settings.</em></div>
          <div className="c-date">Stored on your device only.</div>
        </div>
      </div>

      <div className="c-profile">
        <div className="c-profile-avatar">{initial}</div>
        <div>
          <div className="c-profile-name">{name || 'Crumb User'}</div>
          <div className="c-profile-sub">
            {settings.diabetesType ? `${settings.diabetesType} diabetes` : 'Counting carbs'}
          </div>
        </div>
      </div>

      <div className="c-set-section">About you</div>
      <div className="c-set-group">
        <div className="c-set-row">
          <div className="c-set-icon"><Icon name="user" size={18}/></div>
          <div className="c-set-label">Name</div>
          <input className="c-set-inline-input"
                 value={settings.name || ''}
                 onChange={e => update('name', e.target.value)}
                 placeholder="First name"
                 autoComplete="given-name"/>
        </div>

        <div className="c-set-block">
          <div className="c-set-block-head">
            <div className="c-set-icon"><Icon name="droplet" size={18}/></div>
            <span className="c-set-label">Diabetes type</span>
          </div>
          <div className="c-pill-row">
            {DIABETES_TYPES.map(t => (
              <button key={t}
                      className={`c-pill ${settings.diabetesType === t ? 'is-active' : ''}`}
                      onClick={() => update('diabetesType', settings.diabetesType === t ? '' : t)}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="c-set-row">
          <div className="c-set-icon"><Icon name="chart" size={18}/></div>
          <div className="c-set-label">Daily carb goal
            <div className="c-set-sub">Optional — no pressure.</div>
          </div>
          <div className="c-set-num-input">
            <input type="number" min="0" max="999"
                   value={settings.carbTarget ?? ''}
                   onChange={e => update('carbTarget', e.target.value ? Number(e.target.value) : '')}
                   placeholder="—"/>
            <span>g</span>
          </div>
        </div>
      </div>

      <div className="c-set-section">Appearance</div>
      <div className="c-set-group">
        <div className="c-set-row">
          <div className="c-set-icon"><Icon name="moon" size={18}/></div>
          <div className="c-set-label">Dark mode
            <div className="c-set-sub">Easier on the eyes at night.</div>
          </div>
          <Toggle on={!!settings.darkMode} onClick={() => update('darkMode', !settings.darkMode)}/>
        </div>
      </div>

      <div className="c-set-section">Your data</div>
      <div className="c-set-group">
        <div className="c-set-row">
          <div className="c-set-icon"><Icon name="shield" size={18}/></div>
          <div className="c-set-label">Privacy
            <div className="c-set-sub">Your meals never leave your device.</div>
          </div>
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
