import { useState, useRef } from 'react'
import { Icon } from '../components/Icons.jsx'

const fileToDataUrl = (file) => new Promise((resolve, reject) => {
  const r = new FileReader()
  r.onload = () => resolve(r.result)
  r.onerror = () => reject(new Error('Could not read file'))
  r.readAsDataURL(file)
})

const dataUrlToBase64 = (url) => {
  const i = url.indexOf(',')
  return i >= 0 ? url.slice(i + 1) : url
}

const dataUrlMediaType = (url) => {
  const m = url.match(/^data:([^;]+);/)
  return m ? m[1] : 'image/jpeg'
}

// Compress + resize before sending — phone photos can be 4–8 MB
const compressImage = (dataUrl, maxDim = 1400, quality = 0.82) =>
  new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width  = Math.round(img.width  * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.src = dataUrl
  })

async function scanNutritionLabel(dataUrl) {
  const compressed = await compressImage(dataUrl)

  const res = await fetch('/api/scan-label', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageData: dataUrlToBase64(compressed),
      mediaType: 'image/jpeg',
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    if (err.error?.includes('ANTHROPIC_API_KEY')) {
      throw new Error('Label scanning is not set up — add ANTHROPIC_API_KEY to Vercel environment variables.')
    }
    throw new Error(err.error || `Server error ${res.status} — try again.`)
  }

  const { text } = await res.json()
  const match = text?.match(/\{[\s\S]*\}/)
  if (!match) throw new Error("Couldn't read that label — try a clearer, well-lit photo.")
  let parsed
  try { parsed = JSON.parse(match[0]) }
  catch { throw new Error("Couldn't read that label — try a clearer, well-lit photo.") }

  return {
    carbsPer100g:    Number.isFinite(+parsed.carbs_per_100g)    ? +parsed.carbs_per_100g    : null,
    carbsPerServing: Number.isFinite(+parsed.carbs_per_serving) ? +parsed.carbs_per_serving : null,
    servingSizeG:    Number.isFinite(+parsed.serving_size_g)    ? +parsed.serving_size_g    : null,
    productName:     typeof parsed.product_name === 'string' && parsed.product_name.trim() ? parsed.product_name.trim() : null,
  }
}

export const AddCustomFood = ({ initialName = '', onCancel, onSave }) => {
  const [name, setName]         = useState(initialName)
  const [brand, setBrand]       = useState('')
  const [carbs100, setCarbs100] = useState('')
  const [servingG, setServingG] = useState('')
  const [frontImg, setFrontImg] = useState(null)
  const [labelImg, setLabelImg] = useState(null)
  const [scanState, setScanState] = useState({ status: 'idle', error: null })

  const frontInputRef = useRef(null)
  const labelInputRef = useRef(null)

  const c100 = parseFloat(carbs100)
  const sg   = parseFloat(servingG)
  const carbsPerServing = (Number.isFinite(c100) && Number.isFinite(sg) && sg > 0)
    ? Math.round((c100 * sg / 100) * 10) / 10
    : null

  const onFrontPick = async (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFrontImg(await fileToDataUrl(f))
  }

  const onLabelPick = async (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    const url = await fileToDataUrl(f)
    setLabelImg(url)
    setScanState({ status: 'scanning', error: null })
    try {
      const r = await scanNutritionLabel(url)
      if (!name.trim() && r.productName)    setName(r.productName)
      if (!carbs100   && r.carbsPer100g != null) setCarbs100(String(r.carbsPer100g))
      if (!servingG   && r.servingSizeG != null) setServingG(String(r.servingSizeG))
      if (!carbs100 && r.carbsPer100g == null && r.carbsPerServing != null && r.servingSizeG) {
        setCarbs100(String(Math.round((r.carbsPerServing * 100 / r.servingSizeG) * 10) / 10))
      }
      setScanState({ status: 'ok', error: null })
    } catch (err) {
      setScanState({ status: 'error', error: err.message })
    }
  }

  const removeFront = () => { setFrontImg(null); if (frontInputRef.current) frontInputRef.current.value = '' }
  const removeLabel = () => { setLabelImg(null); setScanState({ status: 'idle', error: null }); if (labelInputRef.current) labelInputRef.current.value = '' }

  const canSave = name.trim() && Number.isFinite(c100) && c100 >= 0

  const save = () => {
    if (!canSave) return
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
    }
    onSave(food)
  }

  return (
    <div className="crumb-scroll">
      <div className="c-add-head">
        <button className="c-back-btn" onClick={onCancel} aria-label="Back"><Icon name="arrowL" size={18}/></button>
        <div className="c-add-title"><em>Add</em> a food</div>
      </div>

      <p className="c-cf-help">
        If you can't find a product, add it here. We'll remember it for next time.
      </p>

      <div className="c-cf-photos">
        <label className="c-cf-photo">
          <input ref={frontInputRef} type="file" accept="image/*" capture="environment"
                 onChange={onFrontPick} style={{ display: 'none' }}/>
          {frontImg ? (
            <>
              <img src={frontImg} alt="Front of pack"/>
              <button type="button" className="c-cf-photo-x"
                      onClick={(e) => { e.preventDefault(); removeFront() }}
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
                      onClick={(e) => { e.preventDefault(); removeLabel() }}
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
  )
}
