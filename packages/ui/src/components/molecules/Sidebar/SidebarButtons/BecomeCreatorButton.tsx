import { useRouter } from "next/router"
import PlusSign from "public/icons/plus-sign.svg"
import { FC } from "react"
import { Button } from "src/components/atoms/Button"

interface BecomeCreatorButtonProps {
  isMobile?: boolean
}

export const BecomeCreatorButton: FC<BecomeCreatorButtonProps> = ({
  isMobile
}) => {
  const router = useRouter()

  return (
    <>
      <div className="flex items-center justify-center sidebar-collapse:hidden">
        <button
          className={`flex h-12 w-12 items-center justify-center rounded-[50%] bg-passes-secondary-color ${
            isMobile ? "hidden" : "sidebar-collapse:hidden"
          }`}
          onClick={() => router.push("/creator-flow")}
        >
          <PlusSign className="h-4 w-4 " />
        </button>
      </div>
      <div
        className={`${
          isMobile ? "" : "hidden"
        } sidebar-collapse:flex sidebar-collapse:items-center sidebar-collapse:justify-center sidebar-collapse:self-center`}
      >
        <Button
          onClick={() => router.push("/creator-flow")}
          className="mt-4 w-full max-w-sm border-none !px-8 !py-5 text-white transition-colors"
          variant="pink"
        >
          Become a Creator
        </Button>
      </div>
    </>
  )
}
