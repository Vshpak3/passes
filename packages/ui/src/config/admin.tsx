export enum AdminTabsEnum {
  "ImpersonateUsers",
  "ImpersonateUser"
}

export interface AdminTabProps {
  id: AdminTabsEnum
  name: string
}
export const AdminTabs: Array<AdminTabProps> = [
  { id: AdminTabsEnum.ImpersonateUsers, name: "impersonate User" }
]
