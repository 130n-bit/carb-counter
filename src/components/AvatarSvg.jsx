export const SKIN_TONES   = ['#FDDBB4', '#F5C59A', '#E0A070', '#C07840', '#8D5524']
export const HAIR_COLORS  = ['#1a0800', '#4a2010', '#7c4a1e', '#b07830', '#e0c060', '#c8c8c8', '#f0f0f0']
export const TOP_COLORS   = ['#4a90d9', '#e07856', '#9db18f', '#ffd24c', '#9b59b6', '#e74c3c', '#2c3e50', '#e8e0d0']
export const BOTTOM_COLORS= ['#2c3e50', '#3a5070', '#27ae60', '#7d3c98', '#6d4c41', '#555']
export const HAIR_STYLE_LABELS = { short: 'Short', medium: 'Medium', long: 'Long', curly: 'Curly', bun: 'Bun' }
export const TOP_STYLE_LABELS  = { tshirt: 'T-shirt', hoodie: 'Hoodie', polo: 'Polo', jumper: 'Jumper' }

export const AVATAR_DEFAULTS = {
  skinTone:    '#FDDBB4',
  hairStyle:   'medium',
  hairColor:   '#4a2010',
  topStyle:    'tshirt',
  topColor:    '#4a90d9',
  bottomColor: '#2c3e50',
}

// bust=true clips to head + shoulders only (for small header icon)
export const AvatarSvg = ({ avatar = {}, width = 100, bust = false }) => {
  const {
    skinTone:    skin        = AVATAR_DEFAULTS.skinTone,
    hairStyle                = AVATAR_DEFAULTS.hairStyle,
    hairColor                = AVATAR_DEFAULTS.hairColor,
    topStyle                 = AVATAR_DEFAULTS.topStyle,
    topColor                 = AVATAR_DEFAULTS.topColor,
    bottomColor              = AVATAR_DEFAULTS.bottomColor,
  } = avatar

  const shoe   = '#1a1a1a'
  const vb     = bust ? '0 0 120 108' : '0 0 120 180'
  const height = bust ? Math.round(width * (108 / 120)) : Math.round(width * 1.5)

  return (
    <svg viewBox={vb} width={width} height={height}
         style={{ display: 'block' }} aria-hidden="true">

      {/* Shoes */}
      {!bust && <ellipse cx="42" cy="173" rx="17" ry="7" fill={shoe}/>}
      {!bust && <ellipse cx="78" cy="173" rx="17" ry="7" fill={shoe}/>}

      {/* Pants / legs */}
      {!bust && <rect x="32" y="116" width="22" height="60" rx="11" fill={bottomColor}/>}
      {!bust && <rect x="66" y="116" width="22" height="60" rx="11" fill={bottomColor}/>}

      {/* Arms */}
      <rect x="2" y="86" width="22" height="40" rx="11"
            transform="rotate(13, 13, 86)" fill={topColor}/>
      <rect x="96" y="86" width="22" height="40" rx="11"
            transform="rotate(-13, 107, 86)" fill={topColor}/>

      {/* Main shirt body */}
      <rect x="22" y="80" width="76" height="44" rx="16" fill={topColor}/>

      {/* Top-style details */}
      {topStyle === 'tshirt' && (
        <path d="M52 80 Q60 89 68 80" fill="none"
              stroke="rgba(0,0,0,0.10)" strokeWidth="2" strokeLinecap="round"/>
      )}
      {topStyle === 'hoodie' && (
        <>
          <path d="M48 80 L60 93 L72 80" fill="none"
                stroke="rgba(0,0,0,0.10)" strokeWidth="2" strokeLinecap="round"/>
          <rect x="44" y="108" width="32" height="13" rx="6"
                fill="rgba(0,0,0,0.07)"/>
        </>
      )}
      {topStyle === 'polo' && (
        <>
          <rect x="51" y="76" width="18" height="9" rx="4" fill={topColor}/>
          <path d="M51 80 L60 89 L69 80" fill="none"
                stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" strokeLinecap="round"/>
        </>
      )}
      {topStyle === 'jumper' && (
        <rect x="47" y="75" width="26" height="9" rx="4.5" fill={topColor}/>
      )}

      {/* Hands */}
      <circle cx="8"   cy="124" r="9" fill={skin}/>
      <circle cx="112" cy="124" r="9" fill={skin}/>

      {/* Neck */}
      <rect x="52" y="70" width="16" height="14" rx="4" fill={skin}/>

      {/* Head */}
      <circle cx="60" cy="48" r="32" fill={skin}/>

      {/* Hair */}
      <HairLayer style={hairStyle} color={hairColor}/>

      {/* Eyes */}
      <circle cx="49" cy="46" r="4"   fill="#1a0800"/>
      <circle cx="71" cy="46" r="4"   fill="#1a0800"/>
      <circle cx="50.5" cy="44.5" r="1.5" fill="rgba(255,255,255,0.5)"/>
      <circle cx="72.5" cy="44.5" r="1.5" fill="rgba(255,255,255,0.5)"/>

      {/* Nose */}
      <circle cx="60" cy="53" r="2" fill="rgba(0,0,0,0.08)"/>

      {/* Smile */}
      <path d="M49 62 Q60 71 71 62"
            fill="none" stroke="#1a0800" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
}

const HairBase = ({ color }) => (
  <>
    <ellipse cx="60" cy="18" rx="32" ry="18" fill={color}/>
    <rect    x="28"  y="18"  width="64" height="24" fill={color}/>
  </>
)

const HairLayer = ({ style, color }) => {
  switch (style) {
    case 'short':
      return <HairBase color={color}/>
    case 'medium':
      return (
        <>
          <HairBase color={color}/>
          <rect x="26" y="36" width="10" height="30" rx="5" fill={color}/>
          <rect x="84" y="36" width="10" height="30" rx="5" fill={color}/>
        </>
      )
    case 'long':
      return (
        <>
          <HairBase color={color}/>
          <path d="M26 36 C14 50 12 70 14 100 Q16 114 26 112 Q34 110 32 96 L30 44Z"
                fill={color}/>
          <path d="M94 36 C106 50 108 70 106 100 Q104 114 94 112 Q86 110 88 96 L90 44Z"
                fill={color}/>
        </>
      )
    case 'curly':
      return (
        <>
          <ellipse cx="60" cy="12" rx="36" ry="24" fill={color}/>
          <circle  cx="26" cy="34" r="18"           fill={color}/>
          <circle  cx="94" cy="34" r="18"           fill={color}/>
        </>
      )
    case 'bun':
      return (
        <>
          <HairBase color={color}/>
          <circle cx="60" cy="4" r="16" fill={color}/>
          <circle cx="60" cy="6" r="9"  fill="rgba(0,0,0,0.07)"/>
        </>
      )
    default:
      return null
  }
}
