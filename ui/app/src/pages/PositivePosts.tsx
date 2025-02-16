import JovialPost from '@/components/JovialPost'
import conf from '@/conf/conf';
import useResponseHandler from '@/hooks/useResponseHandler';
import { useEffect, useRef, useState } from 'react'
import { JovialPostProps } from '@/components/JovialPost';
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from '@/components/Spinner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

function PositivePosts() {
    const [posts, setPosts] = useState<JovialPostProps[]>([])
    const [nextPage, setNextPage] = useState("")
    
    const hasLoadedPosts = useRef(false);
    useEffect(() => {
        if (!hasLoadedPosts.current) {
            fetch(`${conf.api_url}positive_posts/`)
            .then(response => useResponseHandler(response))
            .then(data => {
                if (data.invalid) return;
                setPosts(data.results)
                setNextPage(data.next)
            })
        }
    }, [])

    const fetchNextPage = () => {
            fetch(nextPage)
            .then(response => useResponseHandler(response))
            .then(data => {
                if (data.invalid) return;
                setPosts([...posts, ...data.results])
                setNextPage(data.next)
            })
    }

    return (
      <div>
      {/* <div className='text-center'>
        <Alert>
          <AlertTitle className='underline'>Note</AlertTitle>
          <AlertDescription>
            The posts here are sorted based on the compound score obtained from <a href='https://github.com/cjhutto/vaderSentiment' target='_blank' className='underline font-bold'> VaderSentiment </a> 
          </AlertDescription>
        </Alert>
      </div> */}
      <div>

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
            </div>
        </div>
    )
}

export default PositivePosts