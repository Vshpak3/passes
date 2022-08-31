import { useRouter } from "next/router"
import { Button } from "src/components/atoms"
import { withPageLayout } from "src/layout/WithPageLayout"

import AuthOnlyWrapper from "../components/wrappers/AuthOnly"
import CreatorOnlyWrapper from "../components/wrappers/CreatorOnly"
import BankIcon from "../icons/bank-icon"

const Settings = () => {
  const router = useRouter()

  return (
    <AuthOnlyWrapper isPage>
      <div className="mx-auto -mt-[200px] grid grid-cols-10 gap-5 px-4 text-[#ffff]/90 sm:w-[653px] md:w-[653px] lg:w-[900px] lg:px-0 sidebar-collapse:w-[1000px]">
        <div className="col-span-12 w-full">
          <div className="mb-16 text-base font-medium leading-[19px]">
            <div className="my-4 flex items-center justify-between gap-x-4">
              <span className="text-[24px] font-bold text-[#ffff]/90">
                Settings
              </span>
              <Button
                variant="purple"
                icon={<BankIcon width={25} height={25} />}
              >
                Manage Bank
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* creators get both, fans only get payin method */}
      <CreatorOnlyWrapper>
        <div onClick={() => router.push("/payment/default-payout-method")}>
          <span className="text-[#ffff]/90">Set Default Payout Method</span>
        </div>
      </CreatorOnlyWrapper>
    </AuthOnlyWrapper>
  )
}

export default withPageLayout(Settings)
