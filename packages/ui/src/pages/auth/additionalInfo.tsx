import AdditionalInfoBlock from "src/components/organisms/AdditionalInfoBlock"

import AuthOnlyWrapper from "../../components/wrappers/AuthOnly"

const AdditionalInfoPage = () => {
  return (
    <AuthOnlyWrapper isPage>
      <AdditionalInfoBlock />
    </AuthOnlyWrapper>
  )
}

export default AdditionalInfoPage
