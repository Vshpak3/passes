import { useRouter } from "next/router"
import { FC } from "react"
import { useUser } from "src/hooks"
import { PropsWithChildren } from "types"

export interface CreatorOnlyWrapperProps {
  // isPage will handle redirecting user to /login if not logged in
  // Otherwise, will conditionally render children
  isPage?: boolean
}

const CreatorOnlyWrapper: FC<PropsWithChildren<CreatorOnlyWrapperProps>> = ({
  children,
  isPage
}) => {
  const { loading, user } = useUser()
  const router = useRouter()

  if (loading) {
    return null
  }

  if (!user || !user.isCreator) {
    if (isPage && typeof window !== "undefined") {
      router.push("/")
    }

    return null
  }

  return <>{children}</>
}

export default CreatorOnlyWrapper
