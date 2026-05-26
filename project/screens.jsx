// Crumb — main screens (Today, Add, Insights, You) + Portion sheet

const { useState, useEffect, useMemo, useRef } = React;

/* =========================================================
   Tab bar
   ========================================================= */

const TabBar = ({ tab, onTab }) => {
  const tabs = [
    { id: 'today',    label: 'Today',    icon: 'home' },
    { id: 'add',      label: 'Add food', icon: 'plus' },
    { id: 'insights', label: 'Insights', icon: 'chart' },
    { id: 'you',      label: 'You',      icon: 'user' },
  ];
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
  );
};

/* =========================================================
   Hero: Today's carbs — pure tracker, no target
   ========================================================= */

// Past 7 days' totals (excluding today) — referenced by trend view
const RECENT_TOTALS = [168, 142, 215, 195, 132, 158];
const TYPICAL_BY_HOUR = 125; // typical 2:30pm running total

const HeroCarbs = ({ total, meals, detail, tone, unit }) => {
  // Friendly note based on meals logged + ratio against typical
  const typicalRatio = total / TYPICAL_BY_HOUR;
  let note;
  if (meals.length === 0)      note = <>Nothing logged yet. <em>No rush.</em></>;
  else if (meals.length === 1) note = <>One meal in. <em>Day's just starting.</em></>;
  else if (typicalRatio < 0.7) note = <>A lighter afternoon than usual. <em>That's a pattern.</em></>;
  else if (typicalRatio < 1.2) note = <>About on pace with a usual Tuesday.</>;
  else                         note = <>A bigger carb day than your average. <em>It happens.</em></>;

  // For breakdown bar
  const totalForBar = Math.max(total, 1);
  const mealsForBar = meals.map(m => ({
    label: m.meal,
    carbs: m.items.reduce((a, b) => a + b.carbs, 0),
    tone: m.tone,
  })).filter(m => m.carbs > 0);

  // For trend view — 7 day strip including today
  const allDays = [...RECENT_TOTALS, total];
  const trendMax = Math.max(...allDays, 1);
  const avg7 = Math.round(allDays.reduce((a, b) => a + b, 0) / 7);

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
              const h = (d / trendMax) * 100;
              const isToday = i === allDays.length - 1;
              return (
                <div key={i} className="c-hero-trend-col">
                  <div className={`c-hero-trend-bar ${isToday ? 'is-today' : ''}`}
                       style={{ height: h + '%' }}/>
                  <div className={`c-hero-trend-label ${isToday ? 'is-today' : ''}`}>
                    {['W','T','F','S','S','M','T'][i]}
                  </div>
                </div>
              );
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
  );
};

/* =========================================================
   Search bar (Today version — tappable, navigates to Add)
   ========================================================= */

const SearchBar = ({ onTap }) => (
  <div className="c-search" onClick={onTap} role="button" tabIndex={0}
       onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onTap()}>
    <span className="c-search-icon"><Icon name="search" size={18}/></span>
    <input readOnly placeholder="What did you eat?" tabIndex={-1}/>
    <div className="c-search-trailing">
      <button className="c-search-icon-btn" title="Scan barcode" onClick={(e) => { e.stopPropagation(); onTap('scan'); }}>
        <Icon name="barcode" size={16}/>
      </button>
      <button className="c-search-icon-btn" title="Voice" onClick={(e) => { e.stopPropagation(); onTap('mic'); }}>
        <Icon name="mic" size={16}/>
      </button>
    </div>
  </div>
);

/* =========================================================
   Quick chips
   ========================================================= */

const QuickRow = ({ items, onPick }) => (
  <div className="c-quick-row">
    {items.map(f => (
      <button key={f.id} className="c-quick" onClick={() => onPick(f)}>
        <span className="c-quick-glyph">{f.glyph}</span>
        <span>{f.name}</span>
        <span className="c-quick-carbs">{f.carbs}g</span>
      </button>
    ))}
  </div>
);

/* =========================================================
   Meal card
   ========================================================= */

const MealCard = ({ meal, unit }) => {
  const total = meal.items.reduce((a, b) => a + b.carbs, 0);
  return (
    <div className="c-meal">
      <div className="c-meal-head">
        <div className={`c-meal-icon tone-${meal.tone}`}>{meal.glyph}</div>
        <div className="c-meal-titleblock">
          <div className="c-meal-when">{meal.meal} · {meal.time}</div>
          <div className="c-meal-name">{meal.items.length === 1 ? meal.items[0].name : `${meal.items[0].name} + ${meal.items.length - 1} more`}</div>
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
  );
};

/* =========================================================
   Today screen
   ========================================================= */

const Today = ({ meals, tweaks, onSearchTap, onPickQuick }) => {
  const total = meals.reduce((a, m) => a + m.items.reduce((x, y) => x + y.carbs, 0), 0);

  return (
    <div className="crumb-scroll">
      <div className="c-header">
        <div>
          <div className="c-greeting">Hi, Sam. <em>Tuesday.</em></div>
          <div className="c-date">26 May · 2:30 pm</div>
        </div>
        <div className="c-avatar">S</div>
      </div>

      <HeroCarbs total={total} meals={meals}
                 detail={tweaks.heroDetail} tone={tweaks.heroTone}
                 unit={tweaks.units}/>

      <SearchBar onTap={onSearchTap}/>

      {tweaks.showQuick && (
        <>
          <div className="c-section-head">
            <h3 className="c-section-title">Recent</h3>
            <span className="c-section-action">All foods</span>
          </div>
          <QuickRow items={QUICK_FOODS} onPick={onPickQuick}/>
        </>
      )}

      <div className="c-section-head">
        <h3 className="c-section-title">Today, so far</h3>
        <span className="c-section-action">{meals.length} meal{meals.length === 1 ? '' : 's'}</span>
      </div>

      {meals.map(m => <MealCard key={m.id} meal={m} unit={tweaks.units}/>)}

      <div className="c-suggest" onClick={onSearchTap}>
        <div className="c-suggest-icon"><Icon name="plus" size={18}/></div>
        <div className="c-suggest-body">
          <div className="c-suggest-title">Log an afternoon snack</div>
          <div className="c-suggest-sub">Around now is when you usually do.</div>
        </div>
        <span style={{ color: 'var(--stone-400)' }}><Icon name="chev" size={18}/></span>
      </div>
    </div>
  );
};

/* =========================================================
   OpenFoodFacts live search
   ========================================================= */

