import React, { useEffect, useState } from "react"
import { usePasses } from "src/hooks"
import { withPageLayout } from "src/layout/WithPageLayout"

import {
  MyPassGrid,
  MyPassSearchHeader
} from "../../components/molecules/passes/MyPasses"
import AuthOnlyWrapper from "../../components/wrappers/AuthOnly"

const Passes = () => {
  const [hasMounted, setHasMounted] = useState(false)

  const {
    filteredActive,
    passSearchTerm,
    filteredExpired,
    onSearchPass,
    setPassType
  } = usePasses()

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  return (
    <AuthOnlyWrapper isPage>
      <div className="mb-[70px] grid w-full md:mx-auto md:justify-center lg:w-[900px] sidebar-collapse:w-[1100px]">
        <MyPassSearchHeader
          onSearchPass={onSearchPass}
          passSearchTerm={passSearchTerm}
        />
        <MyPassGrid
          activePasses={filteredActive}
          expiredPasses={filteredExpired}
          setPassType={setPassType}
        />
      </div>
    </AuthOnlyWrapper>
  )
}
export default withPageLayout(Passes)
