import Link from "next/link"

import { Button } from "src/components/atoms/button/Button"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"

const ManagePasses = () => {
  return (
    <div className="text-white">
      <div className="flex items-center justify-between p-4">
        <div className="relative mr-10 flex items-center justify-end">
          <Link href="/tools/manage-passes/create">
            <Button variant="pink">
              <div className="flex items-center justify-center p-2 text-[16px]">
                Create New Membership
              </div>
            </Button>
          </Link>
        </div>
      </div>
      <div className="ml-4 flex items-center justify-between py-16">
        <div className="text-xl">
          This page is for dev and staging. Do not review.
        </div>
      </div>
    </div>
  )
}

export default WithNormalPageLayout(ManagePasses, {
  creatorOnly: true,
  headerTitle: "Memberships"
})
