import { useState } from 'react'
import { Icon } from '../components/Icons.jsx'
import {
  AvatarSvg, AVATAR_DEFAULTS,
  SKIN_TONES, EYE_COLORS, HAIR_COLORS, HAIR_STYLE_LABELS,
  FEMALE_HAIR_STYLES, MALE_HAIR_STYLES,
  TOP_COLORS, TOP_STYLE_LABELS, BOTTOM_COLORS, GENDERS,
} from '../components/AvatarSvg.jsx'

const Swatch = ({ color, selected, onClick, light }) => (
  <button
    className={`c-aved-swatch ${selected ? 'is-sel' : ''} ${light ? 'is-light' : ''}`}
    style={{ background: color }}
    onClick={onClick}
    aria-label={color}
  />
)

export const AvatarEditor = ({ avatar, onSave, onClose }) => {
  const [current, setCurrent] = useState({ ...AVATAR_DEFAULTS, ...avatar })
  const [tab, setTab]         = useState('skin')

  const val    = (key) => current[key] ?? AVATAR_DEFAULTS[key]
  const update = (key, v) => setCurrent(c => ({ ...c, [key]: v }))

  const setGender = (g) => {
    const defaultStyle = g === 'male' ? 'crop' : 'bob'
    const currentStyle = current.hairStyle
    const femStyles    = FEMALE_HAIR_STYLES
    const maleStyles   = MALE_HAIR_STYLES
    const styleOk = g === 'male'
      ? maleStyles.includes(currentStyle)
      : femStyles.includes(currentStyle)
    setCurrent(c => ({ ...c, gender: g, hairStyle: styleOk ? currentStyle : defaultStyle }))
  }

  const fem        = val('gender') !== 'male'
  const hairStyles = fem ? FEMALE_HAIR_STYLES : MALE_HAIR_STYLES

  return (
    <div className="c-aved">
      <div className="c-aved-head">
        <button className="c-back-btn" onClick={onClose}>
          <Icon name="arrowL" size={18}/>
        </button>
        <div className="c-aved-title">Your <em>avatar</em></div>
        <button className="c-aved-done" onClick={() => onSave(current)}>Save</button>
      </div>

      <div className="c-aved-stage">
        <AvatarSvg avatar={current} width={200}/>
      </div>

      <div className="c-aved-drawer">
        <div className="c-aved-tabs">
          {['skin', 'hair', 'outfit'].map(t => (
            <button key={t}
                    className={`c-aved-tab ${tab === t ? 'is-active' : ''}`}
                    onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="c-aved-body">

          {/* ── Skin ── */}
          {tab === 'skin' && <>
            <div className="c-aved-label">Gender</div>
            <div className="c-aved-gender-row">
              {GENDERS.map(g => (
                <button key={g}
                        className={`c-aved-gender-btn ${val('gender') === g ? 'is-active' : ''}`}
                        onClick={() => setGender(g)}>
                  {g === 'female' ? 'Female' : 'Male'}
                </button>
              ))}
            </div>
            <div className="c-aved-label">Skin tone</div>
            <div className="c-aved-swatches">
              {SKIN_TONES.map(c => (
                <Swatch key={c} color={c} selected={val('skinTone') === c}
                        onClick={() => update('skinTone', c)}/>
              ))}
            </div>
            <div className="c-aved-label">Eye colour</div>
            <div className="c-aved-swatches">
              {EYE_COLORS.map(c => (
                <Swatch key={c} color={c} selected={val('eyeColor') === c}
                        onClick={() => update('eyeColor', c)}/>
              ))}
            </div>
          </>}

          {/* ── Hair ── */}
          {tab === 'hair' && <>
            <div className="c-aved-label">Style</div>
            <div className="c-aved-opts">
              {hairStyles.map(key => (
                <button key={key}
                        className={`c-aved-opt ${val('hairStyle') === key ? 'is-active' : ''}`}
                        onClick={() => update('hairStyle', key)}>
                  {HAIR_STYLE_LABELS[key]}
                </button>
              ))}
            </div>
            <div className="c-aved-label">Colour</div>
            <div className="c-aved-swatches">
              {HAIR_COLORS.map(c => (
                <Swatch key={c} color={c} selected={val('hairColor') === c}
                        light={c === '#f4f4f4' || c === '#c8c8c8' || c === '#e0c060'}
                        onClick={() => update('hairColor', c)}/>
              ))}
            </div>
          </>}

          {/* ── Outfit ── */}
          {tab === 'outfit' && <>
            <div className="c-aved-label">Top style</div>
            <div className="c-aved-opts">
              {Object.entries(TOP_STYLE_LABELS).map(([key, label]) => (
                <button key={key}
                        className={`c-aved-opt ${val('topStyle') === key ? 'is-active' : ''}`}
                        onClick={() => update('topStyle', key)}>
                  {label}
                </button>
              ))}
            </div>
            <div className="c-aved-label">Top colour</div>
            <div className="c-aved-swatches">
              {TOP_COLORS.map(c => (
                <Swatch key={c} color={c} selected={val('topColor') === c}
                        light={c === '#f0ece0' || c === '#ffd24c'}
                        onClick={() => update('topColor', c)}/>
              ))}
            </div>
            <div className="c-aved-label">Bottom colour</div>
            <div className="c-aved-swatches">
              {BOTTOM_COLORS.map(c => (
                <Swatch key={c} color={c} selected={val('bottomColor') === c}
                        onClick={() => update('bottomColor', c)}/>
              ))}
            </div>
          </>}

        </div>
      </div>
    </div>
  )
}
