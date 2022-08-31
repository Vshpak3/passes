import InfoIcon from "public/icons/post-info-circle-icon.svg"
import { Button, FormInput } from "src/components/atoms"

const PassFormError = ({ message, className = "" }) => (
  <div className={`text-md font-semibold text-[#ba3333] ${className}`}>
    {message}
  </div>
)

const PassFormCheckbox = ({ label, name, register }) => (
  <div className="my-3 flex items-center ">
    <FormInput
      register={register}
      type="checkbox"
      name={name}
      label={label}
      className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-passes-primary-color focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
    />
  </div>
)

const PassNumberInput = ({ register, title, name, infoIcon = false }) => (
  <div className="my-2 grid w-fit auto-cols-auto grid-flow-col grid-rows-1">
    <div className="align-items flex w-[100px] items-center md:w-[200px]">
      <span className="text-[#ffff]/70">{title}</span>
    </div>
    <div className="grid grid-flow-col">
      <div className="align-items mx-3 flex w-[25px] items-center md:w-[30px]">
        {infoIcon && <InfoIcon />}
      </div>
      <div className="align-items flex w-fit items-center justify-start">
        <FormInput
          register={register}
          type="number"
          name={name}
          placeholder="340"
          className="max-w-[140px] border-passes-dark-200 bg-transparent p-0 text-[#ffff]/90"
        />
      </div>
    </div>
  </div>
)

const PassesSectionTitle = ({ title }) => (
  <span className="mb-2 text-lg font-bold text-[#ffff]/90">{title}</span>
)

const CreatePassButton = ({ onCreateHandler }) => (
  <div className="align-end my-6 flex justify-end md:my-0">
    <Button
      className="w-full border-none !py-4 text-black transition-colors hover:bg-mauve-mauve12 hover:text-white md:w-[195px]"
      variant="pink"
      fontSize={16}
      onClick={onCreateHandler}
    >
      Create Pass
    </Button>
  </div>
)

const CreatePassHeader = ({ title }) => (
  <div className="col-span-12 sidebar-collapse:col-span-10">
    <div className="mb-4 grow justify-center text-center text-[20px] font-bold leading-[25px] md:text-[24px]">
      <span className="text-[#ffff]/90">{title}</span>
    </div>
  </div>
)

const PassDescriptionInput = ({ register, errors }) => (
  <>
    <PassesSectionTitle title="Add description" />
    <FormInput
      register={register}
      type="text"
      name="passDescription"
      className="m-0 w-full border-passes-dark-200 bg-transparent p-0 text-[#ffff]/90"
      placeholder="Type a caption here that describes the pass"
    />
    {errors.passDescription?.type === "required" && (
      <PassFormError message="Description is required" />
    )}
  </>
)

const PassNameInput = ({ register, errors }) => (
  <>
    <PassesSectionTitle title="Name this pass" />
    <FormInput
      register={register}
      type="text"
      name="passName"
      className="flex-grow-1 m-0 border-passes-dark-200 bg-transparent p-0 text-[#ffff]/90"
      placeholder="Name of your new pass!"
    />
    {errors.passName?.type === "required" && (
      <PassFormError message="Name is required" />
    )}
  </>
)

export {
  CreatePassButton,
  CreatePassHeader,
  PassDescriptionInput,
  PassesSectionTitle,
  PassFormCheckbox,
  PassFormError,
  PassNameInput,
  PassNumberInput
}
