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

// ─── Main component ──────────────────────────────────────────────────────────
// Layout (viewBox 0 0 200 330):
//   Head:   y 26–164  (138px)
//   Neck:   y 162–184 (22px)
//   Torso:  y 184–256 (72px)
//   Legs:   y 254–320 (66px)
//   Shoes:  y ~322

export const AvatarSvg = ({ avatar = {}, width = 100, bust = false }) => {
  const cfg = { ...AVATAR_DEFAULTS, ...avatar }
  const { gender, skinTone: sk, eyeColor: ec, hairStyle, hairColor: hc,
          topStyle, topColor: tc, bottomColor: bc } = cfg
  const fem  = gender !== 'male'
  const shoe = '#1c1a14'
  const vb   = bust ? '0 0 200 235' : '0 0 200 330'
  const ht   = bust ? Math.round(width * 235/200) : Math.round(width * 330/200)

  return (
    <svg viewBox={vb} width={width} height={ht} style={{ display:'block' }} aria-hidden="true">

      {/* ── BACK HAIR — drawn first so head covers the face portion ── */}
      <HairBack style={hairStyle} color={hc}/>

      {/* ── SHOES & LEGS ─────────────────────────────── */}
      {!bust && <>
        <ellipse cx={fem?74:72}  cy="322" rx="23" ry="8" fill={shoe}/>
        <ellipse cx={fem?126:128} cy="322" rx="23" ry="8" fill={shoe}/>
        {fem ? <>
          <path d="M68 256 Q65 290 65 316 Q65 324 76 324 Q88 324 88 316 L88 256Z" fill={bc}/>
          <path d="M132 256 Q135 290 135 316 Q135 324 124 324 Q112 324 112 316 L112 256Z" fill={bc}/>
        </> : <>
          <path d="M60 258 Q56 292 56 316 Q56 324 72 324 Q88 324 88 316 L88 258Z" fill={bc}/>
          <path d="M140 258 Q144 292 144 316 Q144 324 128 324 Q112 324 112 316 L112 258Z" fill={bc}/>
        </>}
        {/* Waistband */}
        <rect x={fem?38:24} y="252" width={fem?124:152} height="8" rx="2" fill={bc}/>
        <line x1={fem?38:24} y1="259" x2={fem?162:176} y2="259" stroke="rgba(0,0,0,0.13)" strokeWidth="1"/>
      </>}

      {/* ── ARMS ──────────────────────────────────────── */}
      {fem ? <>
        <path d="M34 218 Q18 246 16 272 Q14 292 24 298 Q35 303 40 287 L44 262 Q48 238 44 214Z" fill={tc}/>
        <path d="M166 218 Q182 246 184 272 Q186 292 176 298 Q165 303 160 287 L156 262 Q152 238 156 214Z" fill={tc}/>
      </> : <>
        <path d="M22 212 Q4 242 2 270 Q0 292 12 298 Q24 304 30 286 L36 260 Q40 232 38 208Z" fill={tc}/>
        <path d="M178 212 Q196 242 198 270 Q200 292 188 298 Q176 304 170 286 L164 260 Q160 232 162 208Z" fill={tc}/>
      </>}

      {/* Hands */}
      <ellipse cx={fem?20:12}   cy="295" rx="13" ry="11" fill={sk}/>
      <ellipse cx={fem?180:188} cy="295" rx="13" ry="11" fill={sk}/>

      {/* ── TORSO ─────────────────────────────────────── */}
      {fem ? (
        // Hourglass: wide shoulders, nipped waist, gentle hip flare
        <path d="M84 184 L44 197 Q18 214 20 244 Q22 262 42 270 Q62 278 82 279 L118 279 Q138 278 158 270 Q178 262 180 244 Q182 214 156 197 L116 184 Q108 189 100 187 Q92 189 84 184Z" fill={tc}/>
      ) : (
        // Broad shoulders, straighter silhouette, wider at chest
        <path d="M84 184 L28 196 Q2 212 2 242 Q2 262 24 272 Q48 281 74 283 L126 283 Q152 281 176 272 Q198 262 198 242 Q198 212 172 196 L116 184 Q108 189 100 187 Q92 189 84 184Z" fill={tc}/>
      )}

      {/* ── OUTFIT DETAILS ────────────────────────────── */}
      <TopDetail style={topStyle} tc={tc} sk={sk} fem={fem}/>

      {/* ── EARS ──────────────────────────────────────── */}
      <ellipse cx="47"  cy="98" rx="12" ry="17" fill={sk}/>
      <ellipse cx="153" cy="98" rx="12" ry="17" fill={sk}/>
      <ellipse cx="47"  cy="98" rx="6"  ry="10" fill="rgba(0,0,0,0.06)"/>
      <ellipse cx="153" cy="98" rx="6"  ry="10" fill="rgba(0,0,0,0.06)"/>

      {/* ── NECK ──────────────────────────────────────── */}
      {fem
        ? <path d="M88 162 Q84 174 84 184 L116 184 Q116 174 112 162 Q106 167 100 166 Q94 167 88 162Z" fill={sk}/>
        : <path d="M86 162 Q80 172 80 184 L120 184 Q120 172 114 162 Q107 167 100 166 Q93 167 86 162Z" fill={sk}/>
      }

      {/* ── HEAD ──────────────────────────────────────── */}
      <path d="M100 26 C154 26 157 70 153 96 C149 130 132 154 100 164 C68 154 51 130 47 96 C43 70 46 26 100 26Z" fill={sk}/>
      {/* Jaw shadow */}
      <path d="M70 148 Q85 160 100 163 Q115 160 130 148" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="3"/>

      {/* ── FRONT HAIR CAP — on top of scalp, face remains visible ── */}
      <HairFront style={hairStyle} color={hc}/>

      {/* ── FACE FEATURES ─────────────────────────────── */}
      {fem && <>
        <ellipse cx="57"  cy="114" rx="20" ry="11" fill="rgba(255,100,100,0.08)"/>
        <ellipse cx="143" cy="114" rx="20" ry="11" fill="rgba(255,100,100,0.08)"/>
      </>}

      <Eye cx={76}  eyeColor={ec} female={fem}/>
      <Eye cx={124} eyeColor={ec} female={fem} flip/>

      {/* Eyebrows */}
      {fem ? <>
        <path d="M61 74 Q77 67 92 71"  fill="none" stroke={hc} strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M108 71 Q123 67 139 74" fill="none" stroke={hc} strokeWidth="2.5" strokeLinecap="round"/>
      </> : <>
        <path d="M59 77 Q76 72 92 75"   fill="none" stroke={hc} strokeWidth="4"   strokeLinecap="round"/>
        <path d="M108 75 Q124 72 141 77" fill="none" stroke={hc} strokeWidth="4"   strokeLinecap="round"/>
      </>}

      {/* Nose */}
      <path d="M100 102 Q97 116 95 122" fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M93 124 Q89 128 95 130"  fill="none" stroke="rgba(0,0,0,0.11)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M107 124 Q111 128 105 130" fill="none" stroke="rgba(0,0,0,0.11)" strokeWidth="1.5" strokeLinecap="round"/>

      {/* Lips */}
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
  const x1 = cx - 14, x2 = cx + 14, cy = 88
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

// ─── Outfit details ──────────────────────────────────────────────────────────

const TopDetail = ({ style, tc, sk, fem }) => {
  const hemY  = fem ? 271 : 275
  const pktY  = fem ? 235 : 238
  switch (style) {
    case 'tshirt':
      return <>
        {/* Round neck opening */}
        <ellipse cx="100" cy="185" rx="16" ry="7" fill={sk}/>
        <path d="M84 185 Q92 193 100 191 Q108 193 116 185"
              fill="none" stroke="rgba(0,0,0,0.10)" strokeWidth="1.5" strokeLinecap="round"/>
      </>

    case 'hoodie':
      return <>
        {/* Hood seam */}
        <path d="M80 184 L100 202 L120 184"
              fill="none" stroke="rgba(0,0,0,0.13)" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Kangaroo pocket */}
        <rect x="76" y={pktY} width="48" height="32" rx="10" fill="rgba(0,0,0,0.08)"/>
        <line x1="100" y1={pktY} x2="100" y2={pktY+32} stroke="rgba(0,0,0,0.06)" strokeWidth="1"/>
        {/* Drawstrings */}
        <path d="M96 196 Q94 212 91 228" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <path d="M104 196 Q106 212 109 228" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        {/* Zip line */}
        <path d="M100 202 L100 268" stroke="rgba(0,0,0,0.07)" strokeWidth="1" strokeLinecap="round" fill="none"/>
      </>

    case 'polo':
      return <>
        {/* Standing collar */}
        <path d="M87 177 L87 191 Q87 197 100 197 Q113 197 113 191 L113 177 Q107 183 100 182 Q93 183 87 177Z" fill={tc}/>
        <path d="M87 177 Q93 183 100 182 Q107 183 113 177"
              fill="none" stroke="rgba(0,0,0,0.14)" strokeWidth="1.5" strokeLinecap="round"/>
        {/* Placket + buttons */}
        <line x1="100" y1="193" x2="100" y2={hemY} stroke="rgba(0,0,0,0.08)" strokeWidth="2"/>
        {[202, 216, 230].map(y => <circle key={y} cx="100" cy={y} r="3" fill="rgba(0,0,0,0.14)"/>)}
      </>

    case 'jumper':
      return <>
        {/* High round neck — taller collar than tshirt */}
        <path d="M87 176 L87 192 Q94 197 100 196 Q106 197 113 192 L113 176 Q107 182 100 181 Q93 182 87 176Z" fill={tc}/>
        <path d="M87 176 Q94 181 100 180 Q106 181 113 176"
              fill="none" stroke="rgba(0,0,0,0.10)" strokeWidth="1.2" strokeLinecap="round"/>
        {/* Ribbed hem */}
        {[0,5,10].map(i => (
          <line key={i} x1={fem?42:26} y1={hemY-8+i} x2={fem?158:174} y2={hemY-8+i}
                stroke="rgba(0,0,0,0.07)" strokeWidth="1.2"/>
        ))}
        {/* Ribbed cuff suggestion on arms */}
        <path d={fem ? 'M14 278 Q18 280 22 278' : 'M4 278 Q8 280 12 278'}
              fill="none" stroke="rgba(0,0,0,0.10)" strokeWidth="2" strokeLinecap="round"/>
        <path d={fem ? 'M178 278 Q182 280 186 278' : 'M188 278 Q192 280 196 278'}
              fill="none" stroke="rgba(0,0,0,0.10)" strokeWidth="2" strokeLinecap="round"/>
      </>

    default: return null
  }
}

// ─── Hair ────────────────────────────────────────────────────────────────────
// HairBack: drawn before the head — head (skin) covers the face portion naturally
// HairFront: drawn after head — small cap covering the scalp only

const HairBack = ({ style, color }) => {
  switch (style) {
    // Female styles with hanging back hair
    case 'medium':
    case 'bob':
      // Wraps around sides/back to jaw level; head overlaps and covers the face center
      return <path d="M52 68 Q36 100 38 134 Q40 160 62 174 Q80 182 100 183 Q120 182 138 174 Q160 160 162 134 Q164 100 148 68 Q130 63 100 62 Q70 63 52 68Z" fill={color}/>

    case 'long':
      return <path d="M52 68 Q36 100 36 136 Q38 164 58 178 L56 270 Q76 284 100 286 Q124 284 144 270 L142 178 Q162 164 164 136 Q164 100 148 68 Q130 63 100 62 Q70 63 52 68Z" fill={color}/>

    case 'wavy':
      return <path d="M52 68 Q36 100 36 136 Q38 164 58 178 L52 208 Q40 228 46 248 Q52 268 50 286 Q64 300 100 303 Q136 300 150 286 Q148 268 154 248 Q160 228 148 208 L142 178 Q162 164 164 136 Q164 100 148 68 Q130 63 100 62 Q70 63 52 68Z" fill={color}/>

    case 'curly':
      // Side puffs and lower puff — head will cover the face center
      return <>
        <ellipse cx="26"  cy="96"  rx="30" ry="42" fill={color}/>
        <ellipse cx="174" cy="96"  rx="30" ry="42" fill={color}/>
        <ellipse cx="60"  cy="164" rx="26" ry="32" fill={color}/>
        <ellipse cx="140" cy="164" rx="26" ry="32" fill={color}/>
        <ellipse cx="100" cy="175" rx="42" ry="22" fill={color}/>
      </>

    // Male and short female styles have no significant back hair
    default: return null
  }
}

const HairFront = ({ style, color }) => {
  // Base cap: covers scalp from top (y=26) to hairline (y=66) — well above eyebrows (y=74)
  const cap = 'M100 26 C148 26 152 56 148 68 Q130 64 100 63 Q70 64 52 68 C48 56 52 26 100 26Z'

  switch (style) {
    case 'short':
    case 'pixie':
      // Slightly lower at sides for pixie fringe
      return <path d="M100 26 C150 26 154 58 150 72 Q132 68 100 66 Q68 68 50 72 C46 58 50 26 100 26Z" fill={color}/>

    case 'medium':
    case 'bob':
    case 'long':
    case 'wavy':
      return <path d={cap} fill={color}/>

    case 'curly':
      // Big top puff + cap
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

    // ── Male styles ──────────────────────────────────────────
    case 'buzz':
      // Very close crop — thin dark cap
      return <path d="M100 26 C146 26 149 50 145 60 Q128 57 100 56 Q72 57 55 60 C51 50 54 26 100 26Z" fill={color} opacity="0.9"/>

    case 'crop':
      // Short with a textured fringe
      return <>
        <path d="M100 26 C148 26 151 54 147 66 Q130 62 100 61 Q70 62 53 66 C49 54 52 26 100 26Z" fill={color}/>
        {/* Fringe texture strokes */}
        <path d="M68 66 Q78 70 88 67" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round"/>
        <path d="M88 67 Q100 71 112 67" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round"/>
        <path d="M112 67 Q122 70 132 66" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round"/>
      </>

    case 'quiff':
      // Cap + swept-up front volume
      return <>
        <path d="M100 26 C150 26 154 57 150 70 Q132 66 100 65 Q68 66 50 70 C46 57 50 26 100 26Z" fill={color}/>
        {/* Quiff rise — swept up from forehead */}
        <path d="M78 66 Q88 54 100 50 Q112 54 122 66" fill={color}/>
        <path d="M82 64 Q92 50 100 47 Q108 50 118 64" fill={color}/>
      </>

    case 'undercut':
      // Cap with side-part line for that clean undercut look
      return <>
        <path d="M100 26 C148 26 152 56 148 68 Q130 64 100 63 Q70 64 52 68 C48 56 52 26 100 26Z" fill={color}/>
        {/* Side part — left of center */}
        <path d="M78 30 Q74 46 72 66" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2" strokeLinecap="round"/>
        {/* Slight texture lines */}
        <path d="M80 50 Q86 48 94 50" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M80 57 Q86 55 94 57" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1.2" strokeLinecap="round"/>
      </>

    default: return null
  }
}
