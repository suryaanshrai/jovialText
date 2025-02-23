import JovialPost from '@/components/JovialPost'
import conf from '@/conf/conf';
import useResponseHandler from '@/hooks/useResponseHandler';
import { useEffect, useRef, useState } from 'react'
import { JovialPostProps } from '@/components/JovialPost';
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from '@/components/Spinner';
import useAuthFetch from '@/hooks/useAuthFetch';

function Liked() {
    const [posts, setPosts] = useState<JovialPostProps[]>([])
    const [nextPage, setNextPage] = useState("")
    
    const hasLoadedPosts = useRef(false);
    useEffect(() => {
        if (!hasLoadedPosts.current) {
            useAuthFetch(`${conf.api_url}post/liked/`, {
                headers: {
                    'accept': 'application/json',
                }
            })
            .then(response => useResponseHandler(response))
            .then(data => {
                if (data.invalid) return;
                setPosts(data.results)
                setNextPage(data.next)
            })
        }
    }, [])

    const fetchNextPage = () => {
        useAuthFetch(nextPage, {
            headers: {
                'accept': 'application/json',
            }
        })
        .then(response => useResponseHandler(response))
        .then(data => {
            if (data.invalid) return;
            setPosts([...posts, ...data.results])
            setNextPage(data.next)
        })
    }

    return (
        <InfiniteScroll 
            dataLength={posts.length}
            next={fetchNextPage}
            hasMore={nextPage !== null}
            loader={<Spinner />}
            endMessage={<div className='text-center m-10'> No more posts!</div>}
        >
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
        </InfiniteScroll>
    )
}

export default Liked