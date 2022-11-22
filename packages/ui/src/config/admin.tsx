export enum AdminTabsEnum {
  ImpersonateUser = "impersonate-user",
  MakeCreator = "make-creator",
  MakeAdult = "make-adult",
  MakePublic = "make-public",
  MakePrivate = "make-private",
  MakeSuggested = "make-suggested",
  RemoveSuggested = "remove-suggested",
  UpdateCovetedMember = "update-coveted-member",
  ViewCovetedMember = "view-coveted-members",
  Chargebacks = "chargebacks"
}

export interface AdminTabProps {
  id: AdminTabsEnum
  name: string
}

export const AdminTabs: Array<AdminTabProps> = [
  { id: AdminTabsEnum.ImpersonateUser, name: "Impersonate User" },
  {
    id: AdminTabsEnum.MakeCreator,
    name: "Make User a Creator (Can't be undone)"
  },
  {
    id: AdminTabsEnum.MakeAdult,
    name: "Mark Creator as Adult Content"
  },
  {
    id: AdminTabsEnum.MakePublic,
    name: "Add Creator to Public Feed"
  },
  {
    id: AdminTabsEnum.MakePrivate,
    name: "Remove Creator from Public Feed"
  },
  {
    id: AdminTabsEnum.MakeSuggested,
    name: "Add Suggested Creator"
  },
  {
    id: AdminTabsEnum.RemoveSuggested,
    name: "Remove Suggested Creator"
  },
  {
    id: AdminTabsEnum.ViewCovetedMember,
    name: "View Coveted Members (Creators)"
  },
  {
    id: AdminTabsEnum.UpdateCovetedMember,
    name: "Update Coveted Member (Creators)"
  },
  {
    id: AdminTabsEnum.Chargebacks,
    name: "Manage Unprocessed Chargebacks"
  }
]
