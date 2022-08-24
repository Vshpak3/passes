import { useRouter } from "next/router"
import { withPageLayout } from "src/layout/WithPageLayout"

const Settings = () => {
  const router = useRouter()

  return (
    <>
      <div>Settings</div>
      <div onClick={() => router.push("/payment/default-payin-method")}>
        <span className="text-[#ffff]/90">Set Default Payment Method</span>
      </div>
    </>
  )
}

export default withPageLayout(Settings)
