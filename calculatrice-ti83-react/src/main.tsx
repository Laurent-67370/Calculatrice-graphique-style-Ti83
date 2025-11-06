import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { registerSW } from 'virtual:pwa-register'

// Enregistrement du Service Worker pour la PWA
const updateSW = registerSW({
  onNeedRefresh() {
    // Une nouvelle version est disponible
    if (confirm('Une nouvelle version de la calculatrice est disponible. Voulez-vous recharger ?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('✅ Application prête à fonctionner hors ligne')
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
