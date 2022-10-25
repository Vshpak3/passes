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
import { FormContainer } from "src/components/organisms/FormContainer"
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
    // maximumLimit,
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
