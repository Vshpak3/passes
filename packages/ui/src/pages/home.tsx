import { memo } from "react"
import { HomeContentFeed } from "src/components/organisms/HomeContentFeed"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"

const Home = () => {
  return <HomeContentFeed />
}

export default WithNormalPageLayout(memo(Home), { header: false })