// Parse a serving size string into grams. "100 g" → 100. "1 piece (30g)" → 30.
const parseServingGrams = (s) => {
  if (!s) return null;
  const str = String(s);
  // Prefer a "(NN g)" group if present, else the first NN g token, else leading number
  const inParens = str.match(/\(\s*(\d+(?:\.\d+)?)\s*g\b/i);
  if (inParens) return Math.round(parseFloat(inParens[1]));
  const grams = str.match(/(\d+(?:\.\d+)?)\s*g\b/i);
  if (grams) return Math.round(parseFloat(grams[1]));
  const leading = str.match(/^(\d+(?:\.\d+)?)/);
  if (leading) return Math.round(parseFloat(leading[1]));
  return null;
};

// Title-case messy product names from OFF (often UPPERCASE or weird casing)
const tidyName = (s) => {
  if (!s) return '';
  const t = s.trim().replace(/\s+/g, ' ');
  // If it's mostly uppercase, lowercase + title-case it
  const letters = t.replace(/[^A-Za-z]/g, '');
  const upRatio = letters ? (letters.match(/[A-Z]/g) || []).length / letters.length : 0;
  if (upRatio > 0.7 && letters.length > 4) {
    return t.toLowerCase().replace(/(^|\s)\S/g, c => c.toUpperCase());
  }
  return t;
};

// Convert an OFF product to a Crumb food object. Returns null if no carbs data.
const offProductToFood = (p) => {
  const carbs100 = Number(p?.nutriments?.carbohydrates_100g);
  if (!Number.isFinite(carbs100)) return null;
  const name = tidyName(p.product_name);
  if (!name) return null;

  const brand = tidyName((p.brands || '').split(',')[0]);
  const servingG = parseServingGrams(p.serving_size);
  const countries = Array.isArray(p.countries_tags) ? p.countries_tags : [];
  const isUK = countries.includes('en:united-kingdom');
  // Prefer front-of-pack small (better quality than thumb); fall back to thumb.
  const image = p.image_front_small_url || p.image_front_thumb_url
             || p.image_small_url || p.image_thumb_url || null;

  const units = [];
  const unitVals = [];
  if (servingG && servingG > 0 && servingG < 2000) {
    units.push(`serving (${servingG} g)`);
    unitVals.push(Math.round(carbs100 * servingG / 100 * 10) / 10);
  }
  units.push('100 g');
  unitVals.push(Math.round(carbs100 * 10) / 10);
  units.push('50 g');
  unitVals.push(Math.round(carbs100 * 0.5 * 10) / 10);

  return {
    id: 'off-' + (p.code || name),
    name,
    sub: brand ? brand : 'OpenFoodFacts',
    glyph: name[0].toLowerCase(),
    image,
    base: Math.round(unitVals[0]),
    units,
    unitVals,
    defaultUnit: 0,
    isUK,
    source: 'off',
  };
};

// Hook: debounced live search against OpenFoodFacts.
// Uses the legacy /cgi/search.pl endpoint — the only one that's BOTH CORS-OK
// AND does real text relevance. UK country filter is applied first; if that
// fetch fails or yields nothing, we fall back to a worldwide query.
const useFoodSearch = (query) => {
  const [state, setState] = useState({ status: 'idle', results: [], error: null });

  useEffect(() => {
    const q = query.trim();
    if (!q) { setState({ status: 'idle', results: [], error: null }); return; }

    setState(s => ({ ...s, status: 'loading' }));
    const ctrl = new AbortController();

    const buildUrl = (includeUKFilter) => {
      let u = 'https://world.openfoodfacts.org/cgi/search.pl'
            + '?search_terms=' + encodeURIComponent(q)
            + '&search_simple=1&action=process&json=1&page_size=30'
            + '&fields=product_name,brands,nutriments,serving_size,code,quantity,countries_tags,image_front_small_url,image_front_thumb_url,image_small_url,image_thumb_url';
      if (includeUKFilter) {
        u += '&tagtype_0=countries&tag_contains_0=contains&tag_0='
           + encodeURIComponent('United Kingdom');
      }
      return u;
    };

    const fetchAndMap = async (url) => {
      const res = await fetch(url, { signal: ctrl.signal });
      if (!res.ok) throw new Error('Bad response ' + res.status);
      const json = await res.json();
      return (json.products || [])
        .map(offProductToFood)
        .filter(Boolean)
        // De-dupe by name+brand
        .filter((f, i, arr) => arr.findIndex(g => g.name === f.name && g.sub === f.sub) === i)
        .slice(0, 24);
    };

    const timer = setTimeout(async () => {
      let products = [];
      // Try UK first. Some broad brand queries (e.g. "nestle") fail the country-
      // filtered request on the server side — don't let that kill the whole search.
      try {
        products = await fetchAndMap(buildUrl(true));
      } catch (err) {
        if (err.name === 'AbortError') return;
        // swallow — we'll try the worldwide fallback next
      }
      // Fallback: no country filter, broader pool.
      if (products.length === 0) {
        try {
          products = await fetchAndMap(buildUrl(false));
        } catch (err) {
          if (err.name === 'AbortError') return;
          setState({ status: 'error', results: [], error: err.message });
          return;
        }
      }
      setState({ status: 'ok', results: products, error: null });
    }, 340);

    return () => { clearTimeout(timer); ctrl.abort(); };
  }, [query]);

  return state;
};

/* =========================================================
   FoodImage — image with glyph fallback
   ========================================================= */

const FoodImage = ({ image, glyph, size = 40, radius = 12 }) => {
  const [failed, setFailed] = useState(false);
  const showImage = image && !failed;
  return (
    <div className={`c-food-img ${showImage ? 'has-image' : ''}`}
         style={{ width: size, height: size, borderRadius: radius }}>
      {showImage && (
        <img src={image} alt="" loading="lazy" onError={() => setFailed(true)}/>
      )}
      {!showImage && (
        <span className="c-food-img-glyph">{glyph}</span>
      )}
    </div>
  );
};

/* =========================================================
   Add Food screen
   ========================================================= */

const AddFood = ({ onClose, onPick, onPickQuick, initialFocus, customFoods = [], onAddByHand }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (initialFocus && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 60);
    }
  }, [initialFocus]);

  const { status, results, error } = useFoodSearch(query);

  // Client-side filter on the user's saved custom foods
  const customMatches = query.trim()
    ? customFoods.filter(f => {
        const hay = (f.name + ' ' + (f.sub || '')).toLowerCase();
        return query.trim().toLowerCase().split(/\s+/).every(w => hay.includes(w));
      })
    : [];

  return (
    <div className="crumb-scroll">
      <div className="c-add-head">
        <button className="c-back-btn" onClick={onClose}><Icon name="arrowL" size={18}/></button>
        <div className="c-add-title"><em>Find</em> a food</div>
      </div>

      <div className="c-search" style={{ marginBottom: 18 }}>
        <span className="c-search-icon"><Icon name="search" size={18}/></span>
        <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)}
               placeholder="Search anything edible"/>
        {query && (
          <button className="c-search-icon-btn" onClick={() => setQuery('')} title="Clear"
                  style={{ transform: 'rotate(45deg)' }}>
            <Icon name="plus" size={14}/>
          </button>
        )}
      </div>

      {!query && (
        <>
          <div className="c-input-tools">
            <button className="c-tool">
              <div className="c-tool-icon t-sun"><Icon name="barcode" size={20}/></div>
              <div className="c-tool-label">Scan barcode</div>
            </button>
            <button className="c-tool">
              <div className="c-tool-icon t-sage"><Icon name="mic" size={20}/></div>
              <div className="c-tool-label">Voice log</div>
            </button>
            <button className="c-tool">
              <div className="c-tool-icon t-clay"><Icon name="camera" size={20}/></div>
              <div className="c-tool-label">Photo</div>
            </button>
          </div>

          <div className="c-section-head" style={{ marginTop: 0 }}>
            <h3 className="c-section-title">Often, recently</h3>
            <span className="c-section-action" onClick={() => onAddByHand && onAddByHand('')}>
              <Icon name="plus" size={12}/> Add by hand
            </span>
          </div>
          {customFoods.slice(0, 4).map(f => (
            <div key={f.id} className="c-result" onClick={() => onPickQuick(f)}>
              <FoodImage image={f.image} glyph={f.glyph} size={40} radius={12}/>
              <div className="c-result-body">
                <div className="c-result-name">{f.name}</div>
                <div className="c-result-sub">{f.sub} · {f.units[f.defaultUnit ?? 0]}</div>
              </div>
              <div className="c-result-carbs">
                <span className="c-result-carbs-num">{f.base}</span>
                <span className="c-result-carbs-unit">g</span>
              </div>
            </div>
          ))}
          {QUICK_FOODS.map(f => (
            <div key={f.id} className="c-result" onClick={() => onPickQuick(f)}>
              <FoodImage image={f.image} glyph={f.glyph} size={40} radius={12}/>
              <div className="c-result-body">
                <div className="c-result-name">{f.name}</div>
                <div className="c-result-sub">{f.units[f.defaultUnit]}</div>
              </div>
              <div className="c-result-carbs">
                <span className="c-result-carbs-num">{f.carbs}</span>
                <span className="c-result-carbs-unit">g</span>
              </div>
            </div>
          ))}

          <div className="c-add-attrib">
            Searching pulls live results from <em>OpenFoodFacts</em>, a community-built food database. UK supermarket products are included.
          </div>
        </>
      )}

      {query && status === 'loading' && (
        <>
          <div className="c-section-head" style={{ marginTop: 0 }}>
            <h3 className="c-section-title">Pulling matches…</h3>
          </div>
          {[0,1,2,3,4].map(i => (
            <div key={i} className="c-result c-result-skel">
              <div className="c-result-icon c-skel-block"/>
              <div className="c-result-body">
                <div className="c-skel-line" style={{ width: `${60 + (i*7) % 30}%` }}/>
                <div className="c-skel-line c-skel-line-sm" style={{ width: `${30 + (i*11) % 20}%` }}/>
              </div>
              <div className="c-skel-block c-skel-block-sm"/>
            </div>
          ))}
        </>
      )}

      {query && status === 'ok' && results.length > 0 && (
        <>
          {customMatches.length > 0 && (
            <>
              <div className="c-section-head" style={{ marginTop: 0 }}>
                <h3 className="c-section-title">From your library</h3>
              </div>
              {customMatches.map(f => (
                <div key={f.id} className="c-result" onClick={() => onPick(f)}>
                  <FoodImage image={f.image} glyph={f.glyph} size={44} radius={12}/>
                  <div className="c-result-body">
                    <div className="c-result-name">{f.name}</div>
                    <div className="c-result-sub">{f.sub} · {f.units[0]}</div>
                  </div>
                  <div className="c-result-carbs">
                    <span className="c-result-carbs-num">{f.base}</span>
                    <span className="c-result-carbs-unit">g</span>
                  </div>
                </div>
              ))}
            </>
          )}
          <div className="c-section-head" style={{ marginTop: customMatches.length ? 18 : 0 }}>
            <h3 className="c-section-title">{results.length} result{results.length === 1 ? '' : 's'}</h3>
            <span className="c-section-action">Best match</span>
          </div>
          {results.map(f => (
            <div key={f.id} className="c-result" onClick={() => onPick(f)}>
              <FoodImage image={f.image} glyph={f.glyph} size={44} radius={12}/>
              <div className="c-result-body">
                <div className="c-result-name">{f.name}</div>
                <div className="c-result-sub">{f.sub} · {f.units[0]}</div>
              </div>
              <div className="c-result-carbs">
                <span className="c-result-carbs-num">{f.base}</span>
                <span className="c-result-carbs-unit">g</span>
              </div>
            </div>
          ))}
          <div className="c-add-attrib">
            Data from <em>OpenFoodFacts</em> · community-edited
          </div>
          <button className="c-add-byhand-row" onClick={() => onAddByHand && onAddByHand(query)}>
            <div className="c-add-byhand-icon"><Icon name="plus" size={16}/></div>
            <div className="c-add-byhand-body">
              <div className="c-add-byhand-title">Not what you wanted?</div>
              <div className="c-add-byhand-sub">Add "{query}" by hand, with a photo and the carbs from the label.</div>
            </div>
            <Icon name="chev" size={16}/>
          </button>
        </>
      )}

      {query && status === 'ok' && results.length === 0 && (
        <div style={{ textAlign:'center', padding:'40px 20px', color:'var(--stone-600)' }}>
          <div style={{ fontFamily:'var(--font-serif)', fontSize:22, fontStyle:'italic', color:'var(--ink)', marginBottom:8 }}>
            Nothing for "{query}".
          </div>
          <div style={{ fontSize:14, marginBottom:18 }}>
            OpenFoodFacts is community-edited, so a few things slip through.<br/>
            Try a shorter query or a brand name — or add it once and we'll remember it.
          </div>
          <button style={{
            background:'var(--ink)', color:'var(--paper)', border:0, borderRadius:14,
            padding:'12px 18px', fontWeight:600, cursor:'pointer', fontSize:14,
          }} onClick={() => onAddByHand && onAddByHand(query)}>
            Add "{query}" by hand
          </button>
        </div>
      )}

      {query && status === 'error' && (
        <div style={{ textAlign:'center', padding:'40px 20px', color:'var(--stone-600)' }}>
          <div style={{ fontFamily:'var(--font-serif)', fontSize:22, fontStyle:'italic', color:'var(--ink)', marginBottom:8 }}>
            Couldn't reach OpenFoodFacts.
          </div>
          <div style={{ fontSize:14, marginBottom:18 }}>The connection didn't go through. Your log is fine — try again in a moment.</div>
          <button style={{
            background:'var(--ink)', color:'var(--paper)', border:0, borderRadius:14,
            padding:'12px 18px', fontWeight:600, cursor:'pointer', fontSize:14,
          }} onClick={() => setQuery(q => q + ' ')}>
            Try again
          </button>
        </div>
      )}
    </div>
  );
};

