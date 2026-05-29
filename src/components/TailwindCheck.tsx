import { useEffect, useState } from 'react'

export default function TailwindCheck() {
  const [ok, setOk] = useState<boolean | null>(null)
  const [fallbackLoaded, setFallbackLoaded] = useState(false)

  useEffect(() => {
    const el = document.createElement('div')
    el.className = 'hidden'
    el.style.position = 'absolute'
    el.style.left = '-9999px'
    document.body.appendChild(el)
    const comp = getComputedStyle(el)
    const isHidden = comp.display === 'none'
    setOk(isHidden)
    document.body.removeChild(el)

    if (!isHidden) {
      // Tailwind not applied; load CDN fallback once
      if (!fallbackLoaded) {
        const s = document.createElement('script')
        s.src = 'https://cdn.tailwindcss.com'
        s.async = true
        s.onload = () => {
          // Re-check after short delay
          setTimeout(() => {
            const el2 = document.createElement('div')
            el2.className = 'hidden'
            el2.style.position = 'absolute'
            el2.style.left = '-9999px'
            document.body.appendChild(el2)
            const comp2 = getComputedStyle(el2)
            const isHidden2 = comp2.display === 'none'
            setOk(isHidden2)
            document.body.removeChild(el2)
            setFallbackLoaded(true)
          }, 200)
        }
        s.onerror = () => setFallbackLoaded(true)
        document.head.appendChild(s)
      }
    }
  }, [fallbackLoaded])

  if (ok === null) return null
  return (
    <div aria-live="polite" className={`p-2 text-sm ${ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}> 
      Tailwind status: {ok ? 'Loaded' : 'NOT loaded - fallback attempted'}
    </div>
  )
}
