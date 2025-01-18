import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'
import jovialLogo from '../assets/logo.png'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Search, ChevronUp, Pen, Heart, Globe, Home, Star } from 'lucide-react'
// import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import JovialUserCard from './JovialUserCard'
import { useEffect, useState } from 'react'
import useComponentContext from '@/contexts/componentContext'

function JovialSidebar() {

  const {openPostDrawer} = useComponentContext();

  const {openSearchDialog} = useComponentContext();
  
  const [dateTime, setDateTime] = useState("")

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
        <SidebarMenuButton onClick={openPostDrawer}> <Pen /> Post</SidebarMenuButton>
        <SidebarMenuButton onClick={openSearchDialog}> <Search /> Search</SidebarMenuButton>
        <SidebarMenuButton> <Star /> Positive Posts</SidebarMenuButton>
        <SidebarMenuButton> <Globe /> Following</SidebarMenuButton>
        <SidebarMenuButton> <Heart /> Liked Posts</SidebarMenuButton>
        <SidebarMenuButton> <Home /> Home</SidebarMenuButton>
      </SidebarContent>

      <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton size='lg'>
                  <JovialUserCard 
                    userUrl='http://0.0.0.0:8000/user/7fcbf41a-8529-44d6-9dec-c5d6e14878ca/' 
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
                    <span>Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Your Posts</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
  )
}

export default JovialSidebar