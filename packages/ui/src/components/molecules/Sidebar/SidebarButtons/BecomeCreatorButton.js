import PlusSign from "public/icons/plus-sign.svg"

import { Button } from "../../../atoms"

const BecomeCreatorButton = () => (
  <>
    <div className="flex items-center justify-center sidebar-collapse:hidden">
      <span className="flex h-12 w-12 items-center justify-center rounded-[50%] bg-[#BF7AF0] sidebar-collapse:hidden">
        <PlusSign className="h-4 w-4 " />
      </span>
    </div>
    <div className="hidden sidebar-collapse:flex sidebar-collapse:items-center sidebar-collapse:justify-center sidebar-collapse:self-center">
      <Button
        className="mt-4 w-full max-w-sm  border-none !px-8 !py-5 text-black transition-colors hover:bg-mauve-mauve12 hover:text-white  dark:text-mauveDark-mauve12 dark:hover:bg-mauveDark-mauve12 dark:hover:text-black"
        variant="pink"
      >
        Become a Creator
      </Button>
    </div>
  </>
)

export default BecomeCreatorButton
