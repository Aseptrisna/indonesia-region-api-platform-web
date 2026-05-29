import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import inlineCssFallback from './utils/inlineCss'
import './index.css'
import App from './App.tsx'

// Attempt to inline CSS if stylesheet isn't applied (helps environments where link styles fail)
inlineCssFallback().catch(() => {})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
