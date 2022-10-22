import React from "react"

interface Backer {
  name: string
  image: string
  subtitle: string
}

const BACKERS: Backer[] = [
  {
    name: "Kyle Samani",
    image: "/img/homepage/investors2/kyle.png",
    subtitle: "Multicoin Capital"
  },
  {
    name: "David Sacks",
    image: "/img/homepage/investors2/david.png",
    subtitle: "Craft Ventures"
  },
  {
    name: "Wen-Wen Lam",
    image: "/img/homepage/investors2/wenwen.png",
    subtitle: "Gradient Ventures"
  },
  {
    name: "Jake Paul",
    image: "/img/homepage/investors2/jake.png",
    subtitle: "Antifund"
  },
  {
    name: "Ryan Wilson",
    image: "/img/homepage/investors2/ryan.png",
    subtitle: "ThankYouX"
  },
  {
    name: "Paris Hilton",
    image: "/img/homepage/investors2/paris.png",
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
            key={backer.name}
            className="flex flex-col items-center space-y-2"
          >
            <img
              src={backer.image}
              alt={backer.name}
              className="h-24 w-24 md:h-32 md:w-32"
            />
            <div className="flex flex-col text-center">
              <p className="text-lg font-bold">{backer.name}</p>
              <p className="font-semibold text-gray-500">{backer.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
