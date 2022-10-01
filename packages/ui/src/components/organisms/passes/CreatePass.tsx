import { useRouter } from "next/router"
import LimitedEditionImg from "public/icons/limited-edition-pass.svg"
import SubscriptionImg from "public/icons/subscription-pass.svg"
import React from "react"
import {
  CreatePassButton,
  CreatePassHeader,
  PassDescriptionInput,
  PassNameInput
} from "src/components/atoms"
import {
  CreatePassOption,
  PassDirectMessage,
  PassFileUpload,
  PassLifetimeOptions,
  PassRenewal
} from "src/components/molecules"
import { useCreatePass } from "src/hooks"
import { PassTypeEnum } from "src/hooks/useCreatePass"

import FormContainer from "../FormContainer"

const CREATE_PASS_URL = "/tools/manage-passes/create"

const SelectPassType = ({ initialCreation = false }) => {
  const router = useRouter()
  const createPassTitle = `Create a Pass${
    initialCreation ? " to get started" : ""
  }`
  const redirectToCreatePass = (type: any) => () =>
    router.push(`${CREATE_PASS_URL}?passType=${type}`)

  return (
    <div className="mx-auto -mt-[160px] grid w-full max-w-[1000px] grid-cols-10 justify-center gap-5 px-4 lg:px-0">
      <CreatePassHeader title={createPassTitle} />
      <CreatePassOption
        colStyle="lg:col-[3_/_span_3]"
        icon={<SubscriptionImg />}
        title="Subscription"
        subtitle="Subscription Passes are unlimited in quantity and can be paid for
            by fans on a recurring basis before they expire."
        onGetStarted={redirectToCreatePass(PassTypeEnum.SUBSCRIPTION)}
      />
      <CreatePassOption
        colStyle="lg:col-[6_/_span_3]"
        icon={<LimitedEditionImg />}
        title="Lifetime Passes"
        subtitle="Lifetime Passes are limited in quantity which means once they
            sell out they can only be bought on the secondary market. Fans
            can make a one-time payment to buy these."
        onGetStarted={redirectToCreatePass(PassTypeEnum.LIFETIME)}
      />
    </div>
  )
}

const CreatePassForm = ({ passType }: any) => {
  const {
    errors,
    files,
    fileUploadError,
    isLifetimePass,
    isSubscriptionPass,
    maximumLimit,
    onCreatePass,
    onDragDropChange,
    onRemoveFileUpload,
    register
  } = useCreatePass({ passType })

  const createPassHeader = `Create a new ${
    isSubscriptionPass ? "Subscription" : "Lifetime"
  } Pass`

  return (
    <div className="mx-auto -mt-[160px] grid grid-cols-10 justify-center gap-5 md:w-[653px] md:px-4 lg:w-[900px] lg:px-0 sidebar-collapse:w-[1000px]">
      <CreatePassHeader title={createPassHeader} />
      <div className="col-span-12 mx-auto w-[100%] lg:col-span-10 lg:max-w-[680px]">
        <FormContainer>
          <PassNameInput errors={errors} register={register} />
          <PassFileUpload
            errors={errors}
            files={files}
            fileUploadError={fileUploadError}
            maximumLimit={maximumLimit}
            onDragDropChange={onDragDropChange}
            onRemoveFileUpload={onRemoveFileUpload}
            register={register}
          />
          <PassDescriptionInput register={register} errors={errors} />
          {isLifetimePass && <PassLifetimeOptions register={register} />}
          <PassDirectMessage register={register} />
          {isSubscriptionPass && <PassRenewal register={register} />}
          <CreatePassButton onCreateHandler={onCreatePass} />
        </FormContainer>
      </div>
    </div>
  )
}

export { CreatePassForm, SelectPassType }
