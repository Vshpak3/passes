import Link from "next/link"

import { Button } from "src/components/atoms/button/Button"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"

const ManagePasses = () => {
  return (
    <div className="text-white">
      <div className="flex items-center justify-between px-7 py-4">
        <h1 className="text-xl font-bold">Manage Membership</h1>
        <div className="relative mr-10 flex items-center justify-end">
          <Link href="/tools/manage-passes/create">
            <Button variant="purple">
              <div className="flex items-center justify-center p-2 text-[16px]">
                Create New Membership
              </div>
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex items-center justify-between px-[47px] py-[45px]">
        <div className="text-xl">
          This page is for dev and staging. Do not review.
        </div>
      </div>
    </div>
  )
}

export default WithNormalPageLayout(ManagePasses, { creatorOnly: true })
