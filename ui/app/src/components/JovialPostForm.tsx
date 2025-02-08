import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import useComponentContext from "@/contexts/componentContext"
import conf from "@/conf/conf"
import useAuthContext from "@/contexts/authContext"
import useResponseHandler from "@/hooks/useResponseHandler"
import useAuthFetch from "@/hooks/useAuthFetch"


export function JovialPostForm() { 
  
  const [joke, setJoke] = useState("");
  const hasFetchedJoke = useRef(false);
  useEffect(() => {
    if (!hasFetchedJoke.current) {
      fetch('https://v2.jokeapi.dev/joke/Any?safe-mode&type=single')
      .then(response => response.json())
      .then(data => {
        setJoke(data.joke)
      })
      hasFetchedJoke.current = true;
    }
  }, []);


  const [content, setcontent] = useState("")
  const [title, settitle] = useState("")
  const [pic, setpic] = useState("")

  
  const {postDrawer, closePostDrawer} = useComponentContext();
  const {user} = useAuthContext();
  const submitFormPost = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    toast('Posting...')
    
    useAuthFetch(`${conf.api_url}post/`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body : JSON.stringify({
        username: `${user}/`,
        content: content,
        title: title,
        pic: pic,
      })
    })
    .then(response => useResponseHandler(response))
    .then(data => {
      if (data.invalid) return;
      toast("Post published Successfully. Thanks for sharing!");
      closePostDrawer();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    })
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
          <form onSubmit={submitFormPost}>

            <Input className="flex w-full max-w-sm items-center space-x-2 my-5" placeholder="Title" onChange={(e) => {settitle(e.target.value)}} />

            <Textarea className="h-40" placeholder={joke || 'Loading joke...'} onChange={(e) => {setcontent(e.target.value)}}/>
            <Input className="flex w-full max-w-sm items-center space-x-2 my-5" placeholder="Image URL" onChange={(e) => {setpic(e.target.value)}} />
            {/* <Input className="flex w-full max-w-sm items-center space-x-2 my-5" placeholder="Tags" /> */}
          <DrawerFooter>
            <Button className="mb-10">Post</Button>
          </DrawerFooter>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  )
}