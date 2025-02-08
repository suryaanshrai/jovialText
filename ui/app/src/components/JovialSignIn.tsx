import { useEffect, useState } from "react"
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

import googleLogo from "@/assets/google.png"
import useComponentContext from "@/contexts/componentContext"
import useAuthContext from "@/contexts/authContext"
import useGoogleAuth from "@/hooks/useGoogleAuth"
  
function JovialSignIn() {
  const {loginDialog, closeLoginDialog} = useComponentContext();
  const {login, signedIn} = useAuthContext();
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(username, password);
  }

  useEffect(() => {
    if (signedIn) closeLoginDialog();
  }, [signedIn])

  return (
    <Dialog open={loginDialog}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Sign In</DialogTitle>
        <DialogDescription>
        "Welcome back! 🌟 Stay connected, share your world, and explore what’s new. Let’s make your feed shine!"
        </DialogDescription>
      </DialogHeader>
      <div className="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
      
      <Button variant="outline" size="icon" className="h-8 w-8 shrink-0 rounded-full" onClick={closeLoginDialog}>
          <X />
          <span className="sr-only">Close</span>
      </Button>
      </div>

      {/* <div className="text-center"><img className="inline-block rounded-lg max-w-full" src="https://random.imagecdn.app/450/200"/></div> */}
      <form onSubmit={handleLogin}>
        <Input className="my-2" placeholder="username" onChange={(e)=>setUsername(e.target.value)} required/>
        <Input className="mb-2" placeholder="password" onChange={(e)=>setPassword(e.target.value)} type="password" required/>
        <Button className="mb-2 w-full" type="submit">Sign in</Button>
        <div className="text-center text-sm mb-2">or</div>
      </form>
        <Button className="mb-2 w-full" onClick={() => useGoogleAuth()}><img className="w-5" src={googleLogo} /> Sign In using Google</Button>
    </DialogContent>
  </Dialog>
  )
}

export default JovialSignIn