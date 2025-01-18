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
  
function JovialRegister() {
  const {registerDialog, closeRegisterDialog} = useComponentContext();
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
        <Input placeholder="username" required/>
        <Input placeholder="email" type="email" required />
        <Input placeholder="password" type="password" required/>
        <Input placeholder="password-again" type="password" required/>
        {/* <Input placeholder="profile pic (url)" /> */}
        
        <Button type="submit">Register</Button>
    </DialogContent>
  </Dialog>
  )
}

export default JovialRegister