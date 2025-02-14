import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'
import jovialLogo from '../assets/logo.png'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Search, ChevronUp, Pen, Heart, Globe, Home, Star, LogIn, UserPen, Bell} from 'lucide-react'
import JovialUserCard from './JovialUserCard'
import { useEffect, useState } from 'react'
import useComponentContext from '@/contexts/componentContext'
import useAuthContext from '@/contexts/authContext'
import { NavLink } from 'react-router-dom'

function JovialSidebar() {

  const {openPostDrawer, openSearchDialog, openLoginDialog, openRegisterDialog, openEditUserDialog} = useComponentContext();

  const {signedIn, user, logout} = useAuthContext();

  const [dateTime, setDateTime] = useState("");

  useEffect(()=> {
    setInterval(()=> {
      setDateTime(new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }))
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
        <NavLink className={({isActive}) => isActive ? "font-bold" : ""} to="positive-posts">
          <SidebarMenuButton> <Star /> Positive Posts</SidebarMenuButton>
        </NavLink>
        {signedIn?(<>
          <NavLink className={({isActive}) => isActive ? "font-bold" : ""} to="following">
            <SidebarMenuButton> <Globe /> Following</SidebarMenuButton>
          </NavLink>

          <NavLink className={({isActive}) => isActive ? "font-bold" : ""} to="liked">
            <SidebarMenuButton> <Heart /> Liked Posts</SidebarMenuButton>
          </NavLink>
          
          <NavLink className={({isActive}) => isActive ? "font-bold" : ""} to="notifications">
            <SidebarMenuButton> <Bell />  Notifications </SidebarMenuButton>
          </NavLink>
          
          <NavLink className={({isActive}) => isActive ? "font-bold" : ""} to="">
            <SidebarMenuButton> <Home />  Home </SidebarMenuButton>
          </NavLink>
        </>
        ) :
        <>
          <NavLink className={({isActive}) => isActive ? "font-bold" : ""} to="">
            <SidebarMenuButton> <Home />  Home </SidebarMenuButton>
          </NavLink>
          <SidebarMenuButton onClick={openLoginDialog} > <LogIn /> Sign In</SidebarMenuButton>
          <SidebarMenuButton onClick={openRegisterDialog} > <UserPen /> Register</SidebarMenuButton>
        </>}
      </SidebarContent>

      <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              {
                signedIn ?
                  <>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuButton size='lg'>
                          <JovialUserCard userUrl={user} enableLink={false} className='text-lg'date={dateTime}/>
                          <ChevronUp className="ml-auto" />
                        </SidebarMenuButton>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
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
                  </> :
                  <>
                    <SidebarMenuButton size='lg'>
                      <JovialUserCard enableLink={false} className='text-lg' date={dateTime}/>
                    </SidebarMenuButton>
                  </>
              }
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
  )
}

export default JovialSidebar