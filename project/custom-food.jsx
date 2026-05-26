// Crumb — Add Custom Food screen
// Manual entry + nutrition-label OCR via window.claude.complete (vision)

const { useState: useStateCF, useRef: useRefCF, useEffect: useEffectCF } = React;

/* ----- localStorage helpers ---------------------------------- */

const CUSTOM_KEY = 'crumb.customFoods';

const loadCustomFoods = () => {
  try {
    const raw = localStorage.getItem(CUSTOM_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
};

const saveCustomFoods = (foods) => {
  try { localStorage.setItem(CUSTOM_KEY, JSON.stringify(foods)); } catch {}
};

/* ----- File → base64 ---------------------------------------- */

const fileToDataUrl = (file) => new Promise((resolve, reject) => {
  const r = new FileReader();
  r.onload = () => resolve(r.result);
  r.onerror = () => reject(new Error('Could not read file'));
  r.readAsDataURL(file);
});

const dataUrlToBase64 = (url) => {
  const i = url.indexOf(',');
  return i >= 0 ? url.slice(i + 1) : url;
};

const dataUrlMediaType = (url) => {
  const m = url.match(/^data:([^;]+);/);
  return m ? m[1] : 'image/jpeg';
};

/* ----- OCR: scan a nutrition label via Claude vision -------- */

async function scanNutritionLabel(dataUrl) {
  const prompt = `You are reading a UK or international food nutrition label.

Return ONLY a JSON object (no prose, no markdown, no code fence) with this exact shape:
{
  "carbs_per_100g": <number or null>,
  "carbs_per_serving": <number or null>,
  "serving_size_g": <number or null>,
  "product_name": <string or null>
}

Rules:
- "carbs" means total "Carbohydrate" — NOT "of which sugars".
- If a value isn't visible or readable, use null.
- serving_size_g should be the grams in one serving (e.g. "Per 30g" → 30).
- product_name only if clearly printed on this image; otherwise null.
- Numbers: no units in the values; just the number.`;

  const result = await window.claude.complete({
    messages: [{
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: dataUrlMediaType(dataUrl), data: dataUrlToBase64(dataUrl) } },
        { type: 'text', text: prompt },
      ],
    }],
  });

  // Pull the first {...} block from the response
  const text = typeof result === 'string' ? result : (result?.text || '');
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('Couldn\'t read that label — try a clearer photo.');
  let parsed;
  try { parsed = JSON.parse(match[0]); }
  catch { throw new Error('Couldn\'t read that label — try a clearer photo.'); }

  return {
    carbsPer100g:    Number.isFinite(+parsed.carbs_per_100g)    ? +parsed.carbs_per_100g    : null,
    carbsPerServing: Number.isFinite(+parsed.carbs_per_serving) ? +parsed.carbs_per_serving : null,
    servingSizeG:    Number.isFinite(+parsed.serving_size_g)    ? +parsed.serving_size_g    : null,
    productName:     typeof parsed.product_name === 'string' && parsed.product_name.trim() ? parsed.product_name.trim() : null,
  };
}

/* ----- AddCustomFood screen --------------------------------- */

const AddCustomFood = ({ initialName = '', onCancel, onSave }) => {
  const [name, setName]         = useStateCF(initialName);
  const [brand, setBrand]       = useStateCF('');
  const [carbs100, setCarbs100] = useStateCF('');
  const [servingG, setServingG] = useStateCF('');
  const [frontImg, setFrontImg] = useStateCF(null);   // data URL
  const [labelImg, setLabelImg] = useStateCF(null);   // data URL
  const [scanState, setScanState] = useStateCF({ status: 'idle', error: null }); // idle | scanning | ok | error

  const frontInputRef = useRefCF(null);
  const labelInputRef = useRefCF(null);

  // Computed carbs-per-serving (live)
  const c100 = parseFloat(carbs100);
  const sg   = parseFloat(servingG);
  const carbsPerServing = (Number.isFinite(c100) && Number.isFinite(sg) && sg > 0)
    ? Math.round((c100 * sg / 100) * 10) / 10
    : null;

  const onFrontPick = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFrontImg(await fileToDataUrl(f));
  };

  const onLabelPick = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = await fileToDataUrl(f);
    setLabelImg(url);
    setScanState({ status: 'scanning', error: null });
    try {
      const r = await scanNutritionLabel(url);
      // Populate any field that was empty + that we found
      if (!name.trim() && r.productName)    setName(r.productName);
      if (!carbs100   && r.carbsPer100g != null) setCarbs100(String(r.carbsPer100g));
      if (!servingG   && r.servingSizeG != null) setServingG(String(r.servingSizeG));
      // If they only gave per-serving + serving size, back-compute per-100g
      if (!carbs100 && r.carbsPer100g == null && r.carbsPerServing != null && r.servingSizeG) {
        setCarbs100(String(Math.round((r.carbsPerServing * 100 / r.servingSizeG) * 10) / 10));
      }
      setScanState({ status: 'ok', error: null });
    } catch (err) {
      setScanState({ status: 'error', error: err.message });
    }
  };

  const removeFront = () => { setFrontImg(null); if (frontInputRef.current) frontInputRef.current.value = ''; };
  const removeLabel = () => { setLabelImg(null); setScanState({ status: 'idle', error: null }); if (labelInputRef.current) labelInputRef.current.value = ''; };

  const canSave = name.trim() && Number.isFinite(c100) && c100 >= 0;

  const save = () => {
    if (!canSave) return;
    const food = {
      id: 'custom-' + Date.now(),
      name: name.trim(),
      sub: brand.trim() || 'Your library',
      glyph: name.trim()[0].toLowerCase(),
      image: frontImg || null,
      base: Number.isFinite(sg) && sg > 0 ? Math.round((c100 * sg / 100)) : Math.round(c100),
      units: (Number.isFinite(sg) && sg > 0 ? [`serving (${Math.round(sg)} g)`] : []).concat(['100 g', '50 g']),
      unitVals: (Number.isFinite(sg) && sg > 0 ? [Math.round((c100 * sg / 100) * 10) / 10] : []).concat([Math.round(c100 * 10) / 10, Math.round(c100 * 0.5 * 10) / 10]),
      defaultUnit: 0,
      source: 'custom',
      createdAt: Date.now(),
    };
    onSave(food);
  };

  return (
    <div className="crumb-scroll">
      <div className="c-add-head">
        <button className="c-back-btn" onClick={onCancel} aria-label="Back"><Icon name="arrowL" size={18}/></button>
        <div className="c-add-title"><em>Add</em> a food</div>
      </div>

      <p className="c-cf-help">
        If you can't find a product, add it here. We'll remember it for next time.
      </p>

      {/* Two photo slots */}
      <div className="c-cf-photos">
        {/* Front of pack */}
        <label className="c-cf-photo">
          <input ref={frontInputRef} type="file" accept="image/*" capture="environment"
                 onChange={onFrontPick} style={{ display: 'none' }}/>
          {frontImg ? (
            <>
              <img src={frontImg} alt="Front of pack"/>
              <button type="button" className="c-cf-photo-x"
                      onClick={(e) => { e.preventDefault(); removeFront(); }}
                      aria-label="Remove photo">×</button>
            </>
          ) : (
            <div className="c-cf-photo-empty">
              <Icon name="camera" size={22}/>
              <span>Front of pack</span>
              <span className="c-cf-photo-sub">Optional</span>
            </div>
          )}
        </label>

        {/* Nutrition label (with OCR) */}
        <label className="c-cf-photo">
          <input ref={labelInputRef} type="file" accept="image/*" capture="environment"
                 onChange={onLabelPick} style={{ display: 'none' }}/>
          {labelImg ? (
            <>
              <img src={labelImg} alt="Nutrition label"/>
              {scanState.status === 'scanning' && (
                <div className="c-cf-photo-overlay">
                  <div className="c-cf-overlay-text">Reading the label…</div>
                </div>
              )}
              {scanState.status === 'ok' && (
                <div className="c-cf-photo-badge"><Icon name="check" size={11}/> Scanned</div>
              )}
              <button type="button" className="c-cf-photo-x"
                      onClick={(e) => { e.preventDefault(); removeLabel(); }}
                      aria-label="Remove photo">×</button>
            </>
          ) : (
            <div className="c-cf-photo-empty c-cf-photo-scan">
              <Icon name="sparkle" size={22}/>
              <span>Scan label</span>
              <span className="c-cf-photo-sub">Fills the numbers in</span>
            </div>
          )}
        </label>
      </div>

      {scanState.status === 'error' && (
        <div className="c-cf-scan-error">
          {scanState.error || "Couldn't read the label. Try a clearer photo or fill it in by hand."}
        </div>
      )}

      {/* Form */}
      <div className="c-cf-field">
        <label className="c-cf-label">Product name <span className="c-cf-req">·</span></label>
        <input className="c-cf-input" type="text" value={name}
               onChange={(e) => setName(e.target.value)}
               placeholder="e.g. Sourdough loaf"/>
      </div>

      <div className="c-cf-field">
        <label className="c-cf-label">Brand</label>
        <input className="c-cf-input" type="text" value={brand}
               onChange={(e) => setBrand(e.target.value)}
               placeholder="Optional"/>
      </div>

      <div className="c-cf-row">
        <div className="c-cf-field c-cf-half">
          <label className="c-cf-label">Carbs per 100 g <span className="c-cf-req">·</span></label>
          <div className="c-cf-input-with-unit">
            <input className="c-cf-input" type="number" inputMode="decimal" min="0" step="0.1"
                   value={carbs100}
                   onChange={(e) => setCarbs100(e.target.value)}
                   placeholder="0"/>
            <span className="c-cf-input-unit">g</span>
          </div>
        </div>
        <div className="c-cf-field c-cf-half">
          <label className="c-cf-label">Serving size</label>
          <div className="c-cf-input-with-unit">
            <input className="c-cf-input" type="number" inputMode="decimal" min="0" step="1"
                   value={servingG}
                   onChange={(e) => setServingG(e.target.value)}
                   placeholder="Optional"/>
            <span className="c-cf-input-unit">g</span>
          </div>
        </div>
      </div>

      {carbsPerServing !== null && (
        <div className="c-cf-computed">
          One serving ≈ <em>{carbsPerServing} g carbs</em>
        </div>
      )}

      <div className="c-cf-actions">
        <button className="c-sheet-cancel" onClick={onCancel}>Cancel</button>
        <button className={`c-sheet-save ${canSave ? '' : 'is-disabled'}`}
                onClick={save} disabled={!canSave}>
          <Icon name="check" size={18}/> Save and log
        </button>
      </div>

      <div className="c-cf-foot">
        <span className="c-cf-req">·</span> required
      </div>
    </div>
  );
};

Object.assign(window, {
  AddCustomFood, loadCustomFoods, saveCustomFoods, scanNutritionLabel,
});
