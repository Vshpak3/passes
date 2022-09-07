import { withPageLayout } from "src/layout/WithPageLayout"

import AuthOnlyWrapper from "../components/wrappers/AuthOnly"

const Notification = () => (
  <AuthOnlyWrapper isPage>Notification</AuthOnlyWrapper>
)

export default withPageLayout(Notification)
