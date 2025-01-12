import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'
import jovialLogo from '../assets/logo.png'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Search, ChevronUp, Pen, Heart, Globe, Home, Star } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import usePostDrawer from '@/contexts/postDrawer'
import useSearchDialog from '@/contexts/searchDialog'

function JovialSidebar() {

  const {openPostDrawer} = usePostDrawer();

  const {openSearchDialog} = useSearchDialog();
  
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
                  <Avatar>
                    <AvatarImage src="https://avatars.githubusercontent.com/u/102371942?v=4" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                     ggvamp0001
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