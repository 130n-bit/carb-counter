export const SKIN_TONES    = ['#FDDBB4','#F5C59A','#E0A070','#C07840','#8D5524']
export const EYE_COLORS    = ['#4a3020','#3d6b3d','#2a4a6a','#8b6914','#1a1a2e']
export const HAIR_COLORS   = ['#0a0500','#3d1c02','#7c4a1e','#b07830','#e0c060','#c8c8c8','#f4f4f4']
export const TOP_COLORS    = ['#4a90d9','#e07856','#9db18f','#ffd24c','#9b59b6','#e74c3c','#2c3e50','#f0ece0']
export const BOTTOM_COLORS = ['#2c3e50','#3a5070','#27ae60','#7d3c98','#6d4c41','#444444']
export const GENDERS       = ['female','male']

export const HAIR_STYLE_LABELS = { pixie:'Pixie', bob:'Bob', long:'Long', wavy:'Wavy', curly:'Curly', bun:'Bun' }
export const TOP_STYLE_LABELS  = { tshirt:'T-shirt', hoodie:'Hoodie', polo:'Polo', jumper:'Jumper' }

export const AVATAR_DEFAULTS = {
  gender:      'female',
  skinTone:    '#FDDBB4',
  eyeColor:    '#4a3020',
  hairStyle:   'bob',
  hairColor:   '#3d1c02',
  topStyle:    'tshirt',
  topColor:    '#4a90d9',
  bottomColor: '#2c3e50',
}

// ─── Main component ──────────────────────────────────────────────────────────

export const AvatarSvg = ({ avatar = {}, width = 100, bust = false }) => {
  const cfg = { ...AVATAR_DEFAULTS, ...avatar }
  const { gender, skinTone: sk, eyeColor: ec, hairStyle, hairColor: hc,
          topStyle, topColor: tc, bottomColor: bc } = cfg
  const fem  = gender !== 'male'
  const shoe = '#1a1810'
  const vb   = bust ? '0 0 200 218' : '0 0 200 302'
  const ht   = bust ? Math.round(width * 218 / 200) : Math.round(width * 302 / 200)

  return (
    <svg viewBox={vb} width={width} height={ht} style={{ display: 'block' }} aria-hidden="true">

      {/* ── SHOES & LEGS ─────────────────────────────── */}
      {!bust && <>
        <ellipse cx="76"  cy="294" rx="20" ry="8" fill={shoe}/>
        <ellipse cx="124" cy="294" rx="20" ry="8" fill={shoe}/>
        {fem ? <>
          <path d="M66 270 Q63 280 63 293 Q63 299 76 299 Q88 299 88 293 L88 270 Z" fill={bc}/>
          <path d="M134 270 Q137 280 137 293 Q137 299 124 299 Q112 299 112 293 L112 270 Z" fill={bc}/>
        </> : <>
          <path d="M60 270 Q57 280 57 293 Q57 299 72 299 Q88 299 88 293 L88 270 Z" fill={bc}/>
          <path d="M140 270 Q143 280 143 293 Q143 299 128 299 Q112 299 112 293 L112 270 Z" fill={bc}/>
        </>}
      </>}

      {/* ── ARMS ──────────────────────────────────────── */}
      {fem ? <>
        <path d="M30 224 Q14 244 12 268 Q10 284 20 290 Q30 295 36 280 L40 256 Q44 236 40 220 Z" fill={tc}/>
        <path d="M170 224 Q186 244 188 268 Q190 284 180 290 Q170 295 164 280 L160 256 Q156 236 160 220 Z" fill={tc}/>
      </> : <>
        <path d="M22 218 Q4 240 2 266 Q0 284 12 290 Q24 296 32 279 L38 253 Q42 230 40 214 Z" fill={tc}/>
        <path d="M178 218 Q196 240 198 266 Q200 284 188 290 Q176 296 168 279 L162 253 Q158 230 160 214 Z" fill={tc}/>
      </>}

      {/* Hands */}
      <ellipse cx={fem ? 17 : 8}   cy="287" rx="12" ry="10" fill={sk}/>
      <ellipse cx={fem ? 183 : 192} cy="287" rx="12" ry="10" fill={sk}/>

      {/* ── TORSO ─────────────────────────────────────── */}
      {fem ? (
        <path d="M84 174 L52 186 Q28 198 26 228 Q24 255 40 270 Q54 280 74 282 L126 282 Q146 280 160 270 Q176 255 174 228 Q172 198 148 186 L116 174 Q108 179 100 177 Q92 179 84 174Z" fill={tc}/>
      ) : (
        <path d="M84 174 L36 182 Q10 194 8 226 Q6 256 26 272 Q44 282 70 284 L130 284 Q156 282 174 272 Q194 256 192 226 Q190 194 164 182 L116 174 Q108 179 100 177 Q92 179 84 174Z" fill={tc}/>
      )}

      {/* Collar detail */}
      {topStyle === 'tshirt' && (
        <path d="M84 174 Q92 181 100 179 Q108 181 116 174"
              fill="none" stroke="rgba(0,0,0,0.10)" strokeWidth="2" strokeLinecap="round"/>
      )}
      {topStyle === 'hoodie' && (<>
        <path d="M80 174 L100 191 L120 174"
              fill="none" stroke="rgba(0,0,0,0.10)" strokeWidth="2" strokeLinecap="round"/>
        <rect x="84" y="251" width="32" height="13" rx="6" fill="rgba(0,0,0,0.07)"/>
      </>)}
      {topStyle === 'polo' && (<>
        <rect x="88" y="169" width="24" height="10" rx="5" fill={tc}/>
        <path d="M88 173 L100 181 L112 173"
              fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" strokeLinecap="round"/>
      </>)}
      {topStyle === 'jumper' && (
        <rect x="85" y="168" width="30" height="10" rx="5" fill={tc}/>
      )}

      {/* ── HEAD ──────────────────────────────────────── */}
      {/* Ears (draw before head so head overlaps them naturally) */}
      <ellipse cx="47"  cy="98" rx="12" ry="17" fill={sk}/>
      <ellipse cx="153" cy="98" rx="12" ry="17" fill={sk}/>
      <ellipse cx="47"  cy="98" rx="6"  ry="10" fill="rgba(0,0,0,0.06)"/>
      <ellipse cx="153" cy="98" rx="6"  ry="10" fill="rgba(0,0,0,0.06)"/>

      {/* Neck */}
      {fem
        ? <path d="M86 162 Q82 171 82 179 L118 179 Q118 171 114 162 Q107 166 100 165 Q93 166 86 162Z" fill={sk}/>
        : <path d="M84 162 Q80 169 80 178 L120 178 Q120 169 116 162 Q108 166 100 165 Q92 166 84 162Z" fill={sk}/>
      }

      {/* Head shape — slightly tapered oval with natural chin */}
      <path d="M100 26 C154 26 157 70 153 96 C149 130 132 154 100 164 C68 154 51 130 47 96 C43 70 46 26 100 26Z" fill={sk}/>

      {/* Subtle jaw shadow */}
      <path d="M68 148 Q84 160 100 163 Q116 160 132 148"
            fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="3"/>

      {/* ── HAIR ──────────────────────────────────────── */}
      <HairLayer style={hairStyle} color={hc}/>

      {/* ── FACE ──────────────────────────────────────── */}
      {/* Blush (female) */}
      {fem && <>
        <ellipse cx="56"  cy="112" rx="20" ry="11" fill="rgba(255,100,100,0.08)"/>
        <ellipse cx="144" cy="112" rx="20" ry="11" fill="rgba(255,100,100,0.08)"/>
      </>}

      {/* Eyes */}
      <Eye cx={76}  eyeColor={ec} female={fem}/>
      <Eye cx={124} eyeColor={ec} female={fem} flip/>

      {/* Eyebrows */}
      {fem ? <>
        <path d="M60 74 Q76 67 91 71"
              fill="none" stroke={hc} strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M109 71 Q124 67 140 74"
              fill="none" stroke={hc} strokeWidth="2.5" strokeLinecap="round"/>
      </> : <>
        <path d="M58 77 Q76 72 92 75"
              fill="none" stroke={hc} strokeWidth="4.5" strokeLinecap="round"/>
        <path d="M108 75 Q124 72 142 77"
              fill="none" stroke={hc} strokeWidth="4.5" strokeLinecap="round"/>
      </>}

      {/* Nose */}
      <path d="M100 102 Q97 114 95 120"
            fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M93 122 Q89 126 95 128"
            fill="none" stroke="rgba(0,0,0,0.11)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M107 122 Q111 126 105 128"
            fill="none" stroke="rgba(0,0,0,0.11)" strokeWidth="1.5" strokeLinecap="round"/>

      {/* Lips */}
      {fem ? (<>
        {/* Upper lip — Cupid's bow */}
        <path d="M86 138 Q93 133 100 135 Q107 133 114 138"
              fill="none" stroke="rgba(175,60,60,0.65)" strokeWidth="1.8" strokeLinecap="round"/>
        {/* Lower lip */}
        <path d="M86 138 Q100 150 114 138"
              fill="rgba(200,80,80,0.10)" stroke="rgba(175,60,60,0.50)" strokeWidth="1.5" strokeLinecap="round"/>
      </>) : (
        <path d="M88 139 Q100 145 112 139"
              fill="none" stroke="rgba(0,0,0,0.17)" strokeWidth="1.8" strokeLinecap="round"/>
      )}
    </svg>
  )
}

// ─── Eye sub-component ───────────────────────────────────────────────────────

