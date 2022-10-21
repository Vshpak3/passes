import { NewPostButtonProps } from "src/components/molecules/Sidebar/SidebarButtons/NewPostButton"
import { SidebarNavigation } from "src/components/molecules/Sidebar/SidebarLayout/Types"

export interface SidebarDefaultProps {
  navigation: SidebarNavigation[]
  active: string
  newPostButton: React.ComponentType<NewPostButtonProps>
}
