import { useState, useEffect } from 'react'

const parseServingGrams = (s) => {
  if (!s) return null
  const str = String(s)
  const inParens = str.match(/\(\s*(\d+(?:\.\d+)?)\s*g\b/i)
  if (inParens) return Math.round(parseFloat(inParens[1]))
  const grams = str.match(/(\d+(?:\.\d+)?)\s*g\b/i)
  if (grams) return Math.round(parseFloat(grams[1]))
  const leading = str.match(/^(\d+(?:\.\d+)?)/)
  if (leading) return Math.round(parseFloat(leading[1]))
  return null
}

const tidyName = (s) => {
  if (!s) return ''
  const t = s.trim().replace(/\s+/g, ' ')
  const letters = t.replace(/[^A-Za-z]/g, '')
  const upRatio = letters ? (letters.match(/[A-Z]/g) || []).length / letters.length : 0
  if (upRatio > 0.7 && letters.length > 4) {
    return t.toLowerCase().replace(/(^|\s)\S/g, c => c.toUpperCase())
  }
  return t
}

export const offProductToFood = (p) => {
  const carbs100 = Number(p?.nutriments?.carbohydrates_100g)
  if (!Number.isFinite(carbs100)) return null
  const name = tidyName(p.product_name)
  if (!name) return null

  const brand = tidyName((p.brands || '').split(',')[0])
  const servingG = parseServingGrams(p.serving_size)
  const countries = Array.isArray(p.countries_tags) ? p.countries_tags : []
  const isUK = countries.includes('en:united-kingdom')
  const image = p.image_front_small_url || p.image_front_thumb_url
             || p.image_small_url || p.image_thumb_url || null

  const units = []
  const unitVals = []
  if (servingG && servingG > 0 && servingG < 2000) {
    units.push(`serving (${servingG} g)`)
    unitVals.push(Math.round(carbs100 * servingG / 100 * 10) / 10)
  }
  units.push('100 g')
  unitVals.push(Math.round(carbs100 * 10) / 10)
  units.push('50 g')
  unitVals.push(Math.round(carbs100 * 0.5 * 10) / 10)

  return {
    id: 'off-' + (p.code || name),
    name,
    sub: brand ? brand : 'OpenFoodFacts',
    glyph: name[0].toLowerCase(),
    image,
    base: Math.round(unitVals[0]),
    units,
    unitVals,
    defaultUnit: 0,
    isUK,
    source: 'off',
  }
}

export const useFoodSearch = (query) => {
  const [state, setState] = useState({ status: 'idle', results: [], error: null })

  useEffect(() => {
    const q = query.trim()
    if (!q) { setState({ status: 'idle', results: [], error: null }); return }

    setState(s => ({ ...s, status: 'loading' }))
    const ctrl = new AbortController()

    const buildUrl = (includeUKFilter) => {
      let u = 'https://world.openfoodfacts.org/cgi/search.pl'
            + '?search_terms=' + encodeURIComponent(q)
            + '&search_simple=1&action=process&json=1&page_size=30'
            + '&fields=product_name,brands,nutriments,serving_size,code,quantity,countries_tags,image_front_small_url,image_front_thumb_url,image_small_url,image_thumb_url'
      if (includeUKFilter) {
        u += '&tagtype_0=countries&tag_contains_0=contains&tag_0=' + encodeURIComponent('United Kingdom')
      }
      return u
    }

    const fetchAndMap = async (url) => {
      const res = await fetch(url, { signal: ctrl.signal })
      if (!res.ok) throw new Error('Bad response ' + res.status)
      const json = await res.json()
      return (json.products || [])
        .map(offProductToFood)
        .filter(Boolean)
        .filter((f, i, arr) => arr.findIndex(g => g.name === f.name && g.sub === f.sub) === i)
        .slice(0, 24)
    }

    const timer = setTimeout(async () => {
      let products = []
      try {
        products = await fetchAndMap(buildUrl(true))
      } catch (err) {
        if (err.name === 'AbortError') return
      }
      if (products.length === 0) {
        try {
          products = await fetchAndMap(buildUrl(false))
        } catch (err) {
          if (err.name === 'AbortError') return
          setState({ status: 'error', results: [], error: err.message })
          return
        }
      }
      setState({ status: 'ok', results: products, error: null })
    }, 340)

    return () => { clearTimeout(timer); ctrl.abort() }
  }, [query])

  return state
}
