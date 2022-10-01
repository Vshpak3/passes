import HashtagIcon from "public/icons/hashtag-icon.svg"
import InfoIcon from "public/icons/post-info-circle-icon.svg"
import DollarIcon from "public/icons/profile-dollar-icon.svg"
import React from "react"
import {
  FormInput,
  PassesPinkButton,
  PassesSectionTitle,
  PassFormCheckbox,
  PassFormError,
  PassNumberInput
} from "src/components/atoms"
import { FormContainer } from "src/components/organisms"
import { MediaFile } from "src/components/pages/profile/main-content/new-post/media"

const PassDirectMessage = ({ register }: any) => (
  <>
    <hr className="border-passes-dark-200" />
    <div className="mb-2">
      <PassesSectionTitle title="Direct messages" />
    </div>
    <PassFormCheckbox
      name="unlimited-dm-checkbox"
      register={register}
      label="Unlimited messages per month"
    />
    <div className="align-center flex items-center">
      <FormInput
        register={register}
        type="checkbox"
        name="free-dm-month-checkbox"
        label="Free DMs per month:"
        className="rounded border-gray-300 bg-gray-100 text-passes-primary-color focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
      />
      <div className="align-center ml-10 flex items-center justify-center">
        <FormInput
          register={register}
          type="number"
          name="free-dms-month"
          className="max-w-[140px] border-passes-dark-200 bg-transparent p-0 text-[#ffff]/90"
          placeholder="340"
          icon={<HashtagIcon />}
        />
      </div>
    </div>
  </>
)

const PassFile = ({ onRemove, file, gridLayout }: any) => (
  <div className={`col-span-12 ${gridLayout}`}>
    <MediaFile onRemove={onRemove} file={file} />
  </div>
)

const composeMediaGridLayout = (length: any, index: any) => {
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

const PassFilePreview = ({ files, onRemove }: any) => {
  const renderFilePreview = files.map((file: any, index: any) => {
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

const PassFileUpload = ({
  errors,
  fileUploadError,
  files,
  // maximumLimit = 1,
  onDragDropChange,
  onRemoveFileUpload,
  register
}: any) => {
  return (
    <div className="overflow-y-full h-full w-full items-center pb-2">
      <div className="mb-3">
        <PassesSectionTitle title="Upload an image" />
      </div>
      {files.length === 0 ? (
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
      ) : (
        <PassFilePreview files={files} onRemove={onRemoveFileUpload} />
      )}
      <div className="mt-4">
        <span className="text-[#ffff]/30">Upload Preview</span>
      </div>
      {fileUploadError && (
        <PassFormError className="mt-3" message={fileUploadError} />
      )}
    </div>
  )
}

const PassLifetimeOptions = ({ register }: any) => {
  return (
    <>
      <hr className="border-passes-dark-200" />
      <div className="grid grid-rows-2 gap-1">
        <PassNumberInput
          register={register}
          title="Total Supply"
          name="totalSupply"
        />
        <PassNumberInput
          register={register}
          title="Royalty Fees on re-sales"
          name="royalties"
          infoIcon
        />
        <PassNumberInput
          register={register}
          title="Cost per pass"
          name="passCost"
          infoIcon
        />
      </div>
    </>
  )
}

const PassRenewal = ({ register }: any) => (
  <div>
    <hr className="border-passes-dark-200" />
    <div className="my-4 grid grid-cols-1 grid-rows-2 items-center gap-4 md:grid-cols-3 md:grid-rows-1">
      <span className="text-lg font-bold text-[#ffff]/90 md:text-[15px] md:font-semibold ">
        Automatically renews every
      </span>
      <div className="grid grid-flow-col">
        <div className="align-items mx-3 flex w-[25px] items-center md:w-[30px]">
          <InfoIcon />
        </div>
        <div className="align-items flex w-fit items-center justify-start">
          <FormInput
            register={register}
            type="select"
            selectOptions={[]}
            name="royalty"
            className="w-[150px] border-passes-dark-200 bg-transparent p-0 text-left text-[#ffff]/90"
            placeholder="1 month"
          />
          <FormInput
            register={register}
            type="text"
            name="price"
            className="ml-2 w-full border-passes-dark-200 bg-transparent p-0 text-right text-[#ffff]/90"
            placeholder="0"
            icon={<DollarIcon />}
          />
        </div>
      </div>
    </div>
  </div>
)

const CreatePassOption = ({
  icon,
  title,
  subtitle,
  onGetStarted,
  colStyle
}: any) => {
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

export {
  CreatePassOption,
  PassDirectMessage,
  PassFileUpload,
  PassLifetimeOptions,
  PassRenewal
}
