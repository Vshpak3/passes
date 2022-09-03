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
      <div className="mx-auto mb-[70px] grid w-full bg-black px-2 md:px-5 sidebar-collapse:max-w-[1100px]">
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
