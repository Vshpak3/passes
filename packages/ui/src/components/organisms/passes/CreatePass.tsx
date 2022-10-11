import { useRouter } from "next/router"
import LimitedEditionImg from "public/icons/limited-edition-pass.svg"
import SubscriptionImg from "public/icons/subscription-pass.svg"
import { FC, useState } from "react"
import {
  CreatePassButton,
  CreatePassHeader,
  PassDescriptionInput,
  PassFormError,
  PassNameInput,
  PassNumberInput
} from "src/components/atoms/passes/CreatePass"
import {
  CreatePassOption,
  PassDirectMessage,
  PassFileUpload,
  PassFreeTrial,
  PassLifetimeOptions,
  PassPrice,
  PassRenewal,
  PassSupply
} from "src/components/molecules/pass/CreatePass"
import { ConfirmationDialog } from "src/components/organisms/ConfirmationDialog"
import { FormContainer } from "src/components/organisms/FormContainer"
import {
  createPassSchema,
  PassTypeEnum,
  useCreatePass
} from "src/hooks/useCreatePass"

interface CreatePassFormProps {
  passType: string
}

const CREATE_PASS_URL = "/tools/manage-passes/create"

export const SelectPassType = ({ initialCreation = false }) => {
  const router = useRouter()
  const createPassTitle = `Create a Pass${
    initialCreation ? " to get started" : ""
  }`
  const redirectToCreatePass = (type: string) => () =>
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

export const CreatePassForm: FC<CreatePassFormProps> = ({ passType }) => {
  const {
    errors,
    files,
    fileUploadError,
    isLifetimePass,
    isSubscriptionPass,
    // maximumLimit,
    onCreatePass,
    onDragDropChange,
    onRemoveFileUpload,
    register,
    getValues,
    trigger,
    isSubmitSuccessful
  } = useCreatePass({ passType })
  const [massagesValue, setMassagesValue] = useState<string | null>(null)
  const [supplyValue, setSupplyValue] = useState<string | null>(null)
  const [showCreatePassConfirmationModal, setShowCreatePassConfirmationModal] =
    useState(false)

  const createPassHeader = `Create a new ${
    isSubscriptionPass ? "Subscription" : "Lifetime"
  } Pass`

  return (
    <div className="mx-auto -mt-[160px] grid grid-cols-10 justify-center gap-5 md:w-[653px] md:px-4 lg:w-[900px] lg:px-0 sidebar-collapse:w-[1000px]">
      <CreatePassHeader title={createPassHeader} />
      {!isSubmitSuccessful && (
        <ConfirmationDialog
          title="Are you sure?"
          desc="This pass can not be changed after it's created"
          isOpen={showCreatePassConfirmationModal}
          onClose={() => setShowCreatePassConfirmationModal(false)}
          onConfirm={onCreatePass}
        />
      )}
      <div className="col-span-12 mx-auto w-[100%] lg:col-span-10 lg:max-w-[680px]">
        <FormContainer>
          <PassNameInput errors={errors} register={register} />
          <PassFileUpload
            errors={errors}
            files={files}
            fileUploadError={fileUploadError}
            // maximumLimit={maximumLimit}
            onDragDropChange={onDragDropChange}
            onRemoveFileUpload={onRemoveFileUpload}
            register={register}
            isPreview={false}
          />
          <PassDescriptionInput register={register} errors={errors} />
          <PassPrice register={register} errors={errors} />
          {isSubscriptionPass && (
            <PassNumberInput
              suffix="%"
              register={register}
              // errors={errors}
              title="Set royalties % on re-sales"
              name="royalties"
              placeholder="0.00"
              className="pl-[50px]"
              // infoIcon
            />
          )}
          {errors.royalties && (
            <PassFormError
              message={(errors.royalties.message as string) || ""}
            />
          )}
          {isSubscriptionPass && (
            <PassFreeTrial register={register} errors={errors} />
          )}
          {isLifetimePass && (
            <PassLifetimeOptions register={register} errors={errors} />
          )}
          {isSubscriptionPass && (
            <PassSupply
              register={register}
              errors={errors}
              setPassValue={setSupplyValue}
              passValue={supplyValue}
            />
          )}
          <PassDirectMessage
            register={register}
            setPassValue={setMassagesValue}
            passValue={massagesValue}
          />
          {isSubscriptionPass && <PassRenewal />}
          <CreatePassButton
            isDisabled={isSubmitSuccessful}
            onCreateHandler={() => {
              createPassSchema
                .validate(getValues())
                .then(() => {
                  setShowCreatePassConfirmationModal(true)
                  return ""
                })
                .catch(() => {
                  trigger()
                })
            }}
          />
        </FormContainer>
      </div>
    </div>
  )
}
