import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'
import jovialLogo from '../assets/logo.png'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Search, ChevronUp, Pen, Heart, Globe, Home, Star, LogIn, UserPen, LogOut } from 'lucide-react'
// import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import JovialUserCard from './JovialUserCard'
import { useEffect, useState } from 'react'
import useComponentContext from '@/contexts/componentContext'
import useAuthContext from '@/contexts/authContext'

function JovialSidebar() {

  const {openPostDrawer, openSearchDialog, openLoginDialog, openRegisterDialog, openEditUserDialog} = useComponentContext();

  const {signedIn, user} = useAuthContext();

  const [dateTime, setDateTime] = useState("");

  useEffect(()=> {
    setInterval(()=> {
      setDateTime(new Date().toLocaleString());
    }, 1000);
  }, [])

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
        <SidebarMenuButton> <Star /> Positive Posts</SidebarMenuButton>
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
                    <DropdownMenuItem>
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