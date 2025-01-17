import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'


interface JovialUserCardProps {

    className?: string;
    profilePic?: string;
    username?: string;
    userUrl?: string;
    date?: string;
  
  }

function JovialUserCard({
  className, profilePic, username="username", userUrl, date="date",
}: JovialUserCardProps) {
  return (
    <div className={`${className} inline-block`}>

    <div className='flex rounded-md'>
    <Avatar className='mr-3'>
      <AvatarImage src={`${profilePic}`} />
      <AvatarFallback>😃</AvatarFallback>
    </Avatar>
        <div>
            <div className='mb-1 hover:text-zinc-400'>
                <Link to={`${userUrl}`}>
                    {username}
                </Link>
            </div>
            <div className='text-sm'>
                {date}
            </div>
        </div>
    </div>
    </div>
  )
}

export default JovialUserCard