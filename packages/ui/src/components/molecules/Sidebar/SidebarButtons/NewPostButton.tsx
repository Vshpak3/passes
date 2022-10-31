import { useRouter } from "next/router"
import PlusSign from "public/icons/plus-sign.svg"
import { FC, useState } from "react"

import { Button } from "src/components/atoms/Button"
import { NewPostPopup } from "src/components/molecules/scheduler/NewPostPopup"
import { useUser } from "src/hooks/useUser"

interface NewPostButtonProps {
  isMobile?: boolean
}

export const NewPostButton: FC<NewPostButtonProps> = ({ isMobile }) => {
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false)
  const router = useRouter()
  const { user } = useUser()
  return (
    <>
      {router.isReady &&
        (router.pathname !== "/[username]" ||
          user?.username !== router.query.username) && (
          <>
            <NewPostPopup
              isOpen={isNewPostModalOpen}
              onCancel={() => setIsNewPostModalOpen(false)}
            />
            <Button
              className={`flex h-12 w-12 items-center justify-center rounded-[50%] ${
                isMobile ? "hidden" : "lg:hidden"
              }`}
              variant="pink"
              onClick={() => setIsNewPostModalOpen(true)}
            >
              <PlusSign className="h-4 w-4" />
            </Button>
            <div className={`${isMobile ? "" : "hidden"} lg:flex`}>
              <Button
                className="mt-4 !px-8 !py-5"
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
