import PlusSign from "public/icons/plus-sign.svg"
import { useState } from "react"
import { Button } from "src/components/atoms/Button"
import { Dialog } from "src/components/organisms/Dialog"
import { NewPost } from "src/components/organisms/profile/main-content/new-post/NewPost"

export interface NewPostButtonProps {
  isMobile?: boolean
}

export const NewPostButton: React.FC<NewPostButtonProps> = ({ isMobile }) => {
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false)
  const handleCreatePost = () => {
    setIsNewPostModalOpen(false)
  }

  return (
    <Dialog
      open={isNewPostModalOpen}
      triggerClassName="flex items-center justify-center self-center sidebar-collapse:pt-8"
      className="h-screen w-screen transform overflow-hidden transition-all md:max-h-[580px] md:max-w-[580px] lg:max-w-[680px]"
      trigger={
        <>
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-[50%] bg-passes-secondary-color ${
              isMobile ? "hidden" : "sidebar-collapse:hidden"
            }`}
          >
            <PlusSign className="h-4 w-4" />
          </span>
          <div className={`${isMobile ? "" : "hidden"} sidebar-collapse:flex`}>
            <Button
              className="mt-4 w-full max-w-sm border-none !px-8 !py-5 text-black transition-colors hover:bg-mauve-mauve12 hover:text-white dark:text-mauveDark-mauve12 dark:hover:bg-mauveDark-mauve12 dark:hover:text-black"
              variant="pink"
              onClick={() => setIsNewPostModalOpen(true)}
            >
              Create New Post
            </Button>
          </div>
        </>
      }
    >
      <NewPost
        initialData={{}}
        handleCreatePost={handleCreatePost}
        placeholder="What's on your mind?"
      />
    </Dialog>
  )
}

export default NewPostButton // eslint-disable-line import/no-default-export
