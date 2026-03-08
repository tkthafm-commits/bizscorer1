import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import BizScorer from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BizScorer />
  </StrictMode>,
)
