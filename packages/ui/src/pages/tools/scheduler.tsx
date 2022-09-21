import { SchedulerPageHeader } from "src/components/pages/tools/scheduler"

// dance2die.github.io/calendar-dates/#/
import CreatorOnlyWrapper from "../../components/wrappers/CreatorOnly"
import { withPageLayout } from "../../layout/WithPageLayout"
import SchedulerPage from "./scheduler/SchedulerPage"

const Scheduler = () => (
  <CreatorOnlyWrapper isPage>
    <div className="p-[38px]">
      <SchedulerPageHeader />
    </div>
    <SchedulerPage />
  </CreatorOnlyWrapper>
)

export default withPageLayout(Scheduler)
