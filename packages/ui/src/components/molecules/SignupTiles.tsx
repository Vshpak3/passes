import { useState } from "react"

import { Fade } from "src/components/atoms/animations/Fade"
import { GradientBorderTile } from "src/components/atoms/signup/GradientBorderTile"
import { LoginNFT } from "src/components/atoms/signup/LoginNFT"
import { LoginTile } from "src/components/atoms/signup/LoginTile"

const tiles = [
  // Row 1
  {
    name: "Alex Drachnik",
    username: "drachnik",
    filename: "/img/login/alex-drachnik.png"
  },
  {
    name: "Blair Walnuts",
    username: undefined,
    filename: "/img/login/blair-walnuts.webm"
  },
  {
    name: "Neil Henry",
    username: undefined,
    filename: "/img/login/neil-henry.webm"
  },
  // Row 2
  {
    name: "Alex Drachnik",
    username: undefined,
    filename: "/img/login/alex-drachnik.webm"
  },
  {
    name: "Anna DeGuzman",
    username: undefined,
    filename: "/img/login/anna-deguzman.webm"
  },
  // {
  //   name: "Emma Norton",
  //   username: "emmanorts",
  //   filename: "/img/login/emma-norton.png"
  // },
  // {
  //   name: "Emma Norton",
  //   username: undefined,
  //   filename: "/img/login/emma-norton.webm"
  // },
  {
    name: "Lauren Higgs",
    username: "lauluhiggs",
    filename: "/img/login/lauren-higgs.png"
  },
  // Row 3
  {
    name: "Brittany",
    username: undefined,
    filename: "/img/login/brittany.webm"
  },
  {
    name: "Anna DeGuzman",
    username: "annadeguzman",
    filename: "/img/login/anna-deguzman.png"
  },
  {
    name: "Tom Elderfield",
    username: undefined,
    filename: "/img/login/tom-elderfield.webm"
  },
  // Row 4
  {
    name: "Blair Walnuts",
    username: "blairwalnuts",
    filename: "/img/login/blair-walnuts.png"
  },
  {
    name: "Brooke Markham",
    username: "bmarkhaa",
    filename: "/img/login/brooke-markham.png"
  },
  {
    name: "Josh Morris",
    username: undefined,
    filename: "/img/login/josh-morris.webm"
  }
]

export const SignupTiles = () => {
  const [loadCount, setLoadCount] = useState(0)

  return (
    <div className="grid grid-cols-3 gap-5 xl:gap-[25px]">
      {tiles.map(({ name, username, filename }) => {
        if (filename.endsWith("png") && username) {
          return (
            <GradientBorderTile key={filename}>
              <Fade show={loadCount >= tiles.length}>
                <LoginTile
                  filename={filename}
                  hidden={loadCount !== tiles.length}
                  name={name}
                  setLoaded={() => setLoadCount((c) => c + 1)}
                  username={username}
                />
              </Fade>
            </GradientBorderTile>
          )
        } else if (filename.endsWith("webm")) {
          return (
            <GradientBorderTile key={filename}>
              <Fade show={loadCount >= tiles.length}>
                <LoginNFT
                  filename={filename}
                  hidden={loadCount !== tiles.length}
                  setLoaded={() => setLoadCount((c) => c + 1)}
                />
              </Fade>
            </GradientBorderTile>
          )
        } else {
          return null
        }
      })}
    </div>
  )
}
