import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import '@fontsource/ibm-plex-sans/400.css'
import '@fontsource/ibm-plex-sans/500.css'
import '@fontsource/ibm-plex-sans/600.css'
import '@kdb-dashboard-library/finance-ui/theme.css'

import { KdbProvider } from '@kdb-dashboard-library/react-client'

import './index.css'
import App from './App.tsx'

const websocketUrl =
  import.meta.env.VITE_KDB_WS_URL?.trim() || 'ws://localhost:5050'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <KdbProvider autoReconnect reconnectDelayMs={1500} url={websocketUrl}>
      <App />
    </KdbProvider>
  </StrictMode>,
)
