import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useEffect, useRef, useState } from 'react';


interface JovialUserCardProps {

    className?: string;
    userUrl?: string;
    date?: string;
    enableLink?: boolean;
  
  }

function JovialUserCard({
  className, userUrl, date="", enableLink=true,
}: JovialUserCardProps) {
  const [userData, setUserData] = useState(null)
  const fetchUserData = () => {
    fetch(`${userUrl}`)
    .then(response => response.json())
    .then(data => {
      setUserData(data)
    })
  }

  const hasFetchedUser = useRef(false)
  useEffect(() => {
    if (!hasFetchedUser.current) {
      fetchUserData();
      hasFetchedUser.current = true
    }
  }, [])
  
  return (
    <div className={`${className} inline-block`}>

    <div className='flex rounded-md'>
    <Avatar className='mr-3 mt-1'>
      <AvatarImage  src={`${userData && userData.pic}`} />
      <AvatarFallback>😃</AvatarFallback>
    </Avatar>
        <div>
            <div className='mb-1'>
              {enableLink ? 
                (<Link to={"#"} className='hover:text-zinc-400'>
                  {userData && userData.username}
              </Link>):
                (<>{userData && userData.username}</>)
              }
                
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