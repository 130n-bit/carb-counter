import { useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader } from '@zxing/browser'
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
  const controlsRef = useRef(null)
  const handledRef  = useRef(false)

  const [phase, setPhase]   = useState('starting') // starting|scanning|looking|notfound|error
  const [errMsg, setErrMsg] = useState('')

  const stopScanning = () => {
    try { controlsRef.current?.stop() } catch {}
    controlsRef.current = null
  }

  const startScanning = async () => {
    handledRef.current = false
    setPhase('scanning')

    const reader = new BrowserMultiFormatReader()
    try {
      const controls = await reader.decodeFromConstraints(
        { video: { facingMode: 'environment' } },
        videoRef.current,
        async (result, err) => {
          if (!result || handledRef.current) return
          handledRef.current = true
          stopScanning()
          setPhase('looking')
          try {
            const food = await lookupBarcode(result.getText())
            if (food) {
              onFound(food)
            } else {
              setPhase('notfound')
            }
          } catch {
            setErrMsg("Couldn't reach the food database. Check your connection.")
            setPhase('error')
          }
        }
      )
      controlsRef.current = controls
    } catch (err) {
      setErrMsg(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Camera access was denied. Please allow camera permission in your browser settings and try again.'
          : 'Could not start the camera. ' + (err.message || '')
      )
      setPhase('error')
    }
  }

  useEffect(() => {
    startScanning()
    return () => stopScanning()
  }, [])

  const retry = () => {
    setPhase('starting')
    startScanning()
  }

  const close = () => { stopScanning(); onClose() }

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

        {phase === 'starting' && (
          <div className="c-scanner-overlay c-scanner-overlay--solid">
            <div className="c-scanner-spinner"/>
            <div className="c-scanner-status">Starting camera…</div>
          </div>
        )}
      </div>
    </div>
  )
}
