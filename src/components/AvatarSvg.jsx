export const SKIN_TONES    = ['#FDDBB4','#F5C59A','#E0A070','#C07840','#8D5524']
export const EYE_COLORS    = ['#4a3020','#3d6b3d','#2a4a6a','#8b6914','#1a1a2e']
export const HAIR_COLORS   = ['#0a0500','#3d1c02','#7c4a1e','#b07830','#e0c060','#c8c8c8','#f4f4f4']
export const TOP_COLORS    = ['#4a90d9','#e07856','#9db18f','#ffd24c','#9b59b6','#e74c3c','#2c3e50','#f0ece0']
export const BOTTOM_COLORS = ['#2c3e50','#3a5070','#27ae60','#7d3c98','#6d4c41','#444444']
export const GENDERS       = ['female','male']

export const FEMALE_HAIR_STYLES = ['pixie','bob','long','wavy','curly','bun']
export const MALE_HAIR_STYLES   = ['buzz','crop','quiff','undercut']

export const HAIR_STYLE_LABELS = {
  pixie:'Pixie', bob:'Bob', long:'Long', wavy:'Wavy', curly:'Curly', bun:'Bun',
  buzz:'Buzz cut', crop:'Crop', quiff:'Quiff', undercut:'Undercut',
}
export const TOP_STYLE_LABELS = { tshirt:'T-shirt', hoodie:'Hoodie', polo:'Polo', jumper:'Jumper' }

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

// ─── Coordinate reference ────────────────────────────────────────────────────
//  viewBox 0 0 200 330 (full) / 0 0 200 232 (bust)
//  Head     y  28 – 164  (136px)
//  Neck     y 156 – 186  (neck top reaches inside head — no gap)
//  Torso    y 182 – 258f / 264m  (trapezoid, straight sides)
//  Legs     y 256 – 320
//  Shoes    y 322

export const AvatarSvg = ({ avatar = {}, width = 100, bust = false }) => {
  const cfg  = { ...AVATAR_DEFAULTS, ...avatar }
  const { gender, skinTone: sk, eyeColor: ec, hairStyle, hairColor: hc,
          topStyle, topColor: tc, bottomColor: bc } = cfg
  const fem  = gender !== 'male'
  const shoe = '#1c1a14'
  const vb   = bust ? '0 0 200 232' : '0 0 200 330'
  const ht   = bust ? Math.round(width * 232/200) : Math.round(width * 330/200)

  return (
    <svg viewBox={vb} width={width} height={ht} style={{ display:'block' }} aria-hidden="true">

      {/* ── 1. BACK HAIR — drawn before everything so head covers face area ── */}
      <HairBack style={hairStyle} color={hc}/>

      {/* ── 2. SHOES & LEGS ─────────────────────────────────────────────── */}
      {!bust && <>
        <ellipse cx={fem?76:74}  cy="322" rx="22" ry="8" fill={shoe}/>
        <ellipse cx={fem?124:126} cy="322" rx="22" ry="8" fill={shoe}/>
        {fem ? <>
          {/* Female legs — slim, centered under hip */}
          <path d="M58 258 L62 318 Q62 326 76 326 Q88 326 88 318 L84 258Z" fill={bc}/>
          <path d="M142 258 L138 318 Q138 326 124 326 Q112 326 112 318 L116 258Z" fill={bc}/>
        </> : <>
          {/* Male legs — wider, straight */}
          <path d="M50 262 L52 318 Q52 326 72 326 Q88 326 88 318 L84 262Z" fill={bc}/>
          <path d="M150 262 L148 318 Q148 326 128 326 Q112 326 112 318 L116 262Z" fill={bc}/>
        </>}
        {/* Waistband sits right on the torso-leg join */}
        <rect x={fem?44:30} y="253" width={fem?112:140} height="9" rx="2" fill={bc}/>
        <line x1={fem?44:30} y1="261" x2={fem?156:170} y2="261" stroke="rgba(0,0,0,0.14)" strokeWidth="1"/>
      </>}

      {/* ── 3. ARMS — drawn before torso so shoulder joint is covered ───── */}
      {fem ? <>
        <path d="M12 200 Q2 234 2 264 Q0 284 12 292 Q24 298 30 281 L34 256 Q38 228 34 198Z" fill={tc}/>
        <path d="M188 200 Q198 234 198 264 Q200 284 188 292 Q176 298 170 281 L166 256 Q162 228 166 198Z" fill={tc}/>
      </> : <>
        <path d="M4 198 Q-4 234 -2 264 Q-2 286 10 294 Q22 300 28 283 L34 258 Q40 228 36 196Z" fill={tc}/>
        <path d="M196 198 Q204 234 202 264 Q202 286 190 294 Q178 300 172 283 L166 258 Q160 228 164 196Z" fill={tc}/>
      </>}

      {/* Hands */}
      <ellipse cx={fem?12:8}   cy="289" rx="13" ry="11" fill={sk}/>
      <ellipse cx={fem?188:192} cy="289" rx="13" ry="11" fill={sk}/>

      {/* ── 4. TORSO — trapezoid: wide shoulder, straight sides, no nip ─── */}
      {fem ? (
        // Shoulders ~152px wide, hips ~116px, clean straight diagonal sides
        <path d="M80 182 L22 202 L40 258 L160 258 L178 202 L120 182 Q108 187 100 185 Q92 187 80 182Z" fill={tc}/>
      ) : (
        // Shoulders ~172px wide, hips ~136px
        <path d="M80 182 L14 202 L32 264 L168 264 L186 202 L120 182 Q108 187 100 185 Q92 187 80 182Z" fill={tc}/>
      )}

      {/* ── 5. OUTFIT DETAILS ─────────────────────────────────────────────── */}
      <TopDetail style={topStyle} tc={tc} sk={sk} fem={fem}/>

      {/* ── 6. EARS ───────────────────────────────────────────────────────── */}
      <ellipse cx="47"  cy="98" rx="12" ry="17" fill={sk}/>
      <ellipse cx="153" cy="98" rx="12" ry="17" fill={sk}/>
      <ellipse cx="47"  cy="98" rx="6"  ry="10" fill="rgba(0,0,0,0.06)"/>
      <ellipse cx="153" cy="98" rx="6"  ry="10" fill="rgba(0,0,0,0.06)"/>

      {/* ── 7. NECK — top starts at y=156, well inside head boundary ─────── */}
      {/* Head at y=156 is ~x=78–122, neck top is x=82–118 → fully inside = no gap */}
      {fem
        ? <path d="M82 156 Q80 170 80 184 L120 184 Q120 170 118 156 Q110 161 100 160 Q90 161 82 156Z" fill={sk}/>
        : <path d="M80 156 Q76 168 76 184 L124 184 Q124 168 120 156 Q112 161 100 160 Q88 161 80 156Z" fill={sk}/>
      }

      {/* ── 8. HEAD ───────────────────────────────────────────────────────── */}
      <path d="M100 28 C154 28 157 70 153 96 C149 130 132 154 100 164 C68 154 51 130 47 96 C43 70 46 28 100 28Z" fill={sk}/>
      {/* Jaw shadow */}
      <path d="M70 148 Q85 160 100 163 Q115 160 130 148" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="3"/>

      {/* ── 9. FRONT HAIR CAP — scalp cover only, drawn after head ─────── */}
      <HairFront style={hairStyle} color={hc}/>

      {/* ── 10. FACE ──────────────────────────────────────────────────────── */}
      {fem && <>
        <ellipse cx="57"  cy="114" rx="20" ry="11" fill="rgba(255,100,100,0.08)"/>
        <ellipse cx="143" cy="114" rx="20" ry="11" fill="rgba(255,100,100,0.08)"/>
      </>}

      <Eye cx={76}  eyeColor={ec} female={fem}/>
      <Eye cx={124} eyeColor={ec} female={fem} flip/>

      {fem ? <>
        <path d="M61 75 Q77 68 92 72"  fill="none" stroke={hc} strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M108 72 Q123 68 139 75" fill="none" stroke={hc} strokeWidth="2.5" strokeLinecap="round"/>
      </> : <>
        <path d="M59 78 Q76 73 92 76"   fill="none" stroke={hc} strokeWidth="4"   strokeLinecap="round"/>
        <path d="M108 76 Q124 73 141 78" fill="none" stroke={hc} strokeWidth="4"   strokeLinecap="round"/>
      </>}

      <path d="M100 103 Q97 116 95 122" fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M93 124 Q89 128 95 130"  fill="none" stroke="rgba(0,0,0,0.11)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M107 124 Q111 128 105 130" fill="none" stroke="rgba(0,0,0,0.11)" strokeWidth="1.5" strokeLinecap="round"/>

      {fem ? (<>
        <path d="M87 140 Q93 134 100 136 Q107 134 113 140"
              fill="none" stroke="rgba(175,60,60,0.65)" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M87 140 Q100 151 113 140"
              fill="rgba(200,80,80,0.10)" stroke="rgba(175,60,60,0.50)" strokeWidth="1.5" strokeLinecap="round"/>
      </>) : (
        <path d="M89 141 Q100 148 111 141"
              fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="2" strokeLinecap="round"/>
      )}
    </svg>
  )
}

// ─── Eye ────────────────────────────────────────────────────────────────────

const Eye = ({ cx, eyeColor, female, flip = false }) => {
  const x1 = cx - 14, x2 = cx + 14, cy = 89
  const lashes = flip
    ? [[cx+12,cy-4,cx+15,cy-10],[cx+6,cy-7,cx+7,cy-13],[cx,cy-8,cx,cy-14],[cx-6,cy-7,cx-7,cy-13],[cx-12,cy-4,cx-15,cy-10]]
    : [[cx-12,cy-4,cx-15,cy-10],[cx-6,cy-7,cx-7,cy-13],[cx,cy-8,cx,cy-14],[cx+6,cy-7,cx+7,cy-13],[cx+12,cy-4,cx+15,cy-10]]
  return (
    <g>
      <path d={`M${x1} ${cy} Q${cx-8} ${cy-9} ${cx} ${cy-9} Q${cx+8} ${cy-9} ${x2} ${cy} Q${cx+8} ${cy+8} ${cx} ${cy+8} Q${cx-8} ${cy+8} ${x1} ${cy}Z`} fill="white"/>
      <circle cx={cx} cy={cy} r="8" fill={eyeColor}/>
      <circle cx={cx} cy={cy} r="8" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="0.8"/>
      <circle cx={cx} cy={cy} r="4.5" fill="#060304"/>
      <circle cx={cx+3} cy={cy-3} r="2.5" fill="white"/>
      <circle cx={cx-2} cy={cy+2} r="1.2" fill="rgba(255,255,255,0.35)"/>
      <path d={`M${x1} ${cy} Q${cx-8} ${cy-9} ${cx} ${cy-9} Q${cx+8} ${cy-9} ${x2} ${cy}`}
            fill="none" stroke="#2a1510" strokeWidth="1.6" strokeLinecap="round"/>
      <path d={`M${x1} ${cy} Q${cx} ${cy+8} ${x2} ${cy}`}
            fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="1" strokeLinecap="round"/>
      {female && lashes.map(([ax,ay,bx,by], i) => (
        <line key={i} x1={ax} y1={ay} x2={bx} y2={by} stroke="#1a0a08" strokeWidth="1.3" strokeLinecap="round"/>
      ))}
    </g>
  )
}

// ─── Outfit detail ───────────────────────────────────────────────────────────

const TopDetail = ({ style, tc, sk, fem }) => {
  const hemY = fem ? 250 : 256
  const pktY = fem ? 230 : 234
  switch (style) {
    case 'tshirt':
      return <>
        <ellipse cx="100" cy="183" rx="16" ry="7" fill={sk}/>
        <path d="M84 183 Q92 191 100 189 Q108 191 116 183"
              fill="none" stroke="rgba(0,0,0,0.09)" strokeWidth="1.5" strokeLinecap="round"/>
      </>

    case 'hoodie':
      return <>
        <path d="M80 182 L100 200 L120 182"
              fill="none" stroke="rgba(0,0,0,0.13)" strokeWidth="2.5" strokeLinecap="round"/>
        <rect x="76" y={pktY} width="48" height="30" rx="10" fill="rgba(0,0,0,0.08)"/>
        <line x1="100" y1={pktY} x2="100" y2={pktY+30} stroke="rgba(0,0,0,0.05)" strokeWidth="1"/>
        <path d="M97 194 Q95 212 92 228"  stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <path d="M103 194 Q105 212 108 228" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <path d="M100 200 L100 260" stroke="rgba(0,0,0,0.06)" strokeWidth="1" strokeLinecap="round" fill="none"/>
      </>

    case 'polo':
      return <>
        <path d="M87 175 L87 191 Q87 197 100 197 Q113 197 113 191 L113 175 Q107 181 100 180 Q93 181 87 175Z" fill={tc}/>
        <path d="M87 175 Q94 181 100 180 Q106 181 113 175"
              fill="none" stroke="rgba(0,0,0,0.14)" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="100" y1="193" x2="100" y2={hemY} stroke="rgba(0,0,0,0.08)" strokeWidth="2"/>
        {[202,216,230].map(y => <circle key={y} cx="100" cy={y} r="3" fill="rgba(0,0,0,0.14)"/>)}
      </>

    case 'jumper':
      return <>
        <path d="M87 174 L87 191 Q94 196 100 195 Q106 196 113 191 L113 174 Q107 180 100 179 Q93 180 87 174Z" fill={tc}/>
        <path d="M87 174 Q94 179 100 178 Q106 179 113 174"
              fill="none" stroke="rgba(0,0,0,0.10)" strokeWidth="1.2" strokeLinecap="round"/>
        {[0,5,10].map(i => (
          <line key={i} x1={fem?42:26} y1={hemY+i} x2={fem?158:174} y2={hemY+i}
                stroke="rgba(0,0,0,0.07)" strokeWidth="1.2"/>
        ))}
      </>

    default: return null
  }
}

