import { useEffect } from "react"
import HomeContentFeed from "src/components/organisms/HomeContentFeed"
import { useUser } from "src/hooks"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"

const Home = () => {
  const { mutate } = useUser()

  // Ensure we update the use after redirecting to home
  useEffect(() => {
    mutate()
  }, [mutate])

  return <HomeContentFeed />
}

export default WithNormalPageLayout(Home)
