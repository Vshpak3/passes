import { CSSProperties, useState } from "react"
import { Settings } from "react-slick"

interface IUseCarousel {
  length: number
}

export const useCarousel = ({ length }: IUseCarousel) => {
  const [slideIndex, setSlideIndex] = useState(0)
  const settings: Settings = {
    dots: true,
    infinite: true,
    swipeToSlide: true,
    slidesToShow: length,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 500,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ],
    appendDots: (dots) => {
      return <ul className="flex justify-center">{dots}</ul>
    },
    beforeChange: (prev, next) => setSlideIndex(next),
    customPaging: (i) => {
      const style: CSSProperties = {
        backgroundColor: "#ffffff20"
      }
      const activeStyle = {
        backgroundColor: "#C943A8"
      }
      return (
        <div
          className="slick-dot mb-2 inline-block h-[8px] w-[8px] rounded-full"
          style={i === slideIndex ? activeStyle : style}
        />
      )
    }
  }

  return { settings }
}
