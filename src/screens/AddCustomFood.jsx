import { useState, useRef } from 'react'
import { Icon } from '../components/Icons.jsx'

const fileToDataUrl = (file) => new Promise((resolve, reject) => {
  const r = new FileReader()
  r.onload = () => resolve(r.result)
  r.onerror = () => reject(new Error('Could not read file'))
  r.readAsDataURL(file)
})

export const AddCustomFood = ({ initialName = '', onCancel, onSave }) => {
  const [name, setName]         = useState(initialName)
  const [brand, setBrand]       = useState('')
  const [carbs100, setCarbs100] = useState('')
  const [servingG, setServingG] = useState('')
  const [frontImg, setFrontImg] = useState(null)

  const frontInputRef = useRef(null)

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

  const removeFront = () => {
    setFrontImg(null)
    if (frontInputRef.current) frontInputRef.current.value = ''
  }

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

      <label className="c-cf-photo-single">
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
            <span>Photo</span>
            <span className="c-cf-photo-sub">Optional</span>
          </div>
        )}
      </label>

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
