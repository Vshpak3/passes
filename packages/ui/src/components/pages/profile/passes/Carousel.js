import { useEffect, useRef, useState } from "react"

import { CarouselButton, CarouselPass } from "./PassesComponents"

const Carousel = ({ passes }) => {
  const maxScrollWidth = useRef(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const carousel = useRef(null)

  const movePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevState) => prevState - 1)
    }
  }

  const moveNext = () => {
    if (
      carousel.current !== null &&
      carousel.current.offsetWidth * currentIndex <= maxScrollWidth.current
    ) {
      setCurrentIndex((prevState) => prevState + 1)
    }
  }

  const isDisabled = (direction) => {
    if (direction === "prev") {
      return currentIndex <= 0
    }

    if (direction === "next" && carousel.current !== null) {
      return (
        carousel.current.offsetWidth * currentIndex >= maxScrollWidth.current
      )
    }

    return false
  }

  useEffect(() => {
    if (carousel !== null && carousel.current !== null) {
      carousel.current.scrollLeft = carousel.current.offsetWidth * currentIndex
    }
  }, [currentIndex])

  useEffect(() => {
    maxScrollWidth.current = carousel.current
      ? carousel.current.scrollWidth - carousel.current.offsetWidth
      : 0
  }, [])

  return (
    <div className="carousel mx-auto">
      <div className="relative overflow-hidden">
        <div className="top left absolute flex h-full w-full justify-between bg-transparent">
          <CarouselButton onClick={movePrev} isDisabled={isDisabled} />
          <CarouselButton onClick={moveNext} isDisabled={isDisabled} right />
        </div>
        <div
          ref={carousel}
          className="carousel-container relative z-0 ml-12 mr-12 flex touch-pan-x snap-x snap-mandatory items-start gap-4 overflow-hidden scroll-smooth sm:gap-9"
        >
          {passes.map((pass, index) => {
            return <CarouselPass key={index} pass={pass} />
          })}
        </div>
      </div>
    </div>
  )
}

export default Carousel
