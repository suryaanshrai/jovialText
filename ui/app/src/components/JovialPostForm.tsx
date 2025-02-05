import { X } from "lucide-react"
// import { Editor } from '@tinymce/tinymce-react';
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
import requestHandler from "@/handler/responseHandler"


export function JovialPostForm() { 
  
  const [joke, setJoke] = useState("");
  const fetchJoke = () => {
    fetch('https://v2.jokeapi.dev/joke/Any?safe-mode&type=single')
    .then(response => response.json())
    .then(data => {
      setJoke(data.joke)
    })
  }

  const googleAuthTest = () => {
    fetch('https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http://localhost:5173/&prompt=consent&response_type=code&client_id=4683390329-dtki8jkel6or719qi6fk7qrnp8dvnven.apps.googleusercontent.com&scope=openid%20email%20profile&access_type=offline')
    .then(response => response.json())
    .then(data => {
      console.log(data)
    })
  }
  
  const hasFetchedJoke = useRef(false);
  useEffect(() => {
    if (!hasFetchedJoke.current) {
      fetchJoke();
      googleAuthTest();
      hasFetchedJoke.current = true;
    }
  }, []);



  const {postDrawer, closePostDrawer} = useComponentContext()
  window.addEventListener('keydown', (e)=>{
    if (e.key === 'Escape') {
      closePostDrawer();
    }
  })

  const [content, setcontent] = useState("")
  const [title, settitle] = useState("")
  const [pic, setpic] = useState("")

  const {user, token} = useAuthContext();

  const submitFormPost = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    toast('Posting...')
    fetch(`${conf.api_url}post/`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body : JSON.stringify({
        username: `${user}/`,
        content: content,
        title: title,
        pic: pic,
      })
    })
    .then(request => requestHandler(request))
    .then(data => {
      if (data.invalid) return;
      toast("Post published Successfully. Thanks for sharing!");
      closePostDrawer();
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
            {/* <Editor /> */}
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