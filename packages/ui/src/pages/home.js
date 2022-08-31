import { withPageLayout } from "src/layout/WithPageLayout"

import AuthOnlyWrapper from "../components/wrappers/AuthOnly"

const Home = () => <AuthOnlyWrapper isPage>Home</AuthOnlyWrapper>

export default withPageLayout(Home)
