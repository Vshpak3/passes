export interface SidebarNavigation {
  id: string
  name: string
  href: string

  // This should be any toto avoid conflicts with
  // `@svgr/webpack` plugin or
  // `babel-plugin-inline-react-svg` plugin
  icon?: any
  current?: boolean
  creatorOnly?: boolean
  showWithoutAuth?: boolean
  children?: SidebarNavigation[]
}
