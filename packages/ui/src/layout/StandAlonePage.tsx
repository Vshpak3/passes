import classNames from "classnames"
import PassesLogoPink from "public/icons/passes-logo-pink.svg"
import React, { FC, PropsWithChildren } from "react"

import { WithStandAlonePageLayoutOptions } from "./WithStandAlonePageLayout"

export const StandAlonePage: FC<
  PropsWithChildren<WithStandAlonePageLayoutOptions>
> = ({ className, children }) => (
  <div className="min-safe-h-screen relative w-full bg-passes-black pb-16 lg:pb-0">
    <div className="background-gradient fixed right-[0vw] top-[0vh] hidden h-[20vh] w-[20vh] blur-[10vh] md:block" />
    <div className="background-gradient fixed right-[5vw] top-[60vh] hidden h-[15vh] w-[15vh] blur-[13vh] md:block" />
    <div className="mx-auto block max-w-[3000px]">
      <div className="relative w-full grid-cols-10 md:grid">
        <main className="col-span-12 flex h-full w-full flex-col lg:col-span-12">
          <div className="m-auto flex flex-col justify-center text-center lg:my-10">
            <div className={classNames(className, "relative")}>
              <div className="modal-gradient absolute h-screen w-full max-w-full opacity-50 blur-[125px]" />
              <div className="relative flex w-full min-w-min max-w-full flex-col justify-center">
                <div className="flex w-full max-w-full flex-col items-center justify-center rounded-lg bg-passes-black/[0.6] pb-16">
                  <div className="flex w-full max-w-full flex-row justify-center pb-4 pt-6 lg:pt-12">
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
