export interface SidebarNavigation {
  id: string
  name: string
  href: string
  icon?: any
  current?: boolean
  creatorOnly?: boolean
  showWithoutAuth?: boolean
  children?: SidebarNavigation[]
}
