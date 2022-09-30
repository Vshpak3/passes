import {
  GetCreatorVerificationStepResponseDtoStepEnum,
  VerificationApi
} from "@passes/api-client"
import { differenceInYears } from "date-fns"
import { useRouter } from "next/router"
import VerificationLoading from "public/pages/profile/creator-verification-loading.svg"
import { useCallback, useEffect, useLayoutEffect, useState } from "react"
import WelcomeToPasses from "src/components/organisms/creator-flow/WelcomePasses"
import Modal from "src/components/organisms/Modal"
import CustomizePageForm from "src/components/pages/creator-flow/CustomizePageForm"
import PaymentForm from "src/components/pages/creator-flow/PaymentForm"
import PersonaVerification from "src/components/pages/creator-flow/PersonaVerification"
import { MIN_CREATOR_AGE_IN_YEARS } from "src/config/constants"
import { CREATOR_STEPS } from "src/configurations/constants"
import { useWindowSize } from "src/hooks/useWindowSizeHook"

import BulletItem from "../../components/atoms/BulletItem"
import CreatorSteps from "../../components/molecules/creator-flow/CreatorSteps"
import { useUser } from "../../hooks"

const api = new VerificationApi()

const CreatorFlow = () => {
  const { user } = useUser()
  const router = useRouter()

  const [stepsDone, setStepsDone] = useState<string[]>([])
  const [selectedStep, setSelectedStep] = useState<string>(
    CREATOR_STEPS.CUSTOMIZE
  )
  const [isVerificationDialogOpen, setIsVerificationDialogOpen] =
    useState<boolean>(false)
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState<boolean>(false)
  const { width } = useWindowSize()

  const onCustomizePageFinish = async () => {
    // Show modal
    setIsVerificationDialogOpen(true)
    setStepsDone((prev) => [...prev, CREATOR_STEPS.CUSTOMIZE])

    try {
      await api.submitCreatorVerificationStep({
        submitCreatorVerificationStepRequestDto: {
          step: GetCreatorVerificationStepResponseDtoStepEnum._1Profile
        }
      })
      setSelectedStep(CREATOR_STEPS.VERIFICATION)
    } catch (err) {
      console.error(err)
    }
  }

  const onFinishPersonaVerification = useCallback(async () => {
    await api.submitCreatorVerificationStep({
      submitCreatorVerificationStepRequestDto: {
        step: GetCreatorVerificationStepResponseDtoStepEnum._2Kyc
      }
    })
    setSelectedStep(CREATOR_STEPS.PAYMENT)
    setStepsDone((prev) => [...prev, CREATOR_STEPS.VERIFICATION])
  }, [])

  const onPaymentFormPageFinish = async () => {
    await api.submitCreatorVerificationStep({
      submitCreatorVerificationStepRequestDto: {
        step: GetCreatorVerificationStepResponseDtoStepEnum._3Payout
      }
    })
    finishFormHandler()
  }

  const finishFormHandler = () => {
    setIsWelcomeModalOpen(true)
    setStepsDone((prev) => [...prev, CREATOR_STEPS.PAYMENT])
    setSelectedStep(CREATOR_STEPS.PAYMENT)
  }

  useLayoutEffect(() => {
    if (user) {
      const userAge = user.birthday
        ? differenceInYears(new Date(), new Date(user.birthday))
        : 0

      const authorizeUser = userAge >= MIN_CREATOR_AGE_IN_YEARS

      if (!authorizeUser && typeof window !== "undefined") {
        router.push("/home")
      }
    }
  }, [user, router])

  useEffect(() => {
    const stepHandler = async () => {
      const result = await api.getCreatorVerificationStep()
      const step = result.step

      if (step === GetCreatorVerificationStepResponseDtoStepEnum._2Kyc) {
        setStepsDone([CREATOR_STEPS.CUSTOMIZE])
        setIsVerificationDialogOpen(true)
        setSelectedStep(CREATOR_STEPS.VERIFICATION)
      }

      if (step === GetCreatorVerificationStepResponseDtoStepEnum._3Payout) {
        setStepsDone([CREATOR_STEPS.CUSTOMIZE, CREATOR_STEPS.VERIFICATION])
        setSelectedStep(CREATOR_STEPS.PAYMENT)
      }

      if (step === GetCreatorVerificationStepResponseDtoStepEnum._4Done) {
        finishFormHandler()
      }
    }

    stepHandler()
  }, [])

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

        <PersonaVerification
          showPersonaModal={selectedStep === CREATOR_STEPS.VERIFICATION}
          onFinishPersonaVerification={onFinishPersonaVerification}
        />

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
          modalContainerClassname="!w-auto sm:flex hidden rounded-[20px] bg-[#1B141D]/50 backdrop-blur-[50px]"
        >
          <div className="px-[72px] py-[95px] text-xl font-bold text-white">
            <div className="flex max-w-[624px] items-center justify-center">
              <VerificationLoading />
            </div>
            <div className="mx-auto mt-3 max-w-[472px] text-center">
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