const Eye = ({ cx, eyeColor, female, flip = false }) => {
  const x1 = cx - 14, x2 = cx + 14
  const cy = 88
  // Lash x positions relative to cx
  const lashes = flip
    ? [[cx+12,cy-4,cx+15,cy-10],[cx+6,cy-7,cx+7,cy-13],[cx,cy-8,cx,cy-14],[cx-6,cy-7,cx-7,cy-13],[cx-12,cy-4,cx-15,cy-10]]
    : [[cx-12,cy-4,cx-15,cy-10],[cx-6,cy-7,cx-7,cy-13],[cx,cy-8,cx,cy-14],[cx+6,cy-7,cx+7,cy-13],[cx+12,cy-4,cx+15,cy-10]]
  return (
    <g>
      {/* Sclera — almond shape */}
      <path d={`M${x1} ${cy} Q${cx-8} ${cy-9} ${cx} ${cy-9} Q${cx+8} ${cy-9} ${x2} ${cy} Q${cx+8} ${cy+8} ${cx} ${cy+8} Q${cx-8} ${cy+8} ${x1} ${cy}Z`}
            fill="white"/>
      {/* Iris */}
      <circle cx={cx} cy={cy} r="8" fill={eyeColor}/>
      {/* Limbal ring */}
      <circle cx={cx} cy={cy} r="8" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="0.8"/>
      {/* Pupil */}
      <circle cx={cx} cy={cy} r="4.5" fill="#060304"/>
      {/* Highlights */}
      <circle cx={cx+3} cy={cy-3} r="2.5" fill="white"/>
      <circle cx={cx-2} cy={cy+2} r="1.2" fill="rgba(255,255,255,0.35)"/>
      {/* Upper lid line */}
      <path d={`M${x1} ${cy} Q${cx-8} ${cy-9} ${cx} ${cy-9} Q${cx+8} ${cy-9} ${x2} ${cy}`}
            fill="none" stroke="#2a1510" strokeWidth="1.6" strokeLinecap="round"/>
      {/* Lower lid accent */}
      <path d={`M${x1} ${cy} Q${cx} ${cy+8} ${x2} ${cy}`}
            fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="1" strokeLinecap="round"/>
      {/* Lashes (female only) */}
      {female && lashes.map(([ax,ay,bx,by], i) => (
        <line key={i} x1={ax} y1={ay} x2={bx} y2={by}
              stroke="#1a0a08" strokeWidth="1.3" strokeLinecap="round"/>
      ))}
    </g>
  )
}

// ─── Hair layer ──────────────────────────────────────────────────────────────

const HairLayer = ({ style, color }) => {
  switch (style) {
    // Backwards-compat aliases
    case 'short':
    case 'pixie':
      return (
        <path d="M100 24 C154 24 160 64 156 90 Q148 77 100 73 Q52 77 44 90 C40 64 46 24 100 24Z"
              fill={color}/>
      )
    case 'medium':
    case 'bob':
      return (
        <path d="M100 24 C154 24 160 64 158 97 C156 130 148 152 136 159 Q118 165 100 165 Q82 165 64 159 C52 152 44 130 42 97 C40 64 46 24 100 24Z"
              fill={color}/>
      )
    case 'long':
      return (
        <path d="M100 24 C154 24 160 64 158 97 C156 126 148 150 140 162 L140 238 Q130 250 100 252 Q70 250 60 238 L60 162 C52 150 44 126 42 97 C40 64 46 24 100 24Z"
              fill={color}/>
      )
    case 'wavy':
      return (
        <path d="M100 24 C154 24 160 64 158 97 C156 124 148 148 140 160 L146 192 Q158 210 152 226 Q146 242 142 256 Q130 270 100 272 Q70 270 58 256 Q54 242 48 226 Q42 210 54 192 L60 160 C52 148 44 124 42 97 C40 64 46 24 100 24Z"
              fill={color}/>
      )
    case 'curly':
      return (<>
        <ellipse cx="100" cy="50"  rx="68" ry="54" fill={color}/>
        <ellipse cx="30"  cy="90"  rx="26" ry="34" fill={color}/>
        <ellipse cx="170" cy="90"  rx="26" ry="34" fill={color}/>
        <ellipse cx="100" cy="118" rx="60" ry="22" fill={color}/>
      </>)
    case 'bun':
      return (<>
        <path d="M100 24 C154 24 160 64 156 90 Q148 77 100 73 Q52 77 44 90 C40 64 46 24 100 24Z"
              fill={color}/>
        <circle cx="100" cy="7"  r="26" fill={color}/>
        <circle cx="100" cy="10" r="15" fill="rgba(0,0,0,0.09)"/>
        {/* Hair wrap line */}
        <path d="M78 8 Q100 18 122 8" fill="none" stroke="rgba(0,0,0,0.10)" strokeWidth="1.5" strokeLinecap="round"/>
      </>)
    default:
      return null
  }
}
