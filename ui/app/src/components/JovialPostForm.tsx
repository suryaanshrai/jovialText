import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import usePostDrawer from "@/contexts/postDrawer"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"


export function DrawerDemo() { 
  
  const hasFetchedJoke = useRef(false);
  const [joke, setJoke] = useState("");
  const fetchJoke = () => {
    fetch('https://v2.jokeapi.dev/joke/Any?safe-mode&type=single')
    .then(response => response.json())
    .then(data => {
      setJoke(data.joke)
    })
  }
  useEffect(() => {
    if (!hasFetchedJoke.current) {
      fetchJoke();
      hasFetchedJoke.current = true;
    }
  }, []);



  const {postDrawer, closePostDrawer} = usePostDrawer()
  window.addEventListener('keydown', (e)=>{
    if (e.key === 'Escape') {
      closePostDrawer();
    }
  })

  const submitFormPost = () => {
    toast("Post published Successfully. Thanks for sharing!");
    closePostDrawer();
  }

  return (
    <Drawer open={postDrawer}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="flex justify-between items-center">
            <div>
              <DrawerTitle>Happy Posting!</DrawerTitle>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 shrink-0 rounded-full"
              onClick={closePostDrawer}
            >
              <X />
              <span className="sr-only">Close</span>
            </Button>
          </DrawerHeader>
          <Input className="flex w-full max-w-sm items-center space-x-2 my-5" placeholder="Title" />

          <Textarea className="h-40" placeholder={joke || 'Loading joke...'}/>
           <Input className="flex w-full max-w-sm items-center space-x-2 my-5" placeholder="Image URL" />
           <Input className="flex w-full max-w-sm items-center space-x-2 my-5" placeholder="Tags" />
          <DrawerFooter>
            <Button className="mb-32 mt-10" onClick={submitFormPost}>Post</Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
