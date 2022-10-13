import { Vault } from "src/components/pages/tools/Vault"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"

export const VaultPage = () => {
  return <Vault />
}

export default WithNormalPageLayout(VaultPage, { creatorOnly: true })
