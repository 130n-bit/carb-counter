// CommonJS — avoids ESM compatibility issues with Vercel's function runtime
// Uses Node's built-in https module — no external dependencies required
const https = require('https')

const PROMPT = `You are reading a UK or international food nutrition label.

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
- serving_size_g: grams per serving (e.g. "Per 30g" → 30).
- product_name only if clearly visible; otherwise null.
- Values are plain numbers only — no units.`

function readBody(req) {
  return new Promise((resolve, reject) => {
    if (req.body && typeof req.body === 'object') return resolve(req.body)
    let raw = ''
    req.on('data', chunk => { raw += chunk.toString() })
    req.on('end', () => {
      try { resolve(JSON.parse(raw)) }
      catch (e) { reject(new Error('Invalid JSON body')) }
    })
    req.on('error', reject)
  })
}

function httpsPost(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let data = ''
      res.on('data', chunk => { data += chunk })
      res.on('end', () => resolve({ status: res.statusCode, body: data }))
    })
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') { res.status(200).end(); return }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) { res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured on server' }); return }

  let body
  try {
    body = await readBody(req)
  } catch (err) {
    res.status(400).json({ error: 'Could not parse request body: ' + err.message })
    return
  }

  const { imageData, mediaType } = body || {}
  if (!imageData) { res.status(400).json({ error: 'Missing imageData' }); return }
  if (!mediaType)  { res.status(400).json({ error: 'Missing mediaType'  }); return }

  const payload = JSON.stringify({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    messages: [{
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: mediaType, data: imageData } },
        { type: 'text', text: PROMPT },
      ],
    }],
  })

  let result
  try {
    result = await httpsPost({
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
    }, payload)
  } catch (err) {
    res.status(502).json({ error: 'Network error reaching Anthropic: ' + err.message })
    return
  }

  if (result.status !== 200) {
    res.status(502).json({ error: 'Anthropic API returned ' + result.status, detail: result.body.slice(0, 300) })
    return
  }

  let parsed
  try { parsed = JSON.parse(result.body) }
  catch { res.status(502).json({ error: 'Unexpected response from Anthropic API' }); return }

  const text = parsed.content?.[0]?.text || ''
  res.status(200).json({ text })
}
