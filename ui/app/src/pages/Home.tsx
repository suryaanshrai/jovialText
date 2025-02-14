import JovialPost from '@/components/JovialPost'
import conf from '@/conf/conf';
import useResponseHandler from '@/hooks/useResponseHandler';
import { useEffect, useRef, useState } from 'react'

function Home() {
    const [posts, setPosts] = useState([])
    
    const hasLoadedPosts = useRef(false);
    useEffect(() => {
        if (!hasLoadedPosts.current) {
            fetch(`${conf.api_url}post/`)
            .then(response => useResponseHandler(response))
            .then(data => {
                if (data.invalid) return;
                setPosts(data.results)
            })
        }
    }, [])
    return (
        <div className='w-full'>
            {posts && posts.map((p: any) => (
              <JovialPost 
                key={p.id} 
                title={p.title} 
                content={p.content} 
                userurl={p.username}
                postedAt={p.created}
                image={p.pic}
              />
            ))}
        </div>
    )
}

export default Home