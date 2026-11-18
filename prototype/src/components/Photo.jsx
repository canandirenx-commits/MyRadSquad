import { useState } from 'react'

// A photo that falls back to a gray gradient if the file is missing.
export default function Photo({ src, alt = '', className = '' }) {
  const [failed, setFailed] = useState(false)
  if (failed || !src) {
    return <div className={`bg-gradient-to-br from-neutral-700 to-neutral-900 ${className}`} />
  }
  return <img src={src} alt={alt} onError={() => setFailed(true)} className={`object-cover ${className}`} />
}
