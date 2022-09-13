import { VaultFilterOption } from "src/components/atoms"

import {
  TVaultCategory,
  TVaultType
} from "../../../hooks/vault/useVaultGallery"

interface ITypeFilterButton {
  id: TVaultType
  label: string
}
interface ICategoryFilterButton {
  id: TVaultCategory
  label: string
}

const VAULT_TYPE_OPTIONS: ITypeFilterButton[] = [
  { id: undefined, label: "All" },
  { id: "image", label: "Image" },
  { id: "video", label: "Video" },
  { id: "gif", label: "GIF" },
  { id: "audio", label: "Audio" }
]
const VAULT_CATEGORY_OPTIONS: ICategoryFilterButton[] = [
  { id: undefined, label: "All" },
  { id: "posts", label: "Posts" },
  { id: "messages", label: "Messages" },
  { id: "uploads", label: "Vault" }
]

const filterStyles = {
  media: "md:h-[28.8px] md:min-w-[61.4px] md:max-w-[76.8px]",
  button: "md:h-[36px] md:min-w-[76.8px] md:max-w-[96px]"
}

interface IVaultFilterContainer {
  fetchVaultType: (type: TVaultType) => void
  fetchVaultCategory: (category: TVaultCategory) => void
  vaultType: TVaultType
  vaultCategory: TVaultCategory
}
const VaultFilterContainer = ({
  vaultType,
  vaultCategory,
  fetchVaultType,
  fetchVaultCategory
}: IVaultFilterContainer) => {
  return (
    <div className="items-align align-center flex">
      <div className="align-items mt-5 flex w-full flex-col justify-start">
        <div className="mb-[15px] flex items-start">
          {VAULT_CATEGORY_OPTIONS.map((category, index) => {
            const isActive = category.id === vaultCategory
            const onClick = () => fetchVaultCategory(category.id)
            return (
              <VaultFilterOption
                buttonStyle={filterStyles.button}
                onClick={onClick}
                key={index}
                isActive={isActive}
                label={category.label}
              />
            )
          })}
        </div>
        <div className="flex items-center">
          {VAULT_TYPE_OPTIONS.map((type, index) => {
            const isActive = type.id === vaultType
            const onClick = () => fetchVaultType(type.id)
            return (
              <VaultFilterOption
                buttonStyle={filterStyles.media}
                onClick={onClick}
                key={index}
                isActive={isActive}
                label={type.label}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export { VaultFilterContainer }
