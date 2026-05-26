// Crumb — app shell, state, Tweaks integration

const { useState, useEffect } = React;

const CrumbApp = ({ tweaks }) => {
  const [tab, setTab] = useState('today');
  const [meals, setMeals] = useState(SEED_MEALS);
  const [sheetFood, setSheetFood] = useState(null);
  const [toast, setToast] = useState(null);
  const [addFocus, setAddFocus] = useState(false);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const todayTotal = meals.reduce((a, m) => a + m.items.reduce((x, y) => x + y.carbs, 0), 0);

  const openSearch = () => {
    setAddFocus(true);
    setTab('add');
  };

  const handlePickFood = (food) => setSheetFood(food);
  const handlePickQuick = (food) => setSheetFood(food);

  const handleSave = (entry) => {
    setMeals(prev => {
      const existing = prev.find(m => m.meal === entry.meal);
      const time = new Date();
      const hh = time.getHours();
      const mm = time.getMinutes().toString().padStart(2, '0');
      const ampm = hh >= 12 ? 'pm' : 'am';
      const h12 = hh % 12 === 0 ? 12 : hh % 12;
      const timeStr = `${h12}:${mm} ${ampm}`;
      const newItem = { name: `${entry.foodName}, ${entry.portion}`, carbs: entry.carbs };
      if (existing) {
        return prev.map(m => m === existing
          ? { ...m, items: [...m.items, newItem] }
          : m);
      }
      return [...prev, {
        id: 'm' + Date.now(),
        meal: entry.meal,
        glyph: MEAL_GLYPH[entry.meal] || 'm',
        tone: MEAL_TONE[entry.meal] || 'paper',
        time: timeStr,
        timeSort: hh + (parseInt(mm)/60),
        items: [newItem],
      }];
    });
    setSheetFood(null);
    setTab('today');
    setToast({ message: `${entry.foodName} · ${entry.carbs} g`, lastEntry: entry });
  };

  const handleUndo = () => {
    if (!toast) return;
    const entry = toast.lastEntry;
    setMeals(prev => prev.map(m => {
      if (m.meal !== entry.meal) return m;
      const items = m.items.slice(0, -1);
      return { ...m, items };
    }).filter(m => m.items.length > 0));
    setToast(null);
  };

  return (
    <div className="crumb">
      {tab === 'today'    && <Today meals={meals} tweaks={tweaks}
                                    onSearchTap={openSearch}
                                    onPickQuick={handlePickQuick}/>}
      {tab === 'add'      && <AddFood onClose={() => { setAddFocus(false); setTab('today'); }}
                                      onPick={handlePickFood}
                                      onPickQuick={handlePickQuick}
                                      initialFocus={addFocus}/>}
      {tab === 'insights' && <Insights tweaks={tweaks} todayTotal={todayTotal}/>}
      {tab === 'you'      && <You tweaks={tweaks}/>}

      {toast && <Toast message={toast.message} onUndo={handleUndo}/>}

      {sheetFood && (
        <PortionSheet food={sheetFood}
                      onCancel={() => setSheetFood(null)}
                      onSave={handleSave}/>
      )}

      <TabBar tab={tab} onTab={setTab}/>
    </div>
  );
};

/* =========================================================
   Tweaks-aware wrapper
   ========================================================= */

// Map hex → tone className (so we can store a real hex in the tweak
// and TweakColor's swatch grid still renders cleanly)
const TONE_FROM_HEX = {
  '#fff6d6': 'sun',
  '#dce3d2': 'sage',
  '#f5c5a8': 'clay',
  '#dce8ee': 'sky',
};

const TweakedCrumb = () => {
  const tweakDefaults = window.__TWEAK_DEFAULTS || {};
  const [tweakValues, setTweak] = useTweaks(tweakDefaults);

  // Derive: hero tone className from stored hex
  const tweaks = {
    ...tweakValues,
    heroTone: TONE_FROM_HEX[(tweakValues.heroToneHex || '').toLowerCase()] || 'sun',
  };

  return (
    <>
      <CrumbApp tweaks={tweaks}/>
      <TweaksPanel title="Crumb tweaks">
        <TweakSection label="Today's hero">
          <TweakRadio label="Detail"
                      value={tweaks.heroDetail}
                      options={[
                        { value: 'simple',    label: 'Simple'    },
                        { value: 'breakdown', label: 'Breakdown' },
                        { value: 'trend',     label: 'Trend'     },
                      ]}
                      onChange={(v) => setTweak('heroDetail', v)}/>
          <TweakColor label="Card tone"
                      value={tweaks.heroToneHex}
                      options={['#FFF6D6', '#DCE3D2', '#F5C5A8', '#DCE8EE']}
                      onChange={(v) => setTweak('heroToneHex', v)}/>
        </TweakSection>

        <TweakSection label="Numbers">
          <TweakRadio label="Units"
                      value={tweaks.units}
                      options={[
                        { value: 'g',         label: 'Grams' },
                        { value: 'exchanges', label: 'Exchanges' },
                      ]}
                      onChange={(v) => setTweak('units', v)}/>
        </TweakSection>

        <TweakSection label="Home screen">
          <TweakToggle label="Show recent foods"
                       value={tweaks.showQuick}
                       onChange={(v) => setTweak('showQuick', v)}/>
        </TweakSection>
      </TweaksPanel>
    </>
  );
};

/* =========================================================
   Stage with iOS frame
   ========================================================= */

const Stage = () => (
  <div className="stage">
    <div>
      <IOSDevice width={390} height={820}>
        <TweakedCrumb/>
      </IOSDevice>
      <div className="stage-label">Crumb · carb counting · iPhone</div>
    </div>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(<Stage/>);
