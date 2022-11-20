export enum AdminTabsEnum {
  ImpersonateUser = "impersonate-user",
  MakeCreator = "make-creator",
  MakeAdult = "make-adult",
  MakePublic = "make-public",
  MakePrivate = "make-private",
  MakeSuggested = "make-suggested",
  RemoveSuggested = "remove-suggested",
  CovetedMembers = "coveted-members",
  UpdateCovetedMember = "update-coveted-member",
  ViewCovetedMember = "view-coveted-members"
}

export interface AdminTabProps {
  id: AdminTabsEnum
  name: string
}

export const AdminTabs: Array<AdminTabProps> = [
  { id: AdminTabsEnum.ImpersonateUser, name: "Impersonate User" },
  {
    id: AdminTabsEnum.CovetedMembers,
    name: "Update Coveted Member (Creators)"
  },
  {
    id: AdminTabsEnum.UpdateCovetedMember,
    name: "View Coveted Members (Creators)"
  }
]
