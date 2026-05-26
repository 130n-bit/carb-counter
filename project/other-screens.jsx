// Crumb — Insights + You screens

const { useState } = React;

/* =========================================================
   Insights screen
   ========================================================= */

const Insights = ({ tweaks, todayTotal }) => {
  // Past 7 days. Day 6 is today.
  const days = [
    { label: 'W', dow: 'wed', carbs: 168, date: 20 },
    { label: 'T', dow: 'thu', carbs: 142, date: 21 },
    { label: 'F', dow: 'fri', carbs: 215, date: 22 },
    { label: 'S', dow: 'sat', carbs: 195, date: 23 },
    { label: 'S', dow: 'sun', carbs: 132, date: 24 },
    { label: 'M', dow: 'mon', carbs: 158, date: 25 },
    { label: 'T', dow: 'tue', carbs: todayTotal, date: 26, isToday: true },
  ];
  const avg = Math.round(days.reduce((a, d) => a + d.carbs, 0) / days.length);
  const max = Math.max(avg * 1.5, ...days.map(d => d.carbs));
  const avgPct = (avg / max) * 100;
  const low = Math.min(...days.map(d => d.carbs));
  const high = Math.max(...days.map(d => d.carbs));

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
            <div className="c-week-avg-num">{avg}<span style={{ fontFamily:'var(--font-sans)', fontSize:13, color:'var(--ink-soft)', marginLeft:2 }}>g</span></div>
            <div className="c-week-avg-label">Daily avg</div>
          </div>
        </div>

        <div className="c-bars">
          <div className="c-bar-target-line" style={{ bottom: avgPct + '%' }}>
            <span className="c-bar-target-label">7-day avg · {avg} g</span>
          </div>
          {days.map((d, i) => {
            const h = (d.carbs / max) * 100;
            return (
              <div key={i} className="c-bar-col">
                <div className="c-bar-track">
                  <div className={`c-bar-fill ${d.isToday ? 'is-today' : ''}`}
                       style={{ height: h + '%' }}/>
                </div>
                <div className={`c-bar-label ${d.isToday ? 'is-today' : ''}`}>{d.label}</div>
              </div>
            );
          })}
        </div>

        <div className="c-week-foot">
          <div>
            <div>Lightest day</div>
            <span className="c-week-foot-num">{low} g · Sun</span>
          </div>
          <div style={{ textAlign:'right' }}>
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
  );
};

/* =========================================================
   You / Settings
   ========================================================= */

const Toggle = ({ on, onClick }) => (
  <div className={`c-toggle ${on ? 'is-on' : ''}`} onClick={onClick} role="switch" aria-checked={on}/>
);

const You = ({ tweaks, setTweak }) => {
  const [reminders, setReminders] = useState(true);
  const [largeText, setLargeText] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [healthSync, setHealthSync] = useState(true);

  return (
    <div className="crumb-scroll">
      <div className="c-header">
        <div>
          <div className="c-greeting">Your account.</div>
          <div className="c-date">Plain language. No surprises.</div>
        </div>
      </div>

      <div className="c-profile">
        <div className="c-profile-avatar">S</div>
        <div>
          <div className="c-profile-name">Sam Okafor</div>
          <div className="c-profile-sub">Counting carbs since March</div>
        </div>
      </div>

      <div className="c-set-section">Your numbers</div>
      <div className="c-set-group">
        <div className="c-set-row">
          <div className="c-set-icon"><Icon name="sliders" size={18}/></div>
          <div className="c-set-label">Units
            <div className="c-set-sub">Grams or carb exchanges.</div>
          </div>
          <div className="c-set-value">{tweaks.units === 'exchanges' ? 'Exchanges' : 'Grams'}</div>
          <span className="c-set-chev"><Icon name="chev" size={18}/></span>
        </div>
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
            <div className="c-set-sub">Tap the bookmark on any food.</div>
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
        <div className="c-set-row">
          <div className="c-set-icon"><Icon name="mic" size={18}/></div>
          <div className="c-set-label">Voice logging
            <div className="c-set-sub">"Crumb, I had a banana."</div>
          </div>
          <Toggle on={true} onClick={() => {}}/>
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
            <div className="c-set-sub">Your meals never leave your phone.</div>
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
        <div className="c-set-row">
          <div className="c-set-icon"><Icon name="logout" size={18}/></div>
          <div className="c-set-label">Sign out</div>
          <span className="c-set-chev"><Icon name="chev" size={18}/></span>
        </div>
      </div>

      <div style={{ textAlign:'center', marginTop: 22, fontSize: 11, color: 'var(--stone-500)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>
        crumb · v0.3.1 · made with leon
      </div>
    </div>
  );
};

Object.assign(window, { Insights, You, Toggle });
