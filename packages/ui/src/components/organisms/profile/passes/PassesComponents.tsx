import { PassDto, PassDtoTypeEnum } from "@passes/api-client"
import React, { FC } from "react"
import { Button } from "src/components/atoms/Button"
import { formatCurrency } from "src/helpers/formatters"

import { PaymentModalInfo } from "./PassTypes"

type TOpenPassModal = React.Dispatch<
  React.SetStateAction<PaymentModalInfo | null>
>
interface PassItemProps {
  pass: PassDto
  setModalOpen: TOpenPassModal
}

function getPassButton(pass: PassDto, setModalOpen: TOpenPassModal) {
  switch (pass.type) {
    case PassDtoTypeEnum.Subscription:
      return (
        <Button variant="purple" onClick={() => setModalOpen(pass)}>
          Subscribe
        </Button>
      )
    case PassDtoTypeEnum.Lifetime:
      if (pass.price === 0) {
        return <Button variant="purple">Follow Free</Button>
      }
      return (
        <Button variant="purple" onClick={() => setModalOpen(pass)}>
          Lifetime
        </Button>
      )
    case PassDtoTypeEnum.External: // TBD
    default:
      return null
  }
}
function getPassPrice(pass: PassDto) {
  switch (pass.type) {
    case PassDtoTypeEnum.Subscription:
      return (
        <span className="flex items-center">
          <span className="text-[16px] font-medium leading-[19px]  text-[#ffff]">
            {formatCurrency(pass.price)}
          </span>
          <span className="pl-[6px] text-[14px] font-medium leading-[23px] text-[#ffff]/70">
            /month
          </span>
        </span>
      )
    case PassDtoTypeEnum.Lifetime:
      if (pass.price === 0) {
        return (
          <span className="text-[16px] font-medium leading-[19px]  text-[#ffff]">
            {pass.type}
          </span>
        )
      }
      return (
        <span className="flex items-center">
          <span className="text-[16px] font-medium leading-[19px]  text-[#ffff]">
            {formatCurrency(pass.price)}
          </span>
          <span className="pl-[6px] text-[14px] font-medium leading-[23px] text-[#ffff]/70">
            ({pass.remainingSupply} out of {pass.totalSupply} left)
          </span>
        </span>
      )
    default:
      return null
  }
}

export const PassCardMobile: FC<PassItemProps> = ({ pass, setModalOpen }) => (
  <div className="carousel-item relative flex h-[300px] flex-col items-center justify-items-center">
    {"todo-PASS-532" && (
      <img
        src={"todo-PASS-532"}
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

export const PassCardDesktop: FC<PassItemProps> = ({ pass, setModalOpen }) => {
  return (
    <div className="flex max-w-[280px] flex-shrink-0 flex-col items-start justify-center gap-3 p-0 py-5 md:max-w-[235px] md:py-0 md:pt-5">
      <img
        src={"todo-PASS-532"}
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
