import { VerificationApi } from "@passes/api-client"
import { identity } from "lodash"
import { useRouter } from "next/router"
import CheckIcon from "public/icons/check.svg"
import LimitedEditionIcon from "public/icons/limited-edition-pass.svg"
import SubscriptionIcon from "public/icons/subscription-pass.svg"
import VerificationLoading from "public/pages/profile/creator-verification-loading.svg"
import { MouseEventHandler, useEffect, useState } from "react"
import { ButtonTypeEnum, PassesPinkButton } from "src/components/atoms/Button"
import Modal from "src/components/organisms/Modal"
import { CREATOR_STEPS, CREATOR_STEPS_TEXT } from "src/configurations/contants"
import { useWindowSize } from "src/hooks/useWindowSizeHook"

import { wrapApi } from "../../helpers"
import CustomizePageForm from "./CustomizePageForm"
import PaymentForm from "./PaymentForm"

type BulletItemProps = {
  isSelected: boolean
  setSelectedStep: MouseEventHandler
}

function BulletItem({ isSelected, setSelectedStep }: BulletItemProps) {
  return (
    <div
      onClick={setSelectedStep}
      className={`cursor-pointer ${
        isSelected ? "text-gray-500" : "text-gray-700"
      }`}
    >
      &bull;
    </div>
  )
}

type CreatorStepsProps = {
  creatorStep: string
  isDone: boolean
  isSelected: boolean
  setSelectedStep: MouseEventHandler
}

function CreatorSteps({
  creatorStep,
  isDone,
  isSelected,
  setSelectedStep
}: CreatorStepsProps) {
  return (
    <>
      {/* small screens */}
      <div
        onClick={setSelectedStep}
        className={`flex cursor-pointer flex-row items-center  gap-3 rounded-full py-3 text-white sm:hidden
        ${
          isSelected
            ? "flex-1 pl-6"
            : "w-[66px] items-center justify-center border border-gray-700"
        }`}
      >
        <div
          className={
            "bg-creator-flow-violet flex h-8 w-8 items-center justify-center rounded-full border border-gray-700"
          }
        >
          {isDone ? <CheckIcon /> : CREATOR_STEPS_TEXT[creatorStep].number}
        </div>
        <div className={`${isSelected ? "flex flex-1" : "hidden"} flex-col`}>
          <div className="flex w-full flex-1">
            {CREATOR_STEPS_TEXT[creatorStep].title}
          </div>
          <div className="text-slate-400">
            {CREATOR_STEPS_TEXT[creatorStep].subtitle}
          </div>
        </div>
      </div>
      {/* md and up Screen */}
      <div
        onClick={setSelectedStep}
        className={`hidden flex-1 cursor-pointer flex-row items-center gap-3 rounded-full py-3 pl-6 text-white sm:flex
        ${isSelected ? "border border-gray-700" : ""}`}
      >
        <div
          className={`h-8 w-8 rounded-full  ${
            isDone || isSelected
              ? "bg-creator-flow-violet"
              : "border border-gray-700"
          } flex items-center justify-center`}
        >
          {isDone ? <CheckIcon /> : CREATOR_STEPS_TEXT[creatorStep].number}
        </div>
        <div className={"flex flex-1 flex-col"}>
          <div className="flex w-full flex-1">
            {CREATOR_STEPS_TEXT[creatorStep].title}
          </div>
          <div className="text-slate-400">
            {CREATOR_STEPS_TEXT[creatorStep].subtitle}
          </div>
        </div>
      </div>
    </>
  )
}

function WelcomeToPasses() {
  return (
    <div className="p-12 text-xl text-white">
      <div className="text-center text-2xl">Welcome to Passes!</div>
      <div className="text-center text-sm text-[#737893]">
        Now it&apos;s time to create your first pass!
      </div>

      <div className="mt-12 flex max-w-3xl flex-col gap-10 sm:flex-row">
        <div className="flex min-w-[330px] flex-1 flex-col items-center justify-between rounded-md border border-[#624256] bg-black px-10 py-8">
          <div className="flex flex-col items-center">
            <SubscriptionIcon />
            <div className="mt-5 text-center text-2xl font-bold">
              Subscription
            </div>
            <div className="mt-5 text-center text-base text-[#737893]">
              These are passes that anyone can buy where you charge per month,
              year, or lifetime. They are unlimited in amount
            </div>
          </div>
          <PassesPinkButton
            onClick={identity}
            name="Get Started"
            type={ButtonTypeEnum.BUTTON}
            className="mt-6 font-normal"
          />
        </div>
        <div className="flex min-w-[330px] flex-1 flex-col items-center justify-between rounded-md border border-[#624256] bg-black px-10 py-8">
          <div className="flex flex-col items-center">
            <LimitedEditionIcon />
            <div className="mt-5 text-center text-2xl font-bold">
              Limited Edition
            </div>
            <div className="mt-5 text-center text-base text-[#737893]">
              These are passes that are limited edition. Once they sell out,
              people will have to buy on the resale market. You get a % royalty
              every time it resales.
            </div>
          </div>
          <PassesPinkButton
            onClick={identity}
            name="Get Started"
            type={ButtonTypeEnum.BUTTON}
            className="mt-6 font-normal"
          />
        </div>
      </div>
    </div>
  )
}

const CreatorFlow = () => {
  const [stepsDone, setStepsDone] = useState<string[]>([])
  const [selectedStep, setSelectedStep] = useState<string>(
    CREATOR_STEPS.CUSTOMIZE
  )
  const [isVerificationDialogOpen, setIsVerificationDialogOpen] =
    useState<boolean>(false)
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState<boolean>(false)
  const { width } = useWindowSize()
  const router = useRouter()

  useEffect(() => {
    const step3Handler = async () => {
      const step = router.query.step
      // const api = wrapApi(VerificationApi)
      // const result = await api.getCreatorVerificationStep()
      // if (result.step === "step 3 payout") {
      if (step === "3") {
        setStepsDone((prev) => [...prev, CREATOR_STEPS.VERIFICATION])
        setSelectedStep(CREATOR_STEPS.PAYMENT)
      }
    }

    if (router.query) step3Handler()
  }, [router.query])

  const onCustomizePageFinish = async () => {
    // Show modal
    setIsVerificationDialogOpen(true)
    setStepsDone((prev) => [...prev, CREATOR_STEPS.CUSTOMIZE])
    setSelectedStep(CREATOR_STEPS.VERIFICATION)

    const api = wrapApi(VerificationApi)
    const result = await api.canSubmitPersona()

    if (result) {
      await api.refreshPersonaVerifications()
      window.location.assign("/verification")
    }
  }

  const onPaymentFormPageFinish = async () => {
    setIsWelcomeModalOpen(true)

    // Make this async function for redirecting to verification screen
    return setTimeout(() => {
      setStepsDone((prev) => [...prev, CREATOR_STEPS.PAYMENT])
      setSelectedStep(CREATOR_STEPS.PAYMENT)
      // setIsWelcomeModalOpen(false)
      // Redirect
    }, 1000)
  }

  return (
    <div className="relative flex min-h-screen flex-1 bg-black">
      <div className="flex-shrink flex-grow bg-[#000]">
        <div className="cover-image h-[240px] sm:h-[300px]">
          <div className="flex h-full flex-col">
            <div className="flex h-16">{/* Moment Logo Here */}</div>
            <div className="flex flex-col items-center">
              <div className="text-4xl text-white ">Become a creator</div>
              <div className="wrap mt-6 flex w-4/5 max-w-screen-lg flex-row rounded-full bg-black">
                {Object.values(CREATOR_STEPS).map((step: string) => {
                  return (
                    <CreatorSteps
                      key={`item-${step}`}
                      isDone={stepsDone.includes(step)}
                      creatorStep={step}
                      isSelected={selectedStep === step}
                      setSelectedStep={() => setSelectedStep(step)}
                    />
                  )
                })}
              </div>
              <div className="hidden flex-row gap-1 sm:flex">
                {Object.values(CREATOR_STEPS).map((step) => {
                  return (
                    <BulletItem
                      key={`bullet-${step}`}
                      isSelected={selectedStep === step}
                      setSelectedStep={() => setSelectedStep(step)}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        </div>
        {selectedStep === CREATOR_STEPS.CUSTOMIZE && (
          <>
            {Number(width || 0) > 640 ? (
              <CustomizePageForm
                onCustomizePageFinish={onCustomizePageFinish}
              />
            ) : (
              <>
                {isVerificationDialogOpen ? (
                  <div className="p-4 text-xl font-bold text-white">
                    <div className="text-center">
                      Just a moment while we transfer you to the verification
                      screen...
                    </div>
                    <div className="flex max-w-full items-center justify-center p-8">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        alt=""
                        src="/pages/profile/creator-verification-loading.png"
                      />
                    </div>
                  </div>
                ) : (
                  <CustomizePageForm
                    onCustomizePageFinish={onCustomizePageFinish}
                  />
                )}
              </>
            )}
          </>
        )}

        {selectedStep === CREATOR_STEPS.PAYMENT && (
          <>
            {Number(width || 0) > 640 ? (
              <PaymentForm onPaymentFormPageFinish={onPaymentFormPageFinish} />
            ) : (
              <>
                {isWelcomeModalOpen ? (
                  <WelcomeToPasses />
                ) : (
                  <PaymentForm
                    onPaymentFormPageFinish={onPaymentFormPageFinish}
                  />
                )}
              </>
            )}
          </>
        )}
        {/* {selectedStep === CREATOR_STEPS.PAYMENT &&
          <PaymentForm
            onPaymentFormPageFinish={onPaymentFormPageFinish}
          />
        } */}
      </div>

      {Number(width || 0) > 640 && (
        <Modal
          isOpen={isVerificationDialogOpen}
          setOpen={setIsVerificationDialogOpen}
          closable={false}
          modalContainerClassname="w-auto sm:flex hidden"
        >
          <div className="text-xl font-bold text-white">
            <div className="flex h-[387px] w-[624px] items-center justify-center">
              <VerificationLoading />
            </div>
            <div className="text-center">
              Just a moment while we transfer you to the verification screen...
            </div>
          </div>
        </Modal>
      )}

      {Number(width || 0) > 640 && (
        <Modal
          isOpen={isWelcomeModalOpen}
          setOpen={setIsWelcomeModalOpen}
          closable={false}
          modalContainerClassname="w-auto sm:flex hidden"
        >
          <WelcomeToPasses />
        </Modal>
      )}
    </div>
  )
}

export default CreatorFlow
