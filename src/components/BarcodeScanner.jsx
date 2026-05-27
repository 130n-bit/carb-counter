import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icons.jsx'
import { offProductToFood } from '../hooks/useFoodSearch.js'

async function lookupBarcode(barcode) {
  const fields = 'product_name,brands,nutriments,serving_size,code,countries_tags,'
               + 'image_front_small_url,image_front_thumb_url,image_small_url,image_thumb_url'
  const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json?fields=${fields}`)
  if (!res.ok) throw new Error('network')
  const json = await res.json()
  if (json.status !== 1 || !json.product) return null
  return offProductToFood(json.product)
}

export const BarcodeScanner = ({ onFound, onClose }) => {
  const videoRef    = useRef(null)
  const streamRef   = useRef(null)
  const rafRef      = useRef(null)
  const detectorRef = useRef(null)
  const activeRef   = useRef(false)

  const [phase, setPhase]   = useState('starting') // starting|scanning|looking|notfound|error|unsupported
  const [errMsg, setErrMsg] = useState('')

  const stopStream = () => {
    activeRef.current = false
    if (rafRef.current)   { cancelAnimationFrame(rafRef.current); rafRef.current = null }
    if (streamRef.current){ streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null }
  }

  const startLoop = () => {
    activeRef.current = true
    setPhase('scanning')

    const tick = async () => {
      if (!activeRef.current) return
      const v = videoRef.current
      if (v && v.readyState >= 2 && v.videoWidth > 0) {
        try {
          const codes = await detectorRef.current.detect(v)
          if (codes.length > 0 && activeRef.current) {
            activeRef.current = false
            setPhase('looking')
            try {
              const food = await lookupBarcode(codes[0].rawValue)
              if (food) {
                stopStream()
                onFound(food)
              } else {
                setPhase('notfound')
              }
            } catch {
              setPhase('error')
              setErrMsg("Couldn't reach the food database. Check your connection.")
            }
            return
          }
        } catch { /* detection hiccup — keep going */ }
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
  }

  const retry = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    startLoop()
  }

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      if (!('BarcodeDetector' in window)) {
        setPhase('unsupported'); return
      }

      let formats = ['ean_13','ean_8','upc_a','upc_e','code_128','code_39','qr_code']
      try {
        const supported = await BarcodeDetector.getSupportedFormats()
        const filtered  = formats.filter(f => supported.includes(f))
        if (filtered.length) formats = filtered
      } catch { /* use default list */ }

      detectorRef.current = new BarcodeDetector({ formats })

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        })
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return }

        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play().catch(() => {})
        }
        startLoop()
      } catch (err) {
        if (cancelled) return
        setErrMsg(
          err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
            ? 'Camera access was denied. Please allow camera permission and try again.'
            : 'Could not start the camera. ' + (err.message || '')
        )
        setPhase('error')
      }
    })()

    return () => { cancelled = true; stopStream() }
  }, [])

  const close = () => { stopStream(); onClose() }

  return (
    <div className="c-scanner">
      <div className="c-scanner-head">
        <button className="c-back-btn c-back-btn--light" onClick={close}>
          <Icon name="arrowL" size={18}/>
        </button>
        <div className="c-scanner-title">Scan <em>barcode</em></div>
        <div style={{ width: 40 }}/>
      </div>

      <div className="c-scanner-body">
        <video ref={videoRef} className="c-scanner-video" playsInline muted/>

        {phase === 'scanning' && (
          <div className="c-scanner-vf">
            <div className="c-scanner-vf-box">
              <div className="c-scanner-vf-line"/>
            </div>
            <div className="c-scanner-hint">Point the camera at a barcode</div>
          </div>
        )}

        {phase === 'looking' && (
          <div className="c-scanner-overlay">
            <div className="c-scanner-spinner"/>
            <div className="c-scanner-status">Looking up product…</div>
          </div>
        )}

        {phase === 'notfound' && (
          <div className="c-scanner-overlay">
            <div className="c-scanner-status c-scanner-status--warn">Product not found</div>
            <div className="c-scanner-sub">This item may not be in the database yet. Try searching by name instead.</div>
            <button className="c-scanner-btn" onClick={retry}>Scan again</button>
          </div>
        )}

        {phase === 'error' && (
          <div className="c-scanner-overlay">
            <div className="c-scanner-status c-scanner-status--err">{errMsg}</div>
            <button className="c-scanner-btn" onClick={retry}>Try again</button>
          </div>
        )}

        {(phase === 'starting' || phase === 'unsupported') && (
          <div className="c-scanner-overlay c-scanner-overlay--solid">
            {phase === 'starting' ? <>
              <div className="c-scanner-spinner"/>
              <div className="c-scanner-status">Starting camera…</div>
            </> : <>
              <div className="c-scanner-status">Barcode scanning isn't supported on this browser.</div>
              <div className="c-scanner-sub">Update to the latest Safari or Chrome and try again.</div>
            </>}
          </div>
        )}
      </div>
    </div>
  )
}
