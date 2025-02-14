import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ThemeProvider } from './components/theme-provider.tsx'
import AuthProvider from './contexts/authContextProvider.tsx'
import JovialRouter from './router.tsx'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider storageKey="vite-ui-theme">
    <AuthProvider>
      <JovialRouter />
    </AuthProvider>
    </ThemeProvider>
  </StrictMode>
)
