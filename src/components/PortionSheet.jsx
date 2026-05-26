import { useState, useEffect } from 'react'
import { Icon } from './Icons.jsx'
import { FoodImage } from './FoodImage.jsx'
import { MEAL_CHOICES } from '../data.js'

export const PortionSheet = ({ food, onCancel, onSave }) => {
  const [count, setCount] = useState(1)
  const [unitIdx, setUnitIdx] = useState(food.defaultUnit ?? 0)
  const [customMode, setCustomMode] = useState(false)
  const [customGrams, setCustomGrams] = useState(100)
  const [meal, setMeal] = useState('snack')

  const idx100g = food.units.findIndex(u => u === '100 g')
  const carbsPer100g = idx100g >= 0 ? food.unitVals[idx100g] : null
  const canCustom = carbsPer100g !== null

  useEffect(() => {
    setCount(1)
    setUnitIdx(food.defaultUnit ?? 0)
    setCustomMode(false)
    setCustomGrams(100)
    setMeal('snack')
  }, [food.id])

  const perUnitCarbs = food.unitVals[unitIdx]
  const totalCarbs = customMode
    ? Math.round((carbsPer100g || 0) * customGrams / 100)
    : Math.round(perUnitCarbs * count)

  const inc  = () => setCount(c => Math.min(20, +(c + 0.5).toFixed(1)))
  const dec  = () => setCount(c => Math.max(0.5, +(c - 0.5).toFixed(1)))
  const incG = () => setCustomGrams(g => Math.min(2000, g + 10))
  const decG = () => setCustomGrams(g => Math.max(1, g - 10))

  const save = () => {
    const portion = customMode
      ? `${customGrams} g`
      : (count === 1 ? food.units[unitIdx] : `${count} × ${food.units[unitIdx]}`)
    onSave({
      foodName: food.name,
      portion,
      carbs: totalCarbs,
      meal: MEAL_CHOICES.find(m => m.id === meal).label,
    })
  }

  return (
    <div className="c-sheet-backdrop" onClick={onCancel}>
      <div className="c-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="c-sheet-grab"/>

        <div className="c-sheet-head">
          <FoodImage image={food.image} glyph={food.glyph} size={56} radius={16}/>
          <div style={{ flex: 1, minWidth: 0 }}>
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
                             const v = parseInt(e.target.value, 10)
                             setCustomGrams(Number.isFinite(v) ? Math.max(0, Math.min(2000, v)) : 0)
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
                      onClick={() => { setUnitIdx(i); setCustomMode(false) }}>
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
  )
}
