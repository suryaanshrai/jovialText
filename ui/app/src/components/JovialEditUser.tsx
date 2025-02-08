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
import useAuthContext from "@/contexts/authContext"
import { toast } from "sonner"
import { useEffect, useRef, useState } from "react"
import useResponseHandler from "@/hooks/useResponseHandler"
  
function JovialEditUser() {
  const {editUserDialog, closeEditUserDialog} = useComponentContext();
  const {user, token} = useAuthContext();

  const [pic, setpic] = useState("")
  const [username, setusername] = useState("")
  const [bio, setbio] = useState("")

  const setUserData = useRef(false);

  useEffect(() => {
    if (!setUserData.current) {
      setUserData.current = true
      fetch(`${user}/`, )
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setusername(data[0].username)
        setpic(data[0].pic)
        setbio(data[0].bio)
      })
    }
  }, [])

  const handlePicForm = (e) => {
    e.preventDefault();
    fetch(`${user}`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        pic: pic
      })

    }).then(response => useResponseHandler(response)).then(data => {
      if (data.invalid) return; toast('Pic Updated Successfully');
    })
  }

  return (
    // <Dialog open>
    <Dialog open={editUserDialog}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Modify your account!</DialogTitle>
        <DialogDescription>
        You can change your profile pic, bio, username and password from here!
        </DialogDescription>
      </DialogHeader>
      <div className="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
      <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full"
            onClick={closeEditUserDialog}
          >
            <X />
            <span className="sr-only">Close</span>
          </Button>
      </div>
      <div className="lg:flex">
        <div className="text-center"><img className="inline-block rounded-lg max-w-44 max-h-44" src="https://avatars.githubusercontent.com/u/102371942?v=4" alt="no img"/></div>
        
        <div className="">
            <form onSubmit={handlePicForm}>
          <div className="flex lg:ml-3 mt-5">
              <Input onChange={(e) => {setpic(e.target.value)}} value={pic} placeholder="URL of new pic" />
              <Button  type="submit">Change Pic</Button>
          </div>
            </form>
          <div className="flex lg:ml-3 mt-2">
            <Input placeholder="Bio" required/>
            <Button  type="submit">Change Bio</Button>
          </div>
          <div className="flex lg:ml-3 mt-2">
            <Input placeholder="username" required/>
            <Button  type="submit">Change Username</Button>
          </div>
        </div>
      </div>
      
      <div className="mt-5">
        <p className="text-sm">Change Your Password</p>
        <Input className="mt-2" placeholder="new password" type="password" required/>
        <Input className="mt-2" placeholder="confirm" type="password" required/>
        <Button className="w-full mt-2 " type="submit">Change Password</Button>
      </div>
    </DialogContent>
  </Dialog>
  )
}

export default JovialEditUser