import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './components/theme-provider.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// import { Toaster } from './components/ui/sonner.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/*",
        element: <p>Path not found</p>
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider storageKey="vite-ui-theme">
        <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
)
