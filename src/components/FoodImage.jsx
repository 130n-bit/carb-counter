import { useState } from 'react'

export const FoodImage = ({ image, glyph, size = 40, radius = 12 }) => {
  const [failed, setFailed] = useState(false)
  const showImage = image && !failed
  return (
    <div className={`c-food-img ${showImage ? 'has-image' : ''}`}
         style={{ width: size, height: size, borderRadius: radius }}>
      {showImage && (
        <img src={image} alt="" loading="lazy" onError={() => setFailed(true)}/>
      )}
      {!showImage && (
        <span className="c-food-img-glyph">{glyph}</span>
      )}
    </div>
  )
}
