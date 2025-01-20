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
import { useState } from "react"
import useAuthContext from "@/contexts/authContext"
  
function JovialRegister() {
  const {registerDialog, closeRegisterDialog} = useComponentContext();

  const [username, setUsername] = useState("")
  const [password, setpassword] = useState("")
  const [repassword, setrepassword] = useState("")
  const [email, setemail] = useState("")
  
  const {register} = useAuthContext();
  const handleRegister = (e) => {
    e.preventDefault();
    register(username, email, password, repassword);
    closeRegisterDialog();
  }

  return (
    <Dialog open={registerDialog}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Register</DialogTitle>
        <DialogDescription>
        "Welcome to Jovial Text! 🌻 We’re so happy you’re here."
        </DialogDescription>
      </DialogHeader>
      <div className="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
      <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full"
            onClick={closeRegisterDialog}
          >
            <X />
            <span className="sr-only">Close</span>
          </Button>
      </div>
        <div className="text-center"><img className="inline-block rounded-lg max-w-full" src="https://random.imagecdn.app/400/400"/></div>
        please register here:
        <form onSubmit={handleRegister}>
          <Input className="mt-2" onChange={(e) => {setUsername(e.target.value)}} placeholder="username" required/>
          <Input className="mt-2" onChange={(e) => {setemail(e.target.value)}} placeholder="email" type="email" required />
          <Input className="mt-2" onChange={(e) => {setpassword(e.target.value)}} placeholder="password" type="password" required/>
          <Input className="mt-2" onChange={(e) => {setrepassword(e.target.value)}} placeholder="password-again" type="password" required/>
          <Button className="mt-2" type="submit">Register</Button>
        </form>
        {/* <Input placeholder="profile pic (url)" /> */}
        
    </DialogContent>
  </Dialog>
  )
}

export default JovialRegister