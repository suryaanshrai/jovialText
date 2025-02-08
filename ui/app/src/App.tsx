import './App.css'
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar'
import {JovialSidebar, ModeToggle} from "./components/index"
import  { useEffect, useRef, useState } from 'react'
import { JovialPostForm } from './components/JovialPostForm'
import JovialSearchBox from './components/JovialSearchBox'
import { Toaster } from './components/ui/sonner'
import JovialPost from './components/JovialPost'
import {JovialPostProps} from './components/JovialPost'
import conf from './conf/conf'
import JovialSignIn from './components/JovialSignIn'
import JovialRegister from './components/JovialRegister'
import JovialEditUser from './components/JovialEditUser'
import ComponentProvider from './contexts/componentContextProvider'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import useAuthContext from './contexts/authContext'
import useGoogleAuth from './hooks/useGoogleAuth'

function App() {

  const [posts, setPosts] = useState<JovialPostProps[]>([])

  const hasFetchedPosts = useRef(false);
  useEffect(() => {
    if(!hasFetchedPosts.current) {
      fetch(`${conf.api_url}post/`).then(response => response.json()).then(data => {
        setPosts(data)
      })
      hasFetchedPosts.current = true;
    }
  }, [])

  const {loadValues} = useAuthContext();
  const hasLoadedValues = useRef(false);
  useEffect(() => {
    if (!hasLoadedValues.current) {
      loadValues();
      hasLoadedValues.current = true
    }
  }, [])

  const hasCheckedAuth = useRef(false);
  useEffect(() => {
    if (!hasCheckedAuth.current) {
      hasCheckedAuth.current = true;
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      if (code) {
        useGoogleAuth(code);
      }
    }
  })

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

      <SidebarProvider>
        <JovialSidebar />
        <SidebarTrigger  />
        <JovialSearchBox />
        <JovialSignIn />
        <JovialRegister />
        <JovialEditUser />

        <div className='w-full'>
          {posts && posts.map((p: any) => (
            <JovialPost 
              key={p.id} 
              title={p.title} 
              content={p.content} 
              userurl={p.username}
              postedAt={p.time}
              image={p.pic}
            />
          ))}
        </div>
        
        <Toaster />
      
      </SidebarProvider>
      </ComponentProvider>
    </>
  )
}

export default App
