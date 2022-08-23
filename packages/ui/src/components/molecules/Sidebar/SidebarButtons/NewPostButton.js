import PlusSign from "public/icons/plus-sign.svg"
import { Dialog as NewPostDialog } from "src/components/organisms"
import { NewPost } from "src/components/pages/profile/main-content/new-post"

import { Button } from "../../../atoms"

const NewPostButton = () => (
  <NewPostDialog
    triggerClassName="flex items-center justify-center self-center sidebar-collapse:pt-8"
    className="h-screen w-screen transform overflow-hidden transition-all md:max-h-[580px] md:max-w-[580px] lg:max-w-[680px]"
    trigger={
      <>
        <span className="flex h-12 w-12 items-center justify-center rounded-[50%] bg-[#BF7AF0] sidebar-collapse:hidden">
          <PlusSign className="h-4 w-4 " />
        </span>
        <div className="hidden sidebar-collapse:flex">
          <Button
            className="mt-4 w-full max-w-sm  border-none !px-8 !py-5 text-black transition-colors hover:bg-mauve-mauve12 hover:text-white  dark:text-mauveDark-mauve12 dark:hover:bg-mauveDark-mauve12 dark:hover:text-black"
            variant="pink"
          >
            Create New Post
          </Button>
        </div>
      </>
    }
  >
    <NewPost />
  </NewPostDialog>
)

export default NewPostButton
