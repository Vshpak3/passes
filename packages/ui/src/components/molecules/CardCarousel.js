import Image from "next/image"
import { useState } from "react"

const backersList = [
  {
    idx: 1,
    pos: 1,
    active: true,
    image: "/img/investors/kyle.jpg",
    name: "Kyle Samani",
    org: "Multicoin Capital"
  },
  {
    idx: 2,
    pos: 2,
    active: true,
    image: "/img/investors/david.jpg",
    name: "David Sacks",
    org: "Craft Ventures"
  },
  {
    idx: 3,
    pos: 3,
    active: true,
    image: "/img/investors/wenwen.jpg",
    name: "Wen-Wen Lam",
    org: "Gradient Ventures"
  },
  {
    idx: 4,
    pos: 4,
    active: true,
    image: "/img/investors/jake.jpg",
    name: "Jake Paul",
    org: "Antifund"
  },
  {
    idx: 5,
    pos: 5,
    active: true,
    image: "/img/investors/ryan.jpg",
    name: "Ryan Wilson",
    org: "ThankYouX"
  },
  {
    idx: 6,
    pos: 6,
    active: false,
    image: "/img/investors/kevin.jpg",
    name: "Kevin Hartz",
    org: "CEO Eventbrite"
  }
]

const CardCarousel = () => {
  const [cards, setCards] = useState(backersList)
  const handleLeftClick = () => {
    const prevState = [...cards]
    const nextCardIdx = prevState
      .filter((ft) => ft.active === true)
      .sort((a, b) => (a.pos > b.pos ? 1 : b.pos > a.pos ? -1 : 0))[0].idx

    prevState.find((f) => f.active === false).active = true
    prevState.find((f) => f.idx === nextCardIdx).active = false
    prevState.find((f) => f.idx === nextCardIdx).pos =
      Math.max.apply(
        null,
        prevState.map(function (o) {
          return o.pos
        })
      ) + 1

    setCards(prevState)
  }

  const handleRightClick = () => {
    const prevState = [...cards]
    const nextCardIdx = prevState
      .filter((ft) => ft.active === true)
      .sort((a, b) => (a.pos > b.pos ? 1 : b.pos > a.pos ? -1 : 0))
      .pop(1).idx

    prevState.find((f) => f.active === false).pos =
      Math.min.apply(
        null,
        prevState.map(function (o) {
          return o.pos
        })
      ) - 1

    prevState.find((f) => f.active === false).active = true
    prevState.find((f) => f.idx === nextCardIdx).active = false

    setCards(prevState)
  }

  return (
    <div className="relative">
      <div className="carousel w-full gap-2">
        <div className="absolute left-2 right-3 top-1/2 z-10 flex -translate-y-1/2 transform justify-between">
          <div
            onClick={() => handleRightClick()}
            className="shadow-white-volume group absolute top-1/2 -left-4 -mt-6 flex h-12 w-12 cursor-pointer select-none items-center justify-center rounded-full bg-white p-3 text-base sm:-left-6"
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
          <div
            onClick={() => handleLeftClick()}
            className="shadow-white-volume group absolute top-1/2 -right-4 z-10 -mt-6 flex h-12 w-12 cursor-pointer select-none items-center justify-center rounded-full bg-white p-3 text-base sm:-right-6"
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
        </div>
        {cards
          .filter((f) => f.active === true)
          .sort((a, b) => (a.pos > b.pos ? 1 : b.pos > a.pos ? -1 : 0))
          .map((card) => (
            <Card
              key={card.name}
              name={card.name}
              org={card.org}
              img={card.image}
            />
          ))}
      </div>
    </div>
  )
}

const Card = ({ name, img, org }) => (
  <div className="carousel-item relative p-3">
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
        <span className="font-display text-jacarta-700 text-base hover:text-[#8358ff] dark:text-white">
          {name}
        </span>
      </div>
      <div className="mt-2 text-sm">
        <span className="dark:text-jacarta-300">{org}</span>
      </div>
    </div>
  </div>
)

export default CardCarousel
