import { withPageLayout } from "src/layout/WithPageLayout"

import CreatorOnlyWrapper from "../../components/wrappers/CreatorOnly"

const Analytics = () => (
  <CreatorOnlyWrapper isPage>Analytics</CreatorOnlyWrapper>
)

export default withPageLayout(Analytics)
