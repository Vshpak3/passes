import MessagesComponent from "src/components/messages"
import { withPageLayout } from "src/layout/WithPageLayout"

import AuthOnlyWrapper from "../components/wrappers/AuthOnly"

const Messages = () => (
  <AuthOnlyWrapper isPage>
    <MessagesComponent />
  </AuthOnlyWrapper>
)

export default withPageLayout(Messages)
