import './App.css'
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar'
import { JovialSidebar, ModeToggle } from "./components/index"
import { useEffect, useRef } from 'react'
import { JovialPostForm } from './components/JovialPostForm'
import JovialSearchBox from './components/JovialSearchBox'
import { Toaster } from './components/ui/sonner'
import JovialSignIn from './components/JovialSignIn'
import JovialRegister from './components/JovialRegister'
import JovialEditUser from './components/JovialEditUser'
import ComponentProvider from './contexts/componentContextProvider'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import useAuthContext from './contexts/authContext'
import useGoogleAuth from './hooks/useGoogleAuth'
import { Outlet, useLocation } from 'react-router-dom'

function App() {

  const { loadValues } = useAuthContext();

  const initialLoad = useRef(false);
  useEffect(() => {
    if (!initialLoad.current) {
      initialLoad.current = true;
      
      // 1. Checks if GoogleAuth credentials are there
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      if (code) {
        useGoogleAuth(code);
      }
      
      // 2. Loads current user if exists
      loadValues();
    }
  })

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <div className='text-center'>
        <Alert>
          <AlertTitle className='underline'>Note</AlertTitle>
          <AlertDescription>
            This app is under development
          </AlertDescription>
        </Alert>
      </div>

      <ComponentProvider>

        <div className='absolute top-2 right-4'> <ModeToggle /> </div>

        <JovialPostForm />
        <JovialSearchBox />
        <JovialSignIn />
        <JovialRegister />
        <JovialEditUser />

        <SidebarProvider>
          <JovialSidebar />
          <SidebarTrigger />

          <Outlet />

        </SidebarProvider>
      </ComponentProvider>
      <Toaster />
    </>
  )
}

export default App
