import { useState, useEffect, useRef } from 'react'
import { Icon } from '../components/Icons.jsx'
import { FoodImage } from '../components/FoodImage.jsx'
import { useFoodSearch } from '../hooks/useFoodSearch.js'
import { QUICK_FOODS } from '../data.js'

export const AddFood = ({ onClose, onPick, onPickQuick, initialFocus, customFoods = [], favourites = [], onAddByHand, onToggleFav }) => {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (initialFocus && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 60)
    }
  }, [initialFocus])

  const { status, results, error } = useFoodSearch(query)

  const customMatches = query.trim()
    ? customFoods.filter(f => {
        const hay = (f.name + ' ' + (f.sub || '')).toLowerCase()
        return query.trim().toLowerCase().split(/\s+/).every(w => hay.includes(w))
      })
    : []

  const favMatches = query.trim()
    ? favourites.filter(f => {
        const hay = (f.name + ' ' + (f.sub || '')).toLowerCase()
        return query.trim().toLowerCase().split(/\s+/).every(w => hay.includes(w))
      })
    : []

  const isFav = (food) => favourites.some(f => f.id === food.id)

  const ResultRow = ({ food, showFavBtn = true }) => (
    <div className="c-result" onClick={() => onPick(food)}>
      <FoodImage image={food.image} glyph={food.glyph} size={44} radius={12}/>
      <div className="c-result-body">
        <div className="c-result-name">{food.name}</div>
        <div className="c-result-sub">{food.sub} · {food.units[food.defaultUnit ?? 0]}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {showFavBtn && onToggleFav && (
          <button className={`c-fav-btn ${isFav(food) ? 'is-fav' : ''}`}
                  onClick={(e) => { e.stopPropagation(); onToggleFav(food) }}
                  aria-label={isFav(food) ? 'Remove from favourites' : 'Save to favourites'}
                  title={isFav(food) ? 'Saved' : 'Save'}>
            <Icon name={isFav(food) ? 'star-fill' : 'star'} size={16}/>
          </button>
        )}
        <div className="c-result-carbs">
          <span className="c-result-carbs-num">{food.base}</span>
          <span className="c-result-carbs-unit">g</span>
        </div>
      </div>
    </div>
  )

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
            <button className="c-tool" onClick={() => onAddByHand && onAddByHand('')}>
              <div className="c-tool-icon t-clay"><Icon name="edit" size={20}/></div>
              <div className="c-tool-label">Add by hand</div>
            </button>
          </div>

          {favourites.length > 0 && (
            <>
              <div className="c-section-head" style={{ marginTop: 0 }}>
                <h3 className="c-section-title">Saved foods</h3>
                <span className="c-section-action"><Icon name="star-fill" size={12}/></span>
              </div>
              {favourites.slice(0, 4).map(f => (
                <div key={f.id} className="c-result" onClick={() => onPick(f)}>
                  <FoodImage image={f.image} glyph={f.glyph} size={40} radius={12}/>
                  <div className="c-result-body">
                    <div className="c-result-name">{f.name}</div>
                    <div className="c-result-sub">{f.sub} · {f.units[f.defaultUnit ?? 0]}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button className="c-fav-btn is-fav"
                            onClick={(e) => { e.stopPropagation(); onToggleFav(f) }}
                            aria-label="Remove from favourites">
                      <Icon name="star-fill" size={16}/>
                    </button>
                    <div className="c-result-carbs">
                      <span className="c-result-carbs-num">{f.base}</span>
                      <span className="c-result-carbs-unit">g</span>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {customFoods.length > 0 && (
            <>
              <div className="c-section-head" style={{ marginTop: favourites.length ? 16 : 0 }}>
                <h3 className="c-section-title">Your foods</h3>
                <span className="c-section-action" onClick={() => onAddByHand && onAddByHand('')}>
                  <Icon name="plus" size={12}/> Add
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
            </>
          )}

          <div className="c-section-head" style={{ marginTop: (favourites.length || customFoods.length) ? 16 : 0 }}>
            <h3 className="c-section-title">Often, recently</h3>
            <span className="c-section-action" onClick={() => onAddByHand && onAddByHand('')}>
              <Icon name="plus" size={12}/> Add by hand
            </span>
          </div>
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
            Searching pulls live results from <em>OpenFoodFacts</em>, a community-built food database.
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

      {query && status === 'ok' && (results.length > 0 || customMatches.length > 0 || favMatches.length > 0) && (
        <>
          {favMatches.length > 0 && (
            <>
              <div className="c-section-head" style={{ marginTop: 0 }}>
                <h3 className="c-section-title">Saved foods</h3>
              </div>
              {favMatches.map(f => <ResultRow key={f.id} food={f}/>)}
            </>
          )}
          {customMatches.length > 0 && (
            <>
              <div className="c-section-head" style={{ marginTop: favMatches.length ? 18 : 0 }}>
                <h3 className="c-section-title">From your library</h3>
              </div>
              {customMatches.map(f => <ResultRow key={f.id} food={f} showFavBtn={false}/>)}
            </>
          )}
          {results.length > 0 && (
            <>
              <div className="c-section-head" style={{ marginTop: (customMatches.length || favMatches.length) ? 18 : 0 }}>
                <h3 className="c-section-title">{results.length} result{results.length === 1 ? '' : 's'}</h3>
                <span className="c-section-action">Best match</span>
              </div>
              {results.map(f => <ResultRow key={f.id} food={f}/>)}
            </>
          )}
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

      {query && status === 'ok' && results.length === 0 && customMatches.length === 0 && favMatches.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--stone-600)' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontStyle: 'italic', color: 'var(--ink)', marginBottom: 8 }}>
            Nothing for "{query}".
          </div>
          <div style={{ fontSize: 14, marginBottom: 18 }}>
            OpenFoodFacts is community-edited, so a few things slip through.<br/>
            Try a shorter query or a brand name — or add it once and we'll remember it.
          </div>
          <button style={{
            background: 'var(--ink)', color: 'var(--paper)', border: 0, borderRadius: 14,
            padding: '12px 18px', fontWeight: 600, cursor: 'pointer', fontSize: 14,
          }} onClick={() => onAddByHand && onAddByHand(query)}>
            Add "{query}" by hand
          </button>
        </div>
      )}

      {query && status === 'error' && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--stone-600)' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontStyle: 'italic', color: 'var(--ink)', marginBottom: 8 }}>
            Couldn't reach OpenFoodFacts.
          </div>
          <div style={{ fontSize: 14, marginBottom: 18 }}>The connection didn't go through. Try again in a moment.</div>
          <button style={{
            background: 'var(--ink)', color: 'var(--paper)', border: 0, borderRadius: 14,
            padding: '12px 18px', fontWeight: 600, cursor: 'pointer', fontSize: 14,
          }} onClick={() => setQuery(q => q + ' ')}>
            Try again
          </button>
        </div>
      )}
    </div>
  )
}
