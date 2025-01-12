import { Avatar } from '@radix-ui/react-avatar'
import { Button } from './ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card'
import { Pen, ThumbsUp, Trash } from 'lucide-react'
import { AvatarFallback, AvatarImage } from './ui/avatar'
function JovialPost() {
  return (
    <Card className="max-w-screen-md mx-auto my-10">
      <CardHeader>
        <CardTitle>
          <div>
            
            <div className='text-lg'>A beautiful sunset</div>
          </div>
        </CardTitle>
      </CardHeader>
      <div className='overflow-hidden rounded-lg'>
        <img className='object-cover w-full h-full p-10 rounded-md' src="https://images.pexels.com/photos/36744/agriculture-arable-clouds-countryside.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />
      </div>
      <CardContent>
        <p>The sun is setting, casting a warm glow over the world. It's a beautiful reminder that even the darkest days must eventually give way to light.

        I love this time of day. The world seems to slow down, and everything feels calmer. It's a time for reflection and gratitude.

        I'm grateful for the people in my life who make me happy. I'm grateful for the opportunities I have to make a difference in the world. And I'm grateful for the simple things in life, like a beautiful sunset.

        I hope you have a chance to enjoy a beautiful sunset today. Take a moment to appreciate the beauty of the world around you. And remember, even when things are tough, there is always hope for a brighter tomorrow.</p>
      </CardContent>
      <CardFooter>
        <Button className='mx-1'> <ThumbsUp /> Like</Button>
        <Button className='mx-1' variant="secondary"> <Pen /> Edit</Button>
        <Button className='mx-1' variant="destructive"> <Trash /> Delete</Button>
      </CardFooter>
    </Card>
  )
}

export default JovialPost