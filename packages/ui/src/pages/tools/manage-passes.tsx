import Link from "next/link"
import { Button } from "src/components/atoms/Button"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"

const ManagePasses = () => {
  return (
    <div className="text-white">
      <div className="absolute top-[160px] flex w-[-webkit-fill-available] items-center justify-between px-7">
        <h1 className="text-xl font-bold">Manage Passes</h1>
        <div className="relative mr-10 flex items-center justify-end">
          <Link href={"/tools/manage-passes/create"}>
            <Button variant="purple">
              <div className="flex items-center justify-center p-2 text-[16px]">
                Create New Pass
              </div>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default WithNormalPageLayout(ManagePasses, { creatorOnly: true })
