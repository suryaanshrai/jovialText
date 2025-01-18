// import { Outlet } from 'react-router-dom'
import './App.css'
// import Footer from './components/Footer/Footer'
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar'
import {JovialSidebar, ModeToggle} from "./components/index"
import React, { useEffect, useRef, useState } from 'react'
import { JovialPostForm } from './components/JovialPostForm'
import JovialSearchBox from './components/JovialSearchBox'
import { Toaster } from './components/ui/sonner'
import JovialPost from './components/JovialPost'
import {JovialPostProps} from './components/JovialPost'
import conf from './conf/conf'
import { ComponentProvider } from './contexts/componentContext'
import JovialSignIn from './components/JovialSignIn'
import JovialRegister from './components/JovialRegister'
import JovialEditUser from './components/JovialEditUser'

function App() {
  const [postDrawer, setOpen] = React.useState(false);const openPostDrawer = () => setOpen(true);const closePostDrawer = () => setOpen(false)
  const [searchDialog, setDialog] = React.useState(false);const openSearchDialog = () => setDialog(true);const closeSearchDialog = () => setDialog(false)
  const [loginDialog, setLoginDialog] = React.useState(false);const openLoginDialog = () => setLoginDialog(true);const closeLoginDialog = () => setLoginDialog(false)
  const [registerDialog, setRegisterDialog] = React.useState(false);const openRegisterDialog = () => setRegisterDialog(true);const closeRegisterDialog = () => setRegisterDialog(false)
  const [editUserDialog, setEditUserDialog] = React.useState(false);const openEditUserDialog = () => setEditUserDialog(true);const closeEditUserDialog = () => setEditUserDialog(false)

  
  const [post, setPost] = useState<JovialPostProps[]>([])
  const fetchPosts = () => {
    fetch(`${conf.api_url}post/`).then(response => response.json()).then(data => {
      setPost(data)
    })
  }

  const hasFetchedPosts = useRef(false);
  useEffect(() => {
    if(!hasFetchedPosts.current) {
      fetchPosts();
      hasFetchedPosts.current = true;
    }
  }, [])

  return (
    <>
      <ComponentProvider value={{
        postDrawer, openPostDrawer, closePostDrawer,
        searchDialog, openSearchDialog, closeSearchDialog,
        loginDialog, openLoginDialog, closeLoginDialog,
        registerDialog, openRegisterDialog, closeRegisterDialog,
        editUserDialog, openEditUserDialog, closeEditUserDialog
      }}>

      <div className='absolute top-2 right-4'>
        <ModeToggle />
      </div>
      <JovialPostForm />
      <SidebarProvider>
        <JovialSidebar />

        <SidebarTrigger  />
        <JovialSearchBox />
        <JovialSignIn />
        <JovialRegister />
        <JovialEditUser />
        <div className='w-full'>

          {post && post.map((p: any) => (
  
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
