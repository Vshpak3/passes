import MessagesComponent from "src/components/messages"
import { withPageLayout } from "src/layout/WithPageLayout"

// import AuthOnlyWrapper from "../components/wrappers/AuthOnly"
// TODO: @Jonathan this component re-renders messages too many times
const Messages = () => (
  // <AuthOnlyWrapper isPage>
  <MessagesComponent />
  // </AuthOnlyWrapper>
)

export default withPageLayout(Messages)
