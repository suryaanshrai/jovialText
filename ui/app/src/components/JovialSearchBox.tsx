import { Dialog,  DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { X } from 'lucide-react'
import useComponentContext from '@/contexts/componentContext'

function JovialSearchBox() {
  const { searchDialog, closeSearchDialog } = useComponentContext();
  window.addEventListener('keydown', (e)=>{
    if (e.key === 'Escape') {
      closeSearchDialog();
    }
  })
  return (
    <Dialog open={searchDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>
            <p>Find posts with these tags.</p>
            <p>Use "@username" to search for a user</p>
            <p>Use "#tag" to search for posts with a tag</p>
          </DialogDescription>
        </DialogHeader>
        <div className="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 shrink-0 rounded-full"
              onClick={closeSearchDialog}
            >
              <X />
              <span className="sr-only">Close</span>
            </Button>
        </div>
        <div className="flex w-full max-w-sm items-center space-x-2 my-5">
          <Input />
          <Button type="submit">Search</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default JovialSearchBox