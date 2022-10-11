import { RadioGroup } from "@headlessui/react"
import HashtagIcon from "public/icons/hashtag-icon.svg"
import InfoIcon from "public/icons/post-info-circle-icon.svg"
import DollarIcon from "public/icons/profile-dollar-icon.svg"
import React, { FC, MouseEvent } from "react"
import {
  DeepMap,
  FieldError,
  FieldValues,
  UseFormRegister
} from "react-hook-form"
import { PassesPinkButton } from "src/components/atoms/Button"
import { FormInput } from "src/components/atoms/FormInput"
import { IconTooltip } from "src/components/atoms/IconTooltip"
import {
  PassesSectionTitle,
  PassFormCheckbox,
  PassFormError,
  PassNumberInput
} from "src/components/atoms/passes/CreatePass"
import { FormContainer } from "src/components/organisms/FormContainer"
import { MediaFile } from "src/components/organisms/profile/main-content/new-post/media"

type FieldErrors<TFieldValues extends FieldValues = FieldValues> = DeepMap<
  TFieldValues,
  FieldError
>

interface PassProps {
  register: UseFormRegister<FieldValues>
  passValue?: string | null
  setPassValue?: (value: string | null) => void
  errors?: FieldErrors
}

interface PassFilesProps {
  files: File[]
  onRemove: (value: number) => void
}

interface PassFileProps {
  file: File
  onRemove: (e: MouseEvent<HTMLDivElement> | number) => void
  gridLayout: "col-span-12" | "md:col-span-6" | "md:col-span-4"
}

enum MessageTypesEnum {
  NUMBER = "numberMessages",
  UNLIMITED = "unlimitedMessages",
  NO_FREE_MESSAGE = "noFreeMessage"
}

export const PassDirectMessage: FC<PassProps> = ({
  register,
  setPassValue,
  passValue
}) => (
  <>
    <hr className="border-passes-dark-200" />
    <div className="mb-2">
      <PassesSectionTitle title="Direct messages" />
    </div>
    <RadioGroup value={passValue} onChange={setPassValue}>
      <RadioGroup.Option value={MessageTypesEnum.UNLIMITED}>
        {() => (
          <>
            <FormInput
              checked={passValue === MessageTypesEnum.UNLIMITED}
              register={register}
              label="Unlimited free messages"
              type="radio"
              name={MessageTypesEnum.UNLIMITED}
              labelClassName="text-left text-[16px] text-[#ffff]/90"
              className="h-[14px] w-[14px] rounded-[50%] border-gray-300 bg-gray-100 text-passes-primary-color focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
            />
          </>
        )}
      </RadioGroup.Option>
      <RadioGroup.Option value={MessageTypesEnum.NUMBER}>
        {() => (
          <>
            <div className="align-center flex items-center">
              <FormInput
                checked={passValue === MessageTypesEnum.NUMBER}
                register={register}
                label="Set number of free messages per month"
                type="radio"
                name={MessageTypesEnum.NUMBER}
                labelClassName="text-left text-[16px] text-[#ffff]/90"
                className="h-[14px] w-[14px] rounded-[50%] border-gray-300 bg-gray-100 text-passes-primary-color focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
              />
              <div className="align-center ml-10 flex items-center justify-center">
                <FormInput
                  register={register}
                  type="number"
                  name="free-dms-month"
                  className="max-w-[140px] border-passes-dark-200 bg-transparent p-0 pl-[60px] text-[#ffff]/90"
                  placeholder="0"
                  icon={<HashtagIcon />}
                />
              </div>
            </div>
          </>
        )}
      </RadioGroup.Option>
      <RadioGroup.Option value={MessageTypesEnum.NO_FREE_MESSAGE}>
        {() => (
          <>
            <FormInput
              checked={passValue === MessageTypesEnum.NO_FREE_MESSAGE}
              register={register}
              label="No free messages"
              type="radio"
              name={MessageTypesEnum.NO_FREE_MESSAGE}
              labelClassName="text-left text-[16px] text-[#ffff]/90"
              className="h-[14px] w-[14px] rounded-[50%] border-gray-300 bg-gray-100 text-passes-primary-color focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
            />
          </>
        )}
      </RadioGroup.Option>
    </RadioGroup>
  </>
)

const PassFile = ({ onRemove, file, gridLayout }: PassFileProps) => (
  <div className={`col-span-12 ${gridLayout}`}>
    <MediaFile
      isPassUpload
      className="ml-[30px]"
      contentHeight={200}
      contentWidth={130}
      onRemove={onRemove}
      file={file}
    />
  </div>
)

const composeMediaGridLayout = (length: number, index: number) => {
  switch (length) {
    case 1:
      return "col-span-12"
    case 2:
      return "md:col-span-6"
    case 4:
      return "md:col-span-6"
    case 3:
      return "md:col-span-6"
    case 5:
      return index === 0 || index === 1 ? "md:col-span-6" : "md:col-span-4"
    default:
      return "md:col-span-4"
  }
}

export const PassFilePreview: FC<PassFilesProps> = ({ files, onRemove }) => {
  const renderFilePreview = files.map((file: File, index: number) => {
    const gridLayout = composeMediaGridLayout(files.length, index)
    const onRemoveFile = () => onRemove(index)
    return (
      <PassFile
        key={`media_${index}`}
        onRemove={onRemoveFile}
        file={file}
        gridLayout={gridLayout}
      />
    )
  })

  return (
    <div className="min-h-[300px] w-full">
      <div className="flex grid h-full grid-cols-12 items-start justify-start gap-4">
        {files.length > 0 && renderFilePreview}
      </div>
    </div>
  )
}

interface PassFileUploadProps {
  errors: any
  fileUploadError: any
  files: any
  onDragDropChange: any
  onRemoveFileUpload: any
  register: any
  isPreview: any
}

export const PassFileUpload: FC<PassFileUploadProps> = ({
  errors,
  fileUploadError,
  files,
  onDragDropChange,
  onRemoveFileUpload,
  register,
  isPreview
}) => {
  return (
    <div className="overflow-y-full h-full w-full items-center pb-2">
      <div className="mb-3">
        <PassesSectionTitle title="Upload an image" />
      </div>
      {files.length ? (
        <>
          <PassFilePreview files={files} onRemove={onRemoveFileUpload} />
        </>
      ) : (
        <FormInput
          className="h-[200px]"
          register={register}
          name="passFile"
          type="drag-drop-file"
          multiple={true}
          accept={["image", "video"]}
          options={{ onChange: onDragDropChange }}
          errors={errors}
          // maximumLimit={maximumLimit}
        />
      )}
      {isPreview && (
        <div className="mt-4">
          <span className="text-[#ffff]/30">Upload Preview</span>
        </div>
      )}
      {fileUploadError && (
        <PassFormError className="mt-3" message={fileUploadError} />
      )}
    </div>
  )
}

export const PassLifetimeOptions: FC<PassProps> = ({ register, errors }) => {
  return (
    <>
      <hr className="border-passes-dark-200" />
      <div className="grid grid-rows-2 gap-1">
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
        <PassNumberInput
          register={register}
          title="Set amount of total supply"
          name="totalSupply"
          placeholder="0.00"
          className="pl-[50px]"
        />
        {errors?.royalties ||
          (errors?.totalSupply && (
            <PassFormError
              message={errors?.royalties.message || errors?.totalSupply.message}
            />
          ))}
      </div>
    </>
  )
}

export const PassRenewal = () => (
  <div>
    <hr className="border-passes-dark-200" />
    <div className="my-4 flex items-center gap-4">
      <IconTooltip
        Icon={InfoIcon}
        position="top"
        tooltipText="Renewal time can not be changed"
      />
      <span className="text-lg font-bold text-[#ffff]/90 md:text-[15px] md:font-semibold ">
        Automatically renews every 30 days
      </span>
    </div>
  </div>
)

export const PassPrice: FC<PassProps> = ({ register, errors }) => {
  return (
    <>
      <hr className="border-passes-dark-200" />
      <div className="align-items flex w-fit items-center justify-start">
        <span className="w-[250px] text-lg font-bold text-[#ffff]/90 md:text-[15px] md:font-semibold ">
          Set price of the pass
        </span>
        <FormInput
          register={register}
          type="text"
          name="price"
          className="ml-2 max-w-[140px] border-passes-dark-200 bg-transparent pr-[40px] text-right text-[#ffff]/90"
          placeholder="0.00"
          icon={<DollarIcon className="ml-[20px]" />}
          iconMargin="50"
        />
        {errors?.price?.type === "required" && (
          <PassFormError message="Price is required" />
        )}
      </div>
    </>
  )
}

export const PassFreeTrial: FC<PassProps> = ({ register, errors }) => {
  return (
    <div className="align-items flex w-fit items-center justify-start">
      <PassFormCheckbox
        label=""
        name="free-dm-month-checkbox"
        register={register}
      />
      <span className="w-[250px] text-lg font-bold text-[#ffff]/90 md:text-[15px] md:font-semibold ">
        Add free trial for first month
      </span>
      {errors?.price?.type === "free-dm-month-checkbox" && (
        <PassFormError message="Price is required" />
      )}
    </div>
  )
}

enum SupplyTypesEnum {
  UNLIMITED = "unlimited",
  TOTAL_SUPPLY = "totalSupply"
}

export const PassSupply: FC<PassProps> = ({
  register,
  errors,
  passValue,
  setPassValue
}) => {
  return (
    <>
      <hr className="border-passes-dark-200" />
      <div>
        <div className="mb-[20px]">
          <PassesSectionTitle title="Supply" />
        </div>
        <RadioGroup value={passValue} onChange={setPassValue}>
          <RadioGroup.Option value={SupplyTypesEnum.UNLIMITED}>
            {() => (
              <>
                <FormInput
                  checked={passValue === SupplyTypesEnum.UNLIMITED}
                  register={register}
                  label="Unlimited"
                  type="radio"
                  name={SupplyTypesEnum.UNLIMITED}
                  labelClassName="text-left text-[16px] text-[#ffff]/90"
                  className="h-[14px] w-[14px] rounded-[50%] border-gray-300 bg-gray-100 text-passes-primary-color focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                />
              </>
            )}
          </RadioGroup.Option>
          <RadioGroup.Option value={SupplyTypesEnum.TOTAL_SUPPLY}>
            <>
              <div className="align-center mt-[20px] flex items-center">
                <FormInput
                  checked={passValue === SupplyTypesEnum.TOTAL_SUPPLY}
                  register={register}
                  label="Set amount of total supply"
                  type="radio"
                  name={SupplyTypesEnum.TOTAL_SUPPLY}
                  labelClassName="text-left text-[16px] text-[#ffff]/90"
                  className="h-[14px] w-[14px] rounded-[50%] border-gray-300 bg-gray-100 text-passes-primary-color focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                />
                <div className="align-center ml-10 flex items-center justify-center">
                  <FormInput
                    register={register}
                    type="number"
                    name="totalSupply"
                    className="max-w-[140px] border-passes-dark-200 bg-transparent p-0 pl-[60px] text-[#ffff]/90"
                    placeholder="0"
                    icon={<HashtagIcon />}
                  />
                  {errors?.totalSupply?.type === "totalSupply" && (
                    <PassFormError message="Total supply is required" />
                  )}
                </div>
              </div>
            </>
          </RadioGroup.Option>
        </RadioGroup>
      </div>
    </>
  )
}

interface CreatePassOptionProps {
  icon: any
  title: any
  subtitle: any
  onGetStarted: any
  colStyle: any
}

export const CreatePassOption: FC<CreatePassOptionProps> = ({
  icon,
  title,
  subtitle,
  onGetStarted,
  colStyle
}) => {
  return (
    <div className={`col-span-12 space-y-6 ${colStyle} lg:max-w-[280px]`}>
      <FormContainer>
        <div className="mx-auto py-3">{icon}</div>
        <span className="mt-3 text-center text-[18px] font-bold text-[#ffff]/90">
          {title}
        </span>
        <span className="text-center text-[14px] text-[#ffff]/70">
          {subtitle}
        </span>
        <div className="mt-auto">
          <PassesPinkButton name="Get Started" onClick={onGetStarted} />
        </div>
      </FormContainer>
    </div>
  )
}
