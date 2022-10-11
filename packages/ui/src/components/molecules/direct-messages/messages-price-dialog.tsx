import classNames from "classnames"
import React, { Dispatch, SetStateAction } from "react"
import { FormInput } from "src/components/atoms/FormInput"
import { Dialog } from "src/components/organisms/Dialog"

interface IMessagesPriceDialog {
  register: any
  setHasPrice: Dispatch<SetStateAction<any>>
  onTargetAcquired: () => void
  postPrice: any
}
export const MessagesPriceDialog = ({
  register,
  setHasPrice,
  onTargetAcquired,
  postPrice
}: IMessagesPriceDialog) => {
  return (
    <Dialog
      className="flex w-screen transform flex-col items-center justify-center border border-[#ffffff]/10 bg-[#0c0609] px-[29px] py-5 transition-all md:max-w-[544px] md:rounded-[20px]"
      open={true}
      title={
        <div>
          <div className="relative h-full">
            <div className="flex flex-col items-start justify-start gap-3">
              <div>POST PRICE</div>
              <div className="flex w-full items-center justify-center rounded-md shadow-sm">
                <FormInput
                  register={register}
                  type="text"
                  name="postPrice"
                  placeholder={"Minimum $3 USD or free"}
                  className="w-full rounded-md border-passes-dark-200 bg-[#100C11]  pl-4 text-base font-bold text-[#ffffff]/90 focus:border-passes-dark-200 focus:ring-0 "
                />
              </div>
              <div className="flex w-full items-end justify-end gap-3">
                <button
                  className="rounded-full bg-passes-secondary-color py-2 px-6"
                  type="button"
                  onClick={() => setHasPrice(false)}
                >
                  Cancel
                </button>
                <button
                  className={classNames(
                    !(postPrice > 10) ? "opacity-50" : "",
                    "rounded-full bg-passes-secondary-color py-2 px-6"
                  )}
                  type="button"
                  onClick={() => onTargetAcquired()}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    ></Dialog>
  )
}
