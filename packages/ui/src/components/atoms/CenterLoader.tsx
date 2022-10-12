import React from "react"

import { Loader } from "./Loader"

export const CenterLoader = () => (
  <div className="flex h-screen align-middle">
    <div className="m-auto">
      <Loader />
    </div>
  </div>
)
