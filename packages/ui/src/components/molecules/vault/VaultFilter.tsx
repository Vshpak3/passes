import { FC } from "react"
import { VaultFilterOption } from "src/components/atoms/vault"
import { VaultCategory, VaultType } from "src/components/pages/tools/Vault"

interface TypeFilterButton {
  id: VaultType
  label: string
}
interface CategoryFilterButton {
  id: VaultCategory
  label: string
}

const VAULT_TYPE_OPTIONS: TypeFilterButton[] = [
  { id: undefined, label: "All" },
  { id: "image", label: "Image" },
  { id: "video", label: "Video" }
]
const VAULT_CATEGORY_OPTIONS: CategoryFilterButton[] = [
  { id: undefined, label: "All" },
  { id: "posts", label: "Posts" },
  { id: "messages", label: "Messages" },
  { id: "uploads", label: "Upload" }
]

const filterStyles = {
  media: "md:h-[28.8px] md:min-w-[61.4px] md:max-w-[76.8px]",
  button: "md:h-[36px] md:min-w-[76.8px] md:max-w-[96px]"
}

interface VaultFilterContainerProps {
  setVaultType: (type: VaultType) => void
  setVaultCategory: (category: VaultCategory) => void
  vaultType: VaultType
  vaultCategory: VaultCategory
}

export const VaultFilterContainer: FC<VaultFilterContainerProps> = ({
  vaultType,
  vaultCategory,
  setVaultType,
  setVaultCategory
}) => {
  return (
    <div className="items-align align-center flex">
      <div className="align-items mt-5 flex w-full flex-col justify-start">
        <div className="mb-[15px] flex items-start">
          {VAULT_CATEGORY_OPTIONS.map((category, index) => {
            return (
              <VaultFilterOption
                buttonStyle={filterStyles.button}
                onClick={() => setVaultCategory(category.id)}
                key={index}
                isActive={category.id === vaultCategory}
                label={category.label}
              />
            )
          })}
        </div>
        <div className="flex items-center">
          {VAULT_TYPE_OPTIONS.map((type, index) => {
            return (
              <VaultFilterOption
                buttonStyle={filterStyles.media}
                onClick={() => setVaultType(type.id)}
                key={index}
                isActive={type.id === vaultType}
                label={type.label}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