/* =========================================================
   Portion sheet (bottom modal)
   ========================================================= */

const PortionSheet = ({ food, onCancel, onSave }) => {
  const [count, setCount] = useState(1);
  const [unitIdx, setUnitIdx] = useState(food.defaultUnit ?? 0);
  const [customMode, setCustomMode] = useState(false);
  const [customGrams, setCustomGrams] = useState(100);
  const [meal, setMeal] = useState('snack');

  // Custom grams is only meaningful if we know carbs per 100 g.
  const idx100g = food.units.findIndex(u => u === '100 g');
  const carbsPer100g = idx100g >= 0 ? food.unitVals[idx100g] : null;
  const canCustom = carbsPer100g !== null;

  // Reset all controls when the food changes
  useEffect(() => {
    setCount(1);
    setUnitIdx(food.defaultUnit ?? 0);
    setCustomMode(false);
    setCustomGrams(100);
    setMeal('snack');
  }, [food.id]);

  const perUnitCarbs = food.unitVals[unitIdx];
  const totalCarbs = customMode
    ? Math.round((carbsPer100g || 0) * customGrams / 100)
    : Math.round(perUnitCarbs * count);

  const inc  = () => setCount(c => Math.min(20, +(c + 0.5).toFixed(1)));
  const dec  = () => setCount(c => Math.max(0.5, +(c - 0.5).toFixed(1)));
  const incG = () => setCustomGrams(g => Math.min(2000, g + 10));
  const decG = () => setCustomGrams(g => Math.max(1, g - 10));

  const save = () => {
    const portion = customMode
      ? `${customGrams} g`
      : (count === 1 ? food.units[unitIdx] : `${count} × ${food.units[unitIdx]}`);
    onSave({
      foodName: food.name,
      portion,
      carbs: totalCarbs,
      meal: MEAL_CHOICES.find(m => m.id === meal).label,
    });
  };

  return (
    <div className="c-sheet-backdrop" onClick={onCancel}>
      <div className="c-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="c-sheet-grab"/>

        <div className="c-sheet-head">
          <FoodImage image={food.image} glyph={food.glyph} size={56} radius={16}/>
          <div style={{ flex:1, minWidth:0 }}>
            <div className="c-sheet-name">{food.name}</div>
            <div className="c-sheet-sub">{food.sub || `${food.base} g carbs per ${food.units[food.defaultUnit ?? 0]}`}</div>
          </div>
        </div>

        <div className="c-portion">
          <div className="c-portion-row">
            <div className="c-portion-label">{customMode ? 'Weigh it' : 'How much?'}</div>
            <div className="c-portion-counter">
              {customMode ? (
                <>
                  <button className="c-portion-btn" onClick={decG} aria-label="−10 g"><Icon name="minus" size={16}/></button>
                  <div className="c-portion-grams">
                    <input type="number" className="c-portion-grams-input"
                           value={customGrams}
                           min={1} max={2000} step={1}
                           onChange={(e) => {
                             const v = parseInt(e.target.value, 10);
                             setCustomGrams(Number.isFinite(v) ? Math.max(0, Math.min(2000, v)) : 0);
                           }}
                           onFocus={(e) => e.target.select()}/>
                    <span className="c-portion-grams-unit">g</span>
                  </div>
                  <button className="c-portion-btn" onClick={incG} aria-label="+10 g"><Icon name="plus" size={16}/></button>
                </>
              ) : (
                <>
                  <button className="c-portion-btn" onClick={dec}><Icon name="minus" size={16}/></button>
                  <div className="c-portion-val">{count}</div>
                  <button className="c-portion-btn" onClick={inc}><Icon name="plus" size={16}/></button>
                </>
              )}
            </div>
          </div>
          <div className="c-portion-unit-row">
            {food.units.map((u, i) => (
              <button key={u}
                      className={`c-portion-unit ${i === unitIdx && !customMode ? 'is-active' : ''}`}
                      onClick={() => { setUnitIdx(i); setCustomMode(false); }}>
                {u}
              </button>
            ))}
            {canCustom && (
              <button className={`c-portion-unit c-portion-unit-custom ${customMode ? 'is-active' : ''}`}
                      onClick={() => setCustomMode(true)}>
                <Icon name="edit" size={12}/> Custom
              </button>
            )}
          </div>
        </div>

        <div className="c-sheet-summary">
          <div className="c-sheet-summary-label">That's about</div>
          <div>
            <span className="c-sheet-summary-num">{totalCarbs}</span>
            <span className="c-sheet-summary-num-unit">g carbs</span>
          </div>
        </div>

        <div className="c-portion-label" style={{ marginBottom: 8, paddingLeft: 4 }}>For which meal?</div>
        <div className="c-meal-pick">
          {MEAL_CHOICES.map(m => (
            <button key={m.id}
                    className={`c-meal-pick-btn ${meal === m.id ? 'is-active' : ''}`}
                    onClick={() => setMeal(m.id)}>
              <span className="c-meal-pick-glyph">{m.glyph}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>

        <div className="c-sheet-actions">
          <button className="c-sheet-cancel" onClick={onCancel}>Not now</button>
          <button className="c-sheet-save" onClick={save}>
            <Icon name="check" size={18}/> Log it
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   Toast
   ========================================================= */

const Toast = ({ message, onUndo }) => (
  <div className="c-toast">
    <div className="c-toast-icon"><Icon name="check" size={14}/></div>
    <div className="c-toast-body">{message}</div>
    <button className="c-toast-action" onClick={onUndo}>Undo</button>
  </div>
);

Object.assign(window, {
  TabBar, HeroCarbs, SearchBar, QuickRow, MealCard,
  Today, AddFood, PortionSheet, Toast,
});
