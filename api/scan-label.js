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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set on server' })

  const { imageData, mediaType } = req.body || {}
  if (!imageData || !mediaType) return res.status(400).json({ error: 'Missing imageData or mediaType' })

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: imageData } },
          { type: 'text', text: PROMPT },
        ],
      }],
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    return res.status(502).json({ error: 'Claude API error', detail: body })
  }

  const data = await response.json()
  const text = data.content?.[0]?.text || ''
  return res.status(200).json({ text })
}
