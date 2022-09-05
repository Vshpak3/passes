import { PassDto } from "@passes/api-client"
import React from "react"
import { Button } from "src/components/atoms"
import { formatCurrency } from "src/helpers"

import { PaymentModalInfo } from "./PassTypes"

type TOpenPassModal = React.Dispatch<
  React.SetStateAction<PaymentModalInfo | null>
>
interface IPassItem {
  pass: PassDto
  setModalOpen: TOpenPassModal
}

function getPassButton(pass: PassDto, setModalOpen: TOpenPassModal) {
  switch (pass.type) {
    case "free":
      return <Button variant="purple">Follow Free</Button>
    case "subscription":
      return (
        <Button variant="purple" onClick={() => setModalOpen(pass)}>
          Subscribe
        </Button>
      )
    case "lifetime":
      return (
        <Button variant="purple" onClick={() => setModalOpen(pass)}>
          Lifetime
        </Button>
      )
    default:
      return null
  }
}
function getPassPrice(pass: PassDto) {
  switch (pass.type) {
    case "free":
      return (
        <span className="text-[16px] font-medium leading-[19px]  text-[#ffff]">
          {pass.type}
        </span>
      )
    case "subscription":
      return (
        <span className="flex items-center">
          <span className="text-[16px] font-medium leading-[19px]  text-[#ffff]">
            {formatCurrency(pass.price)}
          </span>
          <span className="pl-[6px] text-[14px] font-medium  leading-[23px] text-[#ffff]/70">
            /month
          </span>
        </span>
      )
    case "lifetime":
      return (
        <span className="flex items-center">
          <span className="text-[16px] font-medium leading-[19px]  text-[#ffff]">
            {formatCurrency(pass.price)}
          </span>
          <span className="pl-[6px] text-[14px] font-medium  leading-[23px] text-[#ffff]/70">
            (23 out of 100 left)
          </span>
        </span>
      )
    default:
      return null
  }
}

export const PassCardMobile = ({ pass, setModalOpen }: IPassItem) => (
  <div className="carousel-item relative flex h-[300px] flex-col items-center justify-items-center">
    {pass.imageUrl && (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={pass.imageUrl}
        alt={pass.title}
        className="rounded-[20px] object-cover"
      />
    )}
    <div className="flex">
      <span className="mt-6 text-center text-[16px] font-medium leading-[19px] text-[#ffff] lg:mt-2 lg:text-start">
        {pass.title}
      </span>
    </div>
    <div className="mt-2 max-w-[280px] text-center line-clamp-3">
      <span className="text-[14px] font-medium leading-[23px] text-[#ffff]/70 md:max-w-[350px] lg:text-start">
        {pass.description}
      </span>
    </div>
    {getPassButton(pass, setModalOpen)}
    {getPassPrice(pass)}
  </div>
)

export const PassCardDesktop = ({ pass, setModalOpen }: IPassItem) => {
  return (
    <div className="flex max-w-[280px] flex-shrink-0 flex-col items-start justify-center gap-3 p-0 py-5 md:max-w-[235px] md:py-0 md:pt-5">
      <img // eslint-disable-line @next/next/no-img-element
        src={pass.imageUrl}
        className="rounded-[20px] object-cover"
        alt={pass.title}
      />
      <div className="flex flex-col">
        <p className="mt-6 text-center text-[16px] font-medium leading-[19px] text-[#ffff] lg:mt-2 lg:text-start">
          {pass.title}
        </p>
        <br />
        <p className="max-w-[250px] break-normal text-center text-[14px] font-medium leading-[23px] text-[#ffff]/70 md:max-w-[350px] lg:text-start">
          {pass.description}
        </p>
      </div>
      {getPassButton(pass, setModalOpen)}
      {getPassPrice(pass)}
    </div>
  )
}
