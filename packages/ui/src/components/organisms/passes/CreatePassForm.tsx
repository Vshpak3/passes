import { FC, useState } from "react"

import {
  CreatePassButton,
  CreatePassHeader,
  PassDescriptionInput,
  PassFormError,
  PassNameInput,
  PassNumberInput
} from "src/components/atoms/passes/CreatePass"
import { PassDirectMessage } from "src/components/molecules/pass/create/PassDirectMessage"
import { PassFileUpload } from "src/components/molecules/pass/create/PassFile"
import { PassFreeTrial } from "src/components/molecules/pass/create/PassFreeTrial"
import { PassLifetimeOptions } from "src/components/molecules/pass/create/PassLifetimeOptions"
import { PassPrice } from "src/components/molecules/pass/create/PassPrice"
import { PassRenewal } from "src/components/molecules/pass/create/PassRenewal"
import { PassSupply } from "src/components/molecules/pass/create/PassSupply"
import { ConfirmationDialog } from "src/components/organisms/ConfirmationDialog"
import { createPassSchema, useCreatePass } from "src/hooks/passes/useCreatePass"

interface CreatePassFormProps {
  passType: string
}

export const CreatePassForm: FC<CreatePassFormProps> = ({ passType }) => {
  const {
    errors,
    files,
    fileUploadError,
    isLifetimePass,
    isSubscriptionPass,
    onCreatePass,
    onDragDropChange,
    onRemoveFileUpload,
    register,
    getValues,
    trigger,
    isSubmitSuccessful
  } = useCreatePass(passType)
  const [massagesValue, setMassagesValue] = useState<string | null>(null)
  const [supplyValue, setSupplyValue] = useState<string | null>(null)
  const [showCreatePassConfirmationModal, setShowCreatePassConfirmationModal] =
    useState(false)

  const createPassHeader = `Create a new ${
    isSubscriptionPass ? "Subscription" : "Lifetime"
  } Pass`

  return (
    <div className="mx-auto mt-[-160px] grid grid-cols-10 justify-center gap-5 md:w-[653px] md:px-4 lg:w-[900px] lg:px-0">
      <CreatePassHeader title={createPassHeader} />
      {!isSubmitSuccessful && (
        <ConfirmationDialog
          desc="This pass can not be changed after it's created"
          isOpen={showCreatePassConfirmationModal}
          onClose={() => setShowCreatePassConfirmationModal(false)}
          onConfirm={onCreatePass}
          title="Are you sure?"
        />
      )}
      <div className="col-span-12 mx-auto w-[100%] lg:col-span-10 lg:max-w-[680px]">
        <div className="flex grow flex-col items-stretch gap-4 border-y-[0.5px] border-[#3A444C]/[0.64] p-5 sm:px-10 md:min-h-[400px] md:px-10 md:pt-5 lg:px-5">
          <PassNameInput errors={errors} register={register} />
          <PassFileUpload
            errors={errors}
            fileUploadError={fileUploadError}
            files={files}
            isPreview={false}
            onDragDropChange={onDragDropChange}
            onRemoveFileUpload={onRemoveFileUpload}
            register={register}
          />
          <PassDescriptionInput errors={errors} register={register} />
          <PassPrice errors={errors} register={register} />
          {isSubscriptionPass && (
            <PassNumberInput
              className="pl-[50px]"
              name="royalties"
              placeholder="0.00"
              register={register}
              suffix="%"
              title="Set royalties % on re-sales"
            />
          )}
          {errors.royalties && (
            <PassFormError
              message={(errors.royalties.message as string) || ""}
            />
          )}
          {isSubscriptionPass && (
            <PassFreeTrial errors={errors} register={register} />
          )}
          {isLifetimePass && (
            <PassLifetimeOptions errors={errors} register={register} />
          )}
          {isSubscriptionPass && (
            <PassSupply
              errors={errors}
              passValue={supplyValue}
              register={register}
              setPassValue={setSupplyValue}
            />
          )}
          <PassDirectMessage
            passValue={massagesValue}
            register={register}
            setPassValue={setMassagesValue}
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
        </div>
      </div>
    </div>
  )
}
