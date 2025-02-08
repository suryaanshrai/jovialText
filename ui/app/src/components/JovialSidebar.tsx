import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'
import jovialLogo from '../assets/logo.png'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Search, ChevronUp, Pen, Heart, Globe, Home, Star, LogIn, UserPen, LogOut } from 'lucide-react'
// import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import JovialUserCard from './JovialUserCard'
import { useEffect, useState } from 'react'
import useComponentContext from '@/contexts/componentContext'
import useAuthContext from '@/contexts/authContext'
import useAuthFetch from '@/hooks/useAuthFetch'
import conf from '@/conf/conf'
import { toast } from 'sonner'
import useResponseHandler from '@/hooks/useResponseHandler'

function JovialSidebar() {

  const {openPostDrawer, openSearchDialog, openLoginDialog, openRegisterDialog, openEditUserDialog} = useComponentContext();

  const {signedIn, user, logout} = useAuthContext();

  const [dateTime, setDateTime] = useState("");

  useEffect(()=> {
    setInterval(()=> {
      setDateTime(new Date().toLocaleString());
    }, 1000);
  }, [])

  const onPositivePostClick = () => {
    useAuthFetch(`${conf.api_url}auth/token/verify/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: localStorage.getItem('jovialAuthToken')
      })
    })
    .then(response => useResponseHandler(response))
    .then(data => {
      console.log(data)
    })
  }

  return (
    <Sidebar>
      <SidebarHeader>
          <img src={jovialLogo} />
      </SidebarHeader>

      <SidebarContent>
        {signedIn?(
          <SidebarMenuButton onClick={openPostDrawer}> <Pen /> Post</SidebarMenuButton>
        ):
        <></>}
        <SidebarMenuButton onClick={openSearchDialog}> <Search /> Search</SidebarMenuButton>
        <SidebarMenuButton onClick={onPositivePostClick}> <Star /> Positive Posts</SidebarMenuButton>
        {signedIn?(<>
          <SidebarMenuButton> <Globe /> Following</SidebarMenuButton>
          <SidebarMenuButton> <Heart /> Liked Posts</SidebarMenuButton>
          <SidebarMenuButton> <Home /> Home</SidebarMenuButton>
        </>
        ):
        <>
        <SidebarMenuButton> <Home /> Home</SidebarMenuButton>
          <SidebarMenuButton onClick={openLoginDialog} > <LogIn /> Sign In</SidebarMenuButton>
          <SidebarMenuButton onClick={openRegisterDialog} > <UserPen /> Register</SidebarMenuButton>
        </>}
      </SidebarContent>

      <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              {signedIn?
              <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton size='lg'>
                  <JovialUserCard 
                    userUrl={user} 
                    enableLink={false} 
                    className='text-lg'
                    date={dateTime}
                  />
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                    <DropdownMenuItem>
                      <span> Your Account</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={openEditUserDialog} >
                      <span> Edit Account</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>
                      <span> Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              </>:
              <>
              <SidebarMenuButton size='lg'>
                  <JovialUserCard 
                    enableLink={false} 
                    className='text-lg'
                    date={dateTime}
                  />
                  </SidebarMenuButton>
              </>}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
  )
}

export default JovialSidebar