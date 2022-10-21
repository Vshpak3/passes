import React from "react"

export interface Backer {
  name: string
  imageUrl: string
  subtitle: string
}

const BACKERS: Backer[] = [
  {
    name: "Kyle Samani",
    imageUrl:
      "https://uploads-ssl.webflow.com/631e9ffe3bcb9ca6e534880b/632082e37cbec5aa263e7564_Ellipse%20212.png",
    subtitle: "Multicoin Capital"
  },
  {
    name: "David Sacks",
    imageUrl:
      "https://uploads-ssl.webflow.com/631e9ffe3bcb9ca6e534880b/632082e368ab2d208e3f3a5f_Ellipse%20213.png",
    subtitle: "Craft Ventures"
  },
  {
    name: "Wen-Wen Lam",
    imageUrl:
      "https://uploads-ssl.webflow.com/631e9ffe3bcb9ca6e534880b/632082e330667323a65a622a_Ellipse%20214.png",
    subtitle: "Gradient Ventures"
  },
  {
    name: "Jake Paul",
    imageUrl:
      "https://uploads-ssl.webflow.com/631e9ffe3bcb9ca6e534880b/632082e3ded8c33ed54674d6_Ellipse%20215.png",
    subtitle: "Antifund"
  },
  {
    name: "Ryan Wilson",
    imageUrl:
      "https://uploads-ssl.webflow.com/631e9ffe3bcb9ca6e534880b/632082e398443ed32be2ef71_Ellipse%20216.png",
    subtitle: "ThankYouX"
  },
  {
    name: "Paris Hilton",
    imageUrl:
      "https://uploads-ssl.webflow.com/631e9ffe3bcb9ca6e534880b/632082e3d40274418c1bdc82_Ellipse%20211.png",
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
              src={backer.imageUrl}
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
