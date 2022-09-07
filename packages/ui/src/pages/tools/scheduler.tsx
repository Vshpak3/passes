import { withPageLayout } from "src/layout/WithPageLayout"

import CreatorOnlyWrapper from "../../components/wrappers/CreatorOnly"

const Scheduler = () => (
  <CreatorOnlyWrapper isPage>Scheduler</CreatorOnlyWrapper>
)

export default withPageLayout(Scheduler)
