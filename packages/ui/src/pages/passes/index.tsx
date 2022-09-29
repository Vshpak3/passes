import React, { useEffect, useState } from "react"
import {
  MyPassGrid,
  MyPassSearchHeader
} from "src/components/molecules/passes/MyPasses"
import { usePasses, useUser } from "src/hooks"
import { withPageLayout } from "src/layout/WithPageLayout"

const Passes = () => {
  const [hasMounted, setHasMounted] = useState(false)
  const { user } = useUser()

  const {
    filteredActive,
    passSearchTerm,
    filteredExpired,
    onSearchPass,
    setPassType,
    passType
  } = usePasses(user?.id)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  return (
    <div
      className="
          mx-auto
           mb-[70px]
           grid
           w-full
           bg-black
           px-2
           md:px-5
           sidebar-collapse:max-w-[1100px]"
    >
      <MyPassSearchHeader
        onSearchPass={onSearchPass}
        passSearchTerm={passSearchTerm}
      />
      <MyPassGrid
        activePasses={filteredActive}
        expiredPasses={filteredExpired}
        setPassType={setPassType}
        passType={passType}
      />
    </div>
  )
}
export default withPageLayout(Passes)
