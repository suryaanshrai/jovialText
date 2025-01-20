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
import { AuthProvider } from './contexts/authContext'
import { toast } from 'sonner'
import responseHandler from './handler/responseHandler'

function App() {
  const [postDrawer, setOpen] = React.useState(false);const openPostDrawer = () => setOpen(true);const closePostDrawer = () => setOpen(false)
  const [searchDialog, setDialog] = React.useState(false);const openSearchDialog = () => setDialog(true);const closeSearchDialog = () => setDialog(false)
  const [loginDialog, setLoginDialog] = React.useState(false);const openLoginDialog = () => setLoginDialog(true);const closeLoginDialog = () => setLoginDialog(false)
  const [registerDialog, setRegisterDialog] = React.useState(false);const openRegisterDialog = () => setRegisterDialog(true);const closeRegisterDialog = () => setRegisterDialog(false)
  const [editUserDialog, setEditUserDialog] = React.useState(false);const openEditUserDialog = () => setEditUserDialog(true);const closeEditUserDialog = () => setEditUserDialog(false)

  const [user, setUser] = React.useState("")
  const [token, setToken] = React.useState("")
  const [signedIn, setSignedIn] = React.useState(false)

  const login = (username, password) => {
    toast('Logging you in')
    fetch(`${conf.api_url}csrf`)
    .then(response => response.json())
    .then(data => {
      const csrf_token = data.csrfToken;

      fetch(`${conf.api_url}auth/login/`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRFTOKEN': csrf_token
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      })
      .then(response => responseHandler(response))
      .then(data => {
        if (data.invalid) return;
        setUser(`${conf.api_url}user/${data.user.pk}`)
        setSignedIn(true);
        setToken(data.access)
        toast('Successfully Logged In')
      })

    })
  }

  const logout = () => {
    toast('Logging out...');
    fetch(`${conf.api_url}auth/logout/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
    .then(response => {
      if (!response.ok) {
        toast(`Error! ${response.statusText}`);
        return {invalid:true}
      }
      return response.json();
    })
    .then(data => {
      if (data.invalid) return;
    })
    setUser("")
    setSignedIn(false);
    setToken("")
    toast('Successfully Logged Out')
  }

  const register = (username, email, password, repassword) => {
    toast('Registering you')
    fetch(`${conf.api_url}csrf`).then(response => response.json()).then(data => {
      const csrf_token = data.csrfToken;

      fetch(`${conf.api_url}auth/register/`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRFTOKEN': csrf_token
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password1: password,
          password2: repassword
        })
      })
      .then(response => responseHandler(response))
      .then(data => {
        if (data.invalid) return;
        setUser(`${conf.api_url}user/${data.user.pk}`)
        setSignedIn(true);
        setToken(data.access)
        toast('Successfully Registered')
      })

    })
  }

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


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || '')
    const token = JSON.parse(localStorage.getItem("token") || '')
    if (user && token) {
      setUser(user)
      setToken(token)
      setSignedIn(true)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user))
    localStorage.setItem("token", JSON.stringify(token))
  }, [user, token])


  return (
    <>
      <AuthProvider value={{user, token, signedIn, login, logout, register}}>
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
      </AuthProvider>
    </>
  )
}

export default App
