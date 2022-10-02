import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

import { PassDto } from "@passes/api-client"
import React from "react"
import Slider from "react-slick"
import { useCarousel } from "src/hooks/useCarousel"

import { PassCardDesktop, PassCardMobile } from "./PassesComponents"
interface IPasses {
  creatorPasses: PassDto[] | undefined
}
interface IPassType {
  creatorPasses: PassDto[] | undefined
  setModalOpen: React.Dispatch<React.SetStateAction<PaymentModalInfo | null>>
}

export interface PaymentModalInfo {
  passId: string
  price: number
  title: string
}

const PassTypesDesktop = ({ creatorPasses, setModalOpen }: IPassType) => {
  return (
    <div className="hidden items-center rounded-[20px] border border-[#ffffff]/10 bg-[#1b141d]/50 px-[17px] py-[22px] pt-[19px] backdrop-blur-[100px] lg:m-0 lg:flex lg:flex-col lg:items-center">
      <span className="mb-5 text-base font-bold text-[#ffff]/90 lg:mb-0 lg:self-start">
        Pass Types
      </span>
      <div className="overflow-x-none relative mx-0 mt-4 flex flex-col items-start">
        {creatorPasses?.map((pass, index) => (
          <PassCardDesktop
            key={index}
            pass={pass}
            setModalOpen={setModalOpen}
          />
        ))}
      </div>
    </div>
  )
}

const PassTypesMobile = ({ creatorPasses, setModalOpen }: IPassType) => {
  const length = creatorPasses?.length ?? 0
  const { settings } = useCarousel({ length })

  return (
    <div className="w-50 rounded-[20px] border border-[#ffffff]/10 bg-[#1b141d]/50 pt-4 pb-8 backdrop-blur-[100px] lg:hidden">
      <div className="align-center flex items-center justify-center pb-4">
        <span className="text-center text-base font-bold text-[#ffff]/90">
          Pass Types
        </span>
      </div>
      {creatorPasses && (
        <Slider {...settings}>
          {creatorPasses?.map((pass, index) => {
            return (
              <PassCardMobile
                key={index}
                pass={pass}
                setModalOpen={setModalOpen}
              />
            )
          })}
        </Slider>
      )}
    </div>
  )
}

const PassTypes = ({ creatorPasses }: IPasses) => {
  return (
    <>
      <PassTypesDesktop
        creatorPasses={creatorPasses}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        setModalOpen={() => {}}
      />
      <PassTypesMobile
        creatorPasses={creatorPasses}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        setModalOpen={() => {}}
      />
    </>
  )
}

export default PassTypes
