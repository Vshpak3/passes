import classNames from "classnames"
import PassesLogoPink from "public/icons/passes-logo-pink.svg"
import React, { PropsWithChildren } from "react"

import { WithStandAlonePageLayoutOptions } from "./WithStandAlonePageLayout"

export const StandAlonePage = ({
  className,
  children
}: PropsWithChildren<WithStandAlonePageLayoutOptions>) => (
  <div className="min-safe-h-screen relative w-full bg-passes-black pb-16 lg:pb-0">
    <div className="background-gradient fixed right-[0vw] top-[0vh] hidden h-[20vh] w-[20vh] blur-[10vh] md:block" />
    <div className="background-gradient fixed right-[5vw] top-[60vh] hidden h-[15vh] w-[15vh] blur-[13vh] md:block" />
    <div className="mx-auto block max-w-[3000px]">
      <div className="relative w-full grid-cols-10 md:grid">
        <main className="col-span-12 flex h-full w-full flex-col lg:col-span-12">
          <div className="m-auto my-[5vh] flex flex-col justify-center text-center">
            <div className={classNames(className, "relative")}>
              <div className="modal-gradient absolute h-0 w-full max-w-full pt-[100%]" />
              <div className="relative flex w-full min-w-min max-w-full flex-col justify-center">
                <div className="flex w-full max-w-full flex-col items-center justify-center rounded-[8px] bg-[#18090E]/[0.75] pb-16">
                  <div className="flex w-full max-w-full flex-row justify-center px-16 pb-4 pt-16">
                    <PassesLogoPink className="mt-2 block h-[30x] w-[30px] fill-current" />
                  </div>
                  {children}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
)
