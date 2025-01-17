import { Outlet } from 'react-router-dom'
import './App.css'
// import Footer from './components/Footer/Footer'
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar'
import {JovialSidebar, ModeToggle} from "./components/index"
import { PostDrawerProvider } from './contexts/postDrawer'
import React from 'react'
import { DrawerDemo } from './components/JovialPostForm'
import JovialSearchBox from './components/JovialSearchBox'
import { SearchDialogProvider } from './contexts/searchDialog'
import { Toaster } from './components/ui/sonner'
import JovialPost from './components/JovialPost'

function App() {
  const [postDrawer, setOpen] = React.useState(false);
  const openPostDrawer = () => {
    setOpen(true);
  }
  const closePostDrawer = () => {
    setOpen(false);
  }

  const [searchDialog, setDialog] = React.useState(false);
  const openSearchDialog = () => {
    setDialog(true);
  }
  const closeSearchDialog = () => {
    setDialog(false);
  }

  return (
    <>
    
      <PostDrawerProvider value={{postDrawer, openPostDrawer, closePostDrawer}}>
      <SearchDialogProvider value={{searchDialog, openSearchDialog, closeSearchDialog}} >

      <div className='absolute top-2 right-4'>
        <ModeToggle />
      </div>
      <DrawerDemo />
      <SidebarProvider>
        <JovialSidebar />

        <SidebarTrigger  />
        <JovialSearchBox />
        <Outlet />

        <JovialPost />
        <Toaster />
      </SidebarProvider>
      </SearchDialogProvider>
      </PostDrawerProvider>
    </>
  )
}

export default App