// ─── Hair ────────────────────────────────────────────────────────────────────
// HairBack: drawn first — the head (skin) is drawn later and covers the face.
// HairFront: drawn after head — only covers the scalp cap (well above eyebrows).

const HairBack = ({ style, color }) => {
  switch (style) {
    case 'medium':
    case 'bob':
      return <path d="M52 66 Q36 100 38 134 Q40 160 62 175 Q80 184 100 185 Q120 184 138 175 Q160 160 162 134 Q164 100 148 66 Q130 61 100 60 Q70 61 52 66Z" fill={color}/>

    case 'long':
      return <path d="M52 66 Q34 102 34 138 Q36 166 56 180 L54 272 Q74 286 100 288 Q126 286 146 272 L144 180 Q164 166 166 138 Q166 102 148 66 Q130 61 100 60 Q70 61 52 66Z" fill={color}/>

    case 'wavy':
      return <path d="M52 66 Q34 102 34 138 Q36 166 56 180 L50 212 Q38 232 44 252 Q50 272 48 290 Q62 304 100 307 Q138 304 152 290 Q150 272 156 252 Q162 232 150 212 L144 180 Q164 166 166 138 Q166 102 148 66 Q130 61 100 60 Q70 61 52 66Z" fill={color}/>

    case 'curly':
      return <>
        <ellipse cx="26"  cy="96"  rx="30" ry="44" fill={color}/>
        <ellipse cx="174" cy="96"  rx="30" ry="44" fill={color}/>
        <ellipse cx="58"  cy="166" rx="28" ry="32" fill={color}/>
        <ellipse cx="142" cy="166" rx="28" ry="32" fill={color}/>
        <ellipse cx="100" cy="177" rx="44" ry="22" fill={color}/>
      </>

    default: return null
  }
}

const HairFront = ({ style, color }) => {
  // Cap covers scalp from head top (y=28) to hairline (y=66) — 8px above eyebrows (y=75)
  const cap = 'M100 28 C148 28 152 56 148 68 Q130 64 100 63 Q70 64 52 68 C48 56 52 28 100 28Z'

  switch (style) {
    case 'short':
    case 'pixie':
      return <path d="M100 28 C150 28 155 58 151 72 Q132 68 100 66 Q68 68 49 72 C45 58 50 28 100 28Z" fill={color}/>

    case 'medium':
    case 'bob':
    case 'long':
    case 'wavy':
      return <path d={cap} fill={color}/>

    case 'curly':
      return <>
        <ellipse cx="100" cy="42" rx="66" ry="44" fill={color}/>
        <path d={cap} fill={color}/>
      </>

    case 'bun':
      return <>
        <path d={cap} fill={color}/>
        <circle cx="100" cy="9"  r="26" fill={color}/>
        <circle cx="100" cy="12" r="15" fill="rgba(0,0,0,0.09)"/>
        <path d="M78 10 Q100 20 122 10" fill="none" stroke="rgba(0,0,0,0.10)" strokeWidth="1.5" strokeLinecap="round"/>
      </>

    case 'buzz':
      return <path d="M100 28 C146 28 148 50 145 60 Q128 57 100 56 Q72 57 55 60 C52 50 54 28 100 28Z" fill={color} opacity="0.9"/>

    case 'crop':
      return <>
        <path d="M100 28 C148 28 151 54 147 66 Q130 62 100 61 Q70 62 53 66 C49 54 52 28 100 28Z" fill={color}/>
        <path d="M68 66 Q78 70 88 67" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"/>
        <path d="M88 67 Q100 71 112 67" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"/>
        <path d="M112 67 Q122 70 132 66" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"/>
      </>

    case 'quiff':
      return <>
        <path d="M100 28 C150 28 154 57 150 70 Q132 66 100 65 Q68 66 50 70 C46 57 50 28 100 28Z" fill={color}/>
        <path d="M78 66 Q88 54 100 50 Q112 54 122 66" fill={color}/>
        <path d="M82 64 Q92 50 100 47 Q108 50 118 64" fill={color}/>
      </>

    case 'undercut':
      return <>
        <path d="M100 28 C148 28 152 56 148 68 Q130 64 100 63 Q70 64 52 68 C48 56 52 28 100 28Z" fill={color}/>
        <path d="M76 30 Q72 46 70 66" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2" strokeLinecap="round"/>
        <path d="M80 50 Q86 48 94 50" fill="none" stroke="rgba(0,0,0,0.09)" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M80 57 Q86 55 94 57" fill="none" stroke="rgba(0,0,0,0.09)" strokeWidth="1.2" strokeLinecap="round"/>
      </>

    default: return null
  }
}
