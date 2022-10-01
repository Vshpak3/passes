import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

import Image from "next/image"
import React from "react"
import Slider from "react-slick"

const backersList = [
  {
    image: "/img/investors/kyle.jpg",
    name: "Kyle Samani",
    org: "Multicoin Capital"
  },
  {
    image: "/img/investors/david.jpg",
    name: "David Sacks",
    org: "Craft Ventures"
  },
  {
    image: "/img/investors/wenwen.jpg",
    name: "Wen-Wen Lam",
    org: "Gradient Ventures"
  },
  {
    image: "/img/investors/jake.jpg",
    name: "Jake Paul",
    org: "Antifund"
  },
  {
    image: "/img/investors/ryan.jpg",
    name: "Ryan Wilson",
    org: "ThankYouX"
  },
  {
    image: "/img/investors/kevin.jpg",
    name: "Kevin Hartz",
    org: "CEO Eventbrite"
  }
]

const Card = ({ name, img, org }: any) => (
  <div className="carousel-item relative mx-2">
    <div className="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 block rounded-3xl border bg-white p-5 transition-shadow hover:shadow-lg">
      <Image
        src={img}
        alt={name}
        width="230"
        height="230"
        className="w-full rounded-[0.625rem]"
        loading="lazy"
      />
      <div className="mt-4 flex items-center justify-between">
        <span className="font-display text-jacarta-700 whitespace-nowrap text-base hover:text-[#8358ff] dark:text-white">
          {name}
        </span>
      </div>
      <div className="mt-2 text-sm">
        <span className="dark:text-jacarta-300 whitespace-nowrap">{org}</span>
      </div>
    </div>
  </div>
)

function SampleNextArrow(props: any) {
  const { onClick } = props
  return (
    <div
      onClick={onClick}
      className="shadow-white-volume group absolute -right-4 top-1/2 z-10 -mt-6 flex h-12 w-12 cursor-pointer select-none items-center justify-center rounded-full bg-white p-3 text-base sm:-right-6"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        className="fill-jacarta-700 hover:fill-[#8358ff]"
      >
        <path fill="none" d="M0 0h24v24H0z" />
        <path d="M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z" />
      </svg>
    </div>
  )
}

function SamplePrevArrow(props: any) {
  const { onClick } = props
  return (
    <div
      onClick={onClick}
      className="shadow-white-volume group absolute -left-4 top-1/2 z-10  -mt-6 flex h-12 w-12 cursor-pointer select-none items-center justify-center rounded-full bg-white p-3 text-base sm:-left-6"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        className="fill-jacarta-700 hover:fill-[#8358ff]"
      >
        <path fill="none" d="M0 0h24v24H0z" />
        <path d="M10.828 12l4.95 4.95-1.414 1.414L8 12l6.364-6.364 1.414 1.414z" />
      </svg>
    </div>
  )
}

const CardCarousel = () => {
  const settings = {
    infinite: true,
    swipeToSlide: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    speed: 500,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
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
    ]
  }
  return (
    <div className="big-container">
      <Slider {...settings}>
        {backersList.map((card) => (
          <Card
            key={card.name}
            name={card.name}
            org={card.org}
            img={card.image}
          />
        ))}
      </Slider>
    </div>
  )
}

export default CardCarousel
