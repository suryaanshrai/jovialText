import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
import { X } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import useComponentContext from "@/contexts/componentContext"
import conf from "@/conf/conf"
import { toast } from "sonner"
import { useEffect, useRef, useState } from "react"
import useResponseHandler from "@/hooks/useResponseHandler"
import useAuthFetch from "@/hooks/useAuthFetch"
  
function JovialEditUser() {
  const {editUserDialog, closeEditUserDialog} = useComponentContext();

  const user = localStorage.getItem('jovialUser') || "";

  interface UserDetails {
    id: string;
    url: string;
    username: string;
    pic: string;
    bio: string;
  }

  const [userDetails, setUserDetails] = useState<UserDetails>({ id: "", url: "", username: "", bio: "", pic: "" })

  const hasFetchedUserDetails = useRef(false)
  useEffect(() => {
    if (hasFetchedUserDetails.current) return;
    fetch(`${user}`)
    .then(response => response.json())
    .then(data => {
      setUserDetails(data)
      setPic(data.pic)
      setBio(data.bio)
      setUsername(data.username)
    })
    hasFetchedUserDetails.current = true;
  }, [])


  
  const [pic, setPic] = useState("")
  const handlePicForm = (e: any) => {
    e.preventDefault();
    useAuthFetch(`${conf.api_url}user/${userDetails.id}/`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pic: pic,
      })
    })
    .then(response => useResponseHandler(response))
    .then(data => {
        if (data.invalid) return;
        toast('Successfully changed pic')
    })
  }

  const [bio, setBio] = useState("")
  const handleBioForm = (e: any) => {
    e.preventDefault();
    useAuthFetch(`${conf.api_url}user/${userDetails.id}/`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bio: bio,
      })
    })
    .then(response => useResponseHandler(response))
    .then(data => {
        if (data.invalid) return;
        toast('Successfully changed bio')
    })
  }

  const [username, setUsername] = useState("")
  const handleUsernameForm = (e: any) => {
    e.preventDefault();
    useAuthFetch(`${conf.api_url}user/${userDetails.id}/`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
      })
    })
    .then(response => useResponseHandler(response))
    .then(data => {
        if (data.invalid) return;
        toast('Successfully changed username')
    })
  }

  const [password1, setPassword1] = useState("")
  const [password2, setPassword2] = useState("")
  const handlePasswordForm = (e: any) => {
    e.preventDefault();
    useAuthFetch(`${conf.api_url}auth/password/change/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        new_password1: password1,
        new_password2: password2,
      })
    })
    .then(response => useResponseHandler(response))
    .then(data => {
        if (data.invalid) return;
        e.target.reset();
        toast('Successfully changed password')
    })
  }

  return (
    <Dialog open={editUserDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modify your account!</DialogTitle>
          <DialogDescription>
          You can change your profile pic, bio, username and password from here!
          </DialogDescription>
        </DialogHeader>
        
        <div className="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <Button variant="outline" size="icon" className="h-8 w-8 shrink-0 rounded-full" onClick={closeEditUserDialog}> 
            <X /> <span className="sr-only">Close</span> 
          </Button>
        </div>

        <div className="lg:flex">
          <div className="text-center">
            <img className="inline-block rounded-lg max-w-44 max-h-44" src={userDetails.pic} alt="no profile pic"/>
          </div>
          
          <div className="">
            <form onSubmit={handlePicForm}>
              <div className="flex lg:ml-3 mt-5">
                <Input onChange={(e) => {setPic(e.target.value)}} value={pic} placeholder="URL of new pic" />
                <Button  type="submit">Change Pic</Button>
              </div>
            </form>
            
            <form onSubmit={handleBioForm}>
              <div className="flex lg:ml-3 mt-2">
                <Input onChange={(e) => {setBio(e.target.value)}} value={bio} placeholder="Bio" required/>
                <Button type="submit">Change Bio</Button>
              </div>
            </form>

            <form onSubmit={handleUsernameForm}>
              <div className="flex lg:ml-3 mt-2">
                <Input onChange={(e) => {setUsername(e.target.value)}} placeholder="username" value={username} required/>
                <Button  type="submit">Change Username</Button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="mt-5">
          <p className="text-sm">Change Your Password</p>
          <form onSubmit={handlePasswordForm}>
            <Input onChange={(e) => {setPassword1(e.target.value)}} className="mt-2" placeholder="new password" type="password" required/>
            <Input onChange={(e) => {setPassword2(e.target.value)}} className="mt-2" placeholder="confirm password" type="password" required/>
            <Button className="w-full mt-2 " type="submit">Change Password</Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default JovialEditUser