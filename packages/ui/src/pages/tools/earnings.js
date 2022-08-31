import { withPageLayout } from "src/layout/WithPageLayout"

import CreatorOnlyWrapper from "../../components/wrappers/CreatorOnly"

const Earnings = () => <CreatorOnlyWrapper isPage>Earnings</CreatorOnlyWrapper>

export default withPageLayout(Earnings)
