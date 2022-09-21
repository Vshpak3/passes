import { SchedulerPageHeader } from "src/components/pages/tools/scheduler"
import { withPageLayout } from "src/layout/WithPageLayout"

import CreatorOnlyWrapper from "../../components/wrappers/CreatorOnly"

const Scheduler = () => (
  <CreatorOnlyWrapper isPage>
    <div className="p-[38px]">
      <SchedulerPageHeader />
    </div>
  </CreatorOnlyWrapper>
)

export default withPageLayout(Scheduler)
