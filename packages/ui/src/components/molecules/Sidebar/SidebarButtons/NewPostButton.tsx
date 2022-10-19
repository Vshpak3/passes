import { useRouter } from "next/router"
import PlusSign from "public/icons/plus-sign.svg"
import { useState } from "react"
import { Button } from "src/components/atoms/Button"
import { NewPostPopup } from "src/components/molecules/scheduler/NewPostPopup"
import { useUser } from "src/hooks/useUser"
export interface NewPostButtonProps {
  isMobile?: boolean
}

export const NewPostButton: React.FC<NewPostButtonProps> = ({ isMobile }) => {
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false)
  const router = useRouter()
  const { user, loading } = useUser()
  return (
    <>
      {router.isReady &&
        !loading &&
        (router.pathname !== "/[username]" ||
          user?.username !== router.query.username) && (
          <>
            <NewPostPopup
              isOpen={isNewPostModalOpen}
              onCancel={() => setIsNewPostModalOpen(false)}
            />
            <span
              className={`flex h-12 w-12 items-center justify-center rounded-[50%] bg-passes-secondary-color ${
                isMobile ? "hidden" : "sidebar-collapse:hidden"
              }`}
            >
              <PlusSign className="h-4 w-4" />
            </span>
            <div
              className={`${isMobile ? "" : "hidden"} sidebar-collapse:flex`}
            >
              <Button
                className="mt-4 w-full max-w-sm border-none !px-8 !py-5 text-black transition-colors hover:bg-mauve-mauve12 hover:text-white dark:text-mauveDark-mauve12 dark:hover:bg-mauveDark-mauve12 dark:hover:text-black"
                variant="pink"
                onClick={() => setIsNewPostModalOpen(true)}
              >
                Create New Post
              </Button>
            </div>
          </>
        )}
    </>
  )
}

export default NewPostButton // eslint-disable-line import/no-default-export
