import ChevronLeft from "public/icons/chevron-left-icon.svg"
import ChevronRight from "public/icons/chevron-right-icon.svg"
import React from "react"
import { Button } from "src/components/atoms"
import { formatCurrency } from "src/helpers"

export const Pass = ({ pass }) => {
  return (
    <div className="flex max-w-[280px] flex-shrink-0 flex-col items-start justify-center gap-3 p-0 py-5 md:max-w-[235px] md:py-0 md:pt-5">
      <PassInformation pass={pass} />
    </div>
  )
}

export const CarouselPass = ({ pass }) => (
  <div className="carousel-item w-fit snap-start">
    <div className="flex w-fit flex-shrink-0 flex-col items-center justify-center gap-3 break-all  p-0 py-5 sm:max-w-[235px] sm:items-start  md:py-0 md:pt-5">
      <PassInformation pass={pass} />
    </div>
  </div>
)

export const PassInformation = ({ pass }) => {
  return (
    <>
      <img // eslint-disable-line @next/next/no-img-element
        src={pass.imageUrl}
        className="rounded-[20px] object-cover"
        alt={pass.title}
      />
      <span className="text-center text-[16px] font-medium leading-[19px] text-[#ffff]">
        {pass.title}
      </span>
      <span className="text-[14px] font-medium leading-[23px]  text-[#ffff]/70">
        {pass.description}
      </span>
      {{
        Free: <Button variant="purple">Follow Free</Button>,
        Monthly: <Button variant="purple">Subscribe</Button>,
        Lifetime: <Button variant="purple">Subscribe</Button>
      }[pass.type] || null}
      {{
        Free: (
          <span className="text-[16px] font-medium leading-[19px]  text-[#ffff]">
            {pass.type}
          </span>
        ),
        Monthly: (
          <span className="flex items-center">
            <span className="text-[16px] font-medium leading-[19px]  text-[#ffff]">
              {formatCurrency(pass.price)}
            </span>
            <span className="pl-[6px] text-[14px] font-medium  leading-[23px] text-[#ffff]/70">
              /month
            </span>
          </span>
        ),
        Lifetime: (
          <span className="flex items-center">
            <span className="text-[16px] font-medium leading-[19px]  text-[#ffff]">
              {formatCurrency(pass.price)}
            </span>
            <span className="pl-[6px] text-[14px] font-medium  leading-[23px] text-[#ffff]/70">
              (23 out of 100 left)
            </span>
          </span>
        )
      }[pass.type] || null}
    </>
  )
}

export const CarouselButton = ({ onClick, isDisabled, right }) => (
  <button
    onClick={onClick}
    className="z-10 m-0 h-full p-0 text-center opacity-75 transition-all duration-300 ease-in-out hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-25"
    disabled={isDisabled(right ? "next" : "prev")}
  >
    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#504f57]/80  disabled:cursor-not-allowed ">
      {right ? <ChevronRight /> : <ChevronLeft />}
    </span>
  </button>
)
