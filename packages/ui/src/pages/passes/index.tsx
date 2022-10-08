import {
  MyPassGrid,
  MyPassSearchHeader
} from "src/components/molecules/passes/MyPasses"
import { usePasses, useUser } from "src/hooks"
import { withPageLayout } from "src/layout/WithPageLayout"

const Passes = () => {
  const { user } = useUser()

  const {
    filteredActive,
    passSearchTerm,
    filteredExpired,
    onSearchPass,
    setPassType,
    passType,
    lifetimePasses
  } = usePasses(user?.id ?? "")

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
        lifetimePasses={lifetimePasses}
      />
    </div>
  )
}
export default withPageLayout(Passes)
