import classNames from "classnames"
import dynamic from "next/dynamic"
import { Suspense, useEffect, useState } from "react"
import PassCard from "src/components/molecules/lucypalooza/PassCard"

const PassPayment = dynamic(
  () => import("src/components/molecules/lucypalooza/PassPayment"),
  {
    suspense: true,
    ssr: false
  }
)

const Passes = () => {
  const [selectedPass, setSelectedPass] = useState<"pass" | "vip-pass" | null>(
    null
  )
  const [purchasePassStep, setPurchasePassStep] = useState<
    "selection" | "payment" | "success"
  >("selection")

  const onPaymentSuccess = () => {
    setPurchasePassStep("success")
  }

  useEffect(() => {
    if (selectedPass) {
      setPurchasePassStep("payment")
    }
  }, [selectedPass])

  return (
    <section className="relative mt-[264px] px-5">
      {/* bg shadow */}
      <div className="absolute top-[-106px] left-[31px] h-[790px] w-[1354px] bg-[linear-gradient(107.68deg,#F2BD6C_2.58%,#BD499B_56.98%,#A359D5_87.5%)] opacity-[0.25] blur-[125px]" />

      <div
        className={classNames("mx-auto flex max-w-[1008px] space-x-12", {
          "pointer-events-none opacity-50": purchasePassStep === "success"
        })}
      >
        <PassCard
          title="Pass"
          img={{
            url: "/img/lucyplooza/pass.png",
            alt: "pass card"
          }}
          features={[
            "HUIbandk qjdbkn qjklf",
            "qBIKnwdb qwhdnfjklq jlas",
            "bujlnksfdahjkq"
          ]}
          onSelect={() => {
            setSelectedPass("pass")
          }}
          isSelected={selectedPass === "pass"}
        />
        <PassCard
          title="Pass"
          img={{ url: "/img/lucyplooza/vip-pass.png", alt: "vip pass card" }}
          features={[
            "HUIbandk qjdbkn qjklf cfygulhi cfgvhbijo fcgvhbji fdghj",
            "qBIKnwdb qwhdnfjklq jlas",
            "bujlnksfdahjkq xgfchj cfghuij cfgvhj ghjkl"
          ]}
          onSelect={() => {
            setSelectedPass("vip-pass")
          }}
          isSelected={selectedPass === "vip-pass"}
        />
      </div>
      {(purchasePassStep === "payment" || purchasePassStep === "success") && (
        <Suspense fallback={`Loading...`}>
          <PassPayment onPaymentSuccess={onPaymentSuccess} />
        </Suspense>
      )}
    </section>
  )
}

export default Passes
