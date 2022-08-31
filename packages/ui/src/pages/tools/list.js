import { withPageLayout } from "src/layout/WithPageLayout"

import CreatorOnlyWrapper from "../../components/wrappers/CreatorOnly"

const List = () => <CreatorOnlyWrapper isPage>List</CreatorOnlyWrapper>

export default withPageLayout(List)
