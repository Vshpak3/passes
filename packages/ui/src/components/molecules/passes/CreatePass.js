import HashtagIcon from "public/icons/hashtag-icon.svg"
import InfoIcon from "public/icons/post-info-circle-icon.svg"
import DollarIcon from "public/icons/profile-dollar-icon.svg"
import React from "react"
import {
  FormInput,
  PassesPinkButton,
  PassesSectionTitle,
  PassFormCheckbox,
  PassNumberInput
} from "src/components/atoms"
import { FormContainer } from "src/components/organisms"
import { MediaFile } from "src/components/pages/profile/main-content/new-post/media"
import { composeMediaGridLayout } from "src/helpers"

const PassDirectMessage = ({ register }) => (
  <>
    <hr className="border-[#2C282D]" />
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
        className="rounded border-gray-300 bg-gray-100 text-[#9C4DC1] focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
      />
      <div className="align-center ml-10 flex items-center justify-center">
        <FormInput
          register={register}
          type="number"
          name="free-dms-month"
          className="max-w-[140px] border-[#2C282D] bg-transparent p-0 text-[#ffff]/90"
          placeholder="340"
          icon={<HashtagIcon />}
        />
      </div>
    </div>
  </>
)

const PassFile = ({ onRemove, file, gridLayout }) => (
  <div className={`col-span-12 ${gridLayout}`}>
    <MediaFile onRemove={onRemove} file={file} />
  </div>
)

const PassFilePreview = ({ files, onRemove }) => {
  const renderFilePreview = files.map((file, index) => {
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
  files,
  register,
  onDragDropChange,
  errors,
  onRemove,
  maximumLimit = 1
}) => {
  return (
    <div className="overflow-y-full h-full w-full items-center pb-5">
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
          maximumLimit={maximumLimit}
        />
      ) : (
        <PassFilePreview files={files} onRemove={onRemove} />
      )}
      <div className="mt-4">
        <span className="text-[#ffff]/30">Upload Preview</span>
      </div>
    </div>
  )
}

const PassLifetimeOptions = ({ register }) => {
  return (
    <>
      <hr className="border-[#2C282D]" />
      <div className="grid grid-rows-2 gap-1">
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

const PassRenewal = ({ register }) => (
  <div>
    <hr className="border-[#2C282D]" />
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
            selectOptions={["test", "test2"]}
            name="royalty"
            className="w-[150px] border-[#2C282D] bg-transparent p-0 text-left text-[#ffff]/90"
            placeholder="1 month"
          />
          <FormInput
            register={register}
            type="text"
            name="price"
            className="ml-2 w-full border-[#2C282D] bg-transparent p-0 text-right text-[#ffff]/90"
            placeholder="0"
            icon={<DollarIcon />}
          />
        </div>
      </div>
    </div>
  </div>
)

const PassUnlockTier = ({ register }) => (
  <>
    <hr className="border-[#2C282D]" />
    <div className="my-4">
      <PassesSectionTitle title="What does this tier of pass unlock?" />
      <PassFormCheckbox
        name="all-media-access"
        label="All Media"
        register={register}
      />
      <PassFormCheckbox
        name="all-stories-access"
        label="All Stories"
        register={register}
      />
      <PassFormCheckbox
        name="all-stream-access"
        label="All Live streams"
        register={register}
      />
      <PassFormCheckbox
        name="all-photos-access"
        label="All Photos"
        register={register}
      />
      <PassFormCheckbox
        name="all-videos-access"
        label="All Videos"
        register={register}
      />
    </div>
  </>
)

const CreatePassOption = ({
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

export {
  CreatePassOption,
  PassDirectMessage,
  PassFileUpload,
  PassLifetimeOptions,
  PassRenewal,
  PassUnlockTier
}
