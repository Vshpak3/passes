import { useEffect } from "react"
import HomeContentFeed from "src/components/organisms/HomeContentFeed"
import { useUser } from "src/hooks"
import { withPageLayout } from "src/layout/WithPageLayout"

const Home = () => {
  const { mutate } = useUser()

  // Ensure we update the use after redirecting to home
  useEffect(() => {
    mutate()
  }, [mutate])

  return <HomeContentFeed />
}

export default withPageLayout(Home)
