import { useRouter } from "next/router"
import { Button } from "src/components/atoms/Button"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"

export const CREATE_NEW_PASS_PATH = "/tools/manage-passes/create"

const ManagePasses = () => {
  const router = useRouter()

  const handleCreateNewPass = () => router.push(CREATE_NEW_PASS_PATH)

  return (
    <div className="text-white">
      <div className="absolute top-[160px] flex w-[-webkit-fill-available] items-center justify-between px-7">
        <h1 className="text-xl font-bold">Manage Passes</h1>
        <div className="relative mr-10 flex items-center justify-end">
          <Button onClick={handleCreateNewPass} variant="purple">
            <div className="flex items-center justify-center p-2 text-[16px]">
              Create New Pass
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default WithNormalPageLayout(ManagePasses, { creatorOnly: true })
