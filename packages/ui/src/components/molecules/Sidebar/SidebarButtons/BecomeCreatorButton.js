import { useRouter } from "next/router"
import PlusSign from "public/icons/plus-sign.svg"

import { Button } from "../../../atoms"

const BecomeCreatorButton = () => {
  const router = useRouter()

  return (
    <>
      <div className="flex items-center justify-center sidebar-collapse:hidden">
        <button
          className="flex h-12 w-12 items-center justify-center rounded-[50%] bg-passes-secondary-color sidebar-collapse:hidden"
          onClick={() => router.push("/creator-flow")}
        >
          <PlusSign className="h-4 w-4 " />
        </button>
      </div>
      <div className="hidden sidebar-collapse:flex sidebar-collapse:items-center sidebar-collapse:justify-center sidebar-collapse:self-center">
        <Button
          onClick={() => router.push("/creator-flow")}
          className="mt-4 w-full max-w-sm  border-none !px-8 !py-5 text-white transition-colors"
          variant="pink"
        >
          Become a Creator
        </Button>
      </div>
    </>
  )
}

export default BecomeCreatorButton
