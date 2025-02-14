import { toast } from 'sonner'
import JovialUserCard from './JovialUserCard'
import { Button } from './ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from './ui/card'
import { ThumbsUp, Trash } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import useAuthContext from '@/contexts/authContext'

export interface JovialPostProps {
  title?: string;
  content?: string;
  userurl?: string;
  postedAt?: string;
  image?: string;
  isOwner?: boolean;
  isLiked?: boolean;
}

function JovialPost({
  title = "Card",
  content = "",
  userurl = "#",
  postedAt = "",
  image = "",
  isOwner = false,
  isLiked = false,
}: JovialPostProps) {

  const deleteButton = (<AlertDialog>
    <AlertDialogTrigger>
      <Button className='mx-1' variant="destructive"> <Trash /> Delete</Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your post and remove it from our servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction>
        Yes, Delete it!
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>)

  const {signedIn} = useAuthContext()

  const buttons = (
    <>
    {signedIn?<>
      {isLiked ? 
      (<Button className='mx-1' onClick={() => toast("Post Unliked!")}> <ThumbsUp /> Unlike</Button>)
      :
      (<Button className='mx-1' onClick={() => toast("Post Liked!")}> <ThumbsUp /> Like</Button>)
      }
      {isOwner ? deleteButton : null}
      {/* {isOwner ?(<Button className='mx-1' variant="secondary"> <Pen /> Edit</Button>):null} */}
      </>
      :
      <></>
    }
    </>
  )

  const formatDate = (isoDateString: string | number | Date) => {
    const date = new Date(isoDateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // Toggle for 12-hour format
    });
  };
  return (<>
   
    <Card className='mr-7 my-5 max-h-min w-full lg:w-2/3 md:w-2/3 lg:mx-auto md:mx-auto'>
      <CardHeader>
        <JovialUserCard date={formatDate(postedAt)} userUrl={userurl}/>
        <CardTitle className='text-lg
        '>{title}</CardTitle>
        <CardDescription>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='text-center'>
        <div className='inline-block overflow-hidden rounded-lg h-1/3'>
        <img className='max-h-screen' src={image}></img>
        </div>
        </div>
        <p>{content}</p>
      </CardContent>
      <CardFooter>
        {buttons}
      </CardFooter>
    </Card>

    </>
  )
}

export default JovialPost

