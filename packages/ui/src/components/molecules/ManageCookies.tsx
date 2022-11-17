import { FC, useRef } from "react"
import { useForm } from "react-hook-form"

import { Button, ButtonTypeEnum } from "src/components/atoms/button/Button"
import { PassFormCheckbox } from "src/components/atoms/passes/CreatePass"
import { Dialog } from "src/components/organisms/Dialog"
import { acceptAllCookies, CookiesProps } from "src/helpers/CookieHelpers"
import { useOnClickOutside } from "src/hooks/useOnClickOutside"

interface ManageCookiesProps {
  isOpen: boolean
  onClose(): void
  onSetCookies: (values: CookiesProps) => void
}

export const ManageCookiesModal: FC<ManageCookiesProps> = ({
  isOpen,
  onClose,
  onSetCookies
}) => {
  const { register, handleSubmit, getValues } = useForm({
    defaultValues: acceptAllCookies
  })

  const modalContentRef = useRef(null)

  useOnClickOutside(modalContentRef, () => {
    onClose()
  })

  const setCookies = () => {
    const values = getValues()
    onSetCookies(values)
    onClose()
  }

  return (
    <Dialog
      className="border border-white/10 bg-[#191A1F] px-6 py-5 md:min-w-[500px] md:max-w-[600px] md:rounded-md"
      onClose={onClose}
      open={isOpen}
    >
      <div
        className="m-auto w-[298px] bg-[#191A1F] md:w-auto md:min-w-[500px] md:max-w-[600px] md:border-white/10"
        id="popup-modal"
      >
        <form
          className="flex flex-col items-start justify-start"
          onSubmit={handleSubmit(setCookies)}
        >
          <span className="w-full border-b border-[#3a444c]/30 pb-4 text-xl font-bold text-white">
            Cookie preferences
          </span>
          <p className="pt-4 text-justify text-sm font-normal text-[#9D9D9D]">
            The use of the following cookies is not required to visit or browse
            our website, except for those that we use to provide the content and
            functionality of this site (strictly necessary cookies). Blocking
            some types of cookies may impact your experience of the website and
            the services we are able to offer. By clicking on the ACCEPT buttons
            listed in the options below, you consent to our use of the
            associated category of cookie. Read our Cookie Notice for more
            information.
          </p>
          <div className="flex flex-col items-start pt-6">
            <span className="text-base font-bold text-white">
              Manage Cookies:
            </span>
            <div className="flex pt-3">
              <div className="md:pr-12">
                <PassFormCheckbox
                  disabled
                  label="Strictly Necessary Cookies"
                  name="necessary"
                  register={register}
                />
                <PassFormCheckbox
                  label="Performance Cookies"
                  name="performance"
                  register={register}
                />
              </div>
              <div>
                <PassFormCheckbox
                  label="Functional Cookies"
                  name="functional"
                  register={register}
                />

                <PassFormCheckbox
                  label="Targeting Cookies"
                  name="targeting"
                  register={register}
                />
              </div>
            </div>
          </div>
          <div className="flex w-full pt-5">
            <Button
              className="w-full rounded-[5px] py-[9px]"
              fontSize={16}
              type={ButtonTypeEnum.SUBMIT}
            >
              <span className="text-base font-bold text-white">
                Save and Accept
              </span>
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  )
}
