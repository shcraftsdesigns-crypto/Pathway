import { setAIProvider } from '@/lib/ai/provider'
import { httpAIProvider } from '@/lib/ai/httpProvider'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { localBibleProvider } from '@/lib/localBibleProvider'
import { setBibleProvider } from '@/lib/bibleService'
import { AuthProvider } from '@/contexts/AuthContext'

setBibleProvider(localBibleProvider)
setAIProvider(httpAIProvider)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
