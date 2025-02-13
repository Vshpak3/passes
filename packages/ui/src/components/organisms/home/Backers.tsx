import React from "react"

interface Backer {
  name: string
  image: string
  subtitle: string
}

const BACKERS: Backer[] = [
  {
    name: "Kyle Samani",
    image: "/img/homepage/investors/kyle.png",
    subtitle: "Multicoin Capital"
  },
  {
    name: "David Sacks",
    image: "/img/homepage/investors/david.png",
    subtitle: "Craft Ventures"
  },
  {
    name: "Wen-Wen Lam",
    image: "/img/homepage/investors/wenwen.png",
    subtitle: "Gradient Ventures"
  },
  {
    name: "Jake Paul",
    image: "/img/homepage/investors/jake.png",
    subtitle: "Antifund"
  },
  {
    name: "Ryan Wilson",
    image: "/img/homepage/investors/ryan.png",
    subtitle: "ThankYouX"
  },
  {
    name: "Paris Hilton",
    image: "/img/homepage/investors/paris.png",
    subtitle: "Celebrity"
  }
]

export const Backers = () => {
  return (
    <div className="mx-auto max-w-7xl py-8 px-4">
      <h3 className="text-center text-xl font-bold">
        Backed By World-Class Builders
      </h3>
      <div className="my-12 grid grid-cols-2 gap-x-4 gap-y-8 px-4 sm:grid-cols-3 lg:grid-cols-6">
        {BACKERS.map((backer) => (
          <div
            className="flex flex-col items-center space-y-2"
            key={backer.name}
          >
            <img
              alt={backer.name}
              className="h-24 w-24 md:h-32 md:w-32"
              src={backer.image}
            />
            <div className="flex flex-col text-center">
              <p className="text-lg font-bold">{backer.name}</p>
              <p className="font-[500] text-gray-500">{backer.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
