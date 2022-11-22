import { AdminApi } from "@passes/api-client"
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"
import { toast } from "react-toastify"
import { string } from "yup"

import { AdminTabProps, AdminTabs, AdminTabsEnum } from "src/config/admin"
import { errorMessage } from "src/helpers/error"
import { useUser } from "src/hooks/useUser"
import { AdminSidebar } from "./AdminSidebar"
import { AdminUserPage } from "./tabs/AdminUser"
import { Chargebacks } from "./tabs/Chargebacks"
import { UpdatedCovetedMember } from "./tabs/UpdateCovetedMember"
import { ViewCovetedMembers } from "./tabs/ViewCovetedMembers"

const ADMIN_EMAIL = "@passes.com"

export interface AdminFormSchema {
  secret: string
  userId?: string
  username?: string
}

export const adminFormBase = {
  secret: string().required("The secret is required"),
  userId: string().when("username", {
    is: "",
    then: string().required("Please enter a username or userId"),
    otherwise: string()
  }),
  username: string().when("userId", {
    is: "",
    then: string().required("Please enter a username or userId"),
    otherwise: string()
  })
}

export const Admin = () => {
  const { loading, user, setAccessToken, mutate: refreshUser } = useUser()
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [activeTab, setActiveTab] = useState<AdminTabsEnum | undefined>()
  const [tabs, setTabs] = useState<Array<AdminTabProps>>(AdminTabs)
  const [searchText, setSearchText] = useState<string>("")

  const fuzzySearch = (text: string, query: string) => {
    text = text.toLowerCase()
    query = query.toLowerCase()
    let n = -1
    for (let i = 0; i < query.length; i++) {
      if ((n = text.indexOf(query.charAt(i), n + 1)) === -1) {
        return false
      }
    }
    return true
  }

  const handleSettingsSearch = useCallback(() => {
    setTabs(
      AdminTabs.filter((tab) =>
        fuzzySearch(tab.name.toLowerCase(), searchText.toLowerCase())
      )
    )
  }, [searchText])

  useEffect(() => {
    handleSettingsSearch()
  }, [handleSettingsSearch])

  useEffect(() => {
    if (!router.isReady || loading) {
      return
    }
    if (!user || !user.email.endsWith(ADMIN_EMAIL)) {
      router.push("/home")
    } else {
      setReady(true)
    }
  }, [loading, router, user])

  useEffect(() => {
    const tab = window.location.hash.slice(1)
    if (tab) {
      setActiveTab(tab as AdminTabsEnum)
    }
  }, [router])

  const impersonateUser = async (values: AdminFormSchema) => {
    try {
      const api = new AdminApi()
      const res = await api.impersonateUser({
        impersonateUserRequestDto: { ...values }
      })
      setAccessToken(res.accessToken)
      refreshUser()
      router.push("/home")
    } catch (error: unknown) {
      errorMessage(error, true)
    }
  }

  const flagAsAdult = async (values: AdminFormSchema) => {
    try {
      const api = new AdminApi()
      await api.flagAsAdult({
        adminDto: { ...values }
      })
      toast.success("Creator marked as adult")
    } catch (error: unknown) {
      errorMessage(error, true)
    }
  }

  const setupCreator = async (values: AdminFormSchema) => {
    try {
      const api = new AdminApi()
      await api.setupCreator({
        adminDto: { ...values }
      })
      toast.success(
        "Made user a creator (make sure to re login the creator's account to see changes)"
      )
    } catch (error: unknown) {
      errorMessage(error, true)
    }
  }

  const markPublic = async (values: AdminFormSchema) => {
    try {
      const api = new AdminApi()
      await api.markPublic({
        adminDto: { ...values }
      })
      toast.success("Added to home feed")
    } catch (error: unknown) {
      errorMessage(error, true)
    }
  }

  const removePublic = async (values: AdminFormSchema) => {
    try {
      const api = new AdminApi()
      await api.removePublic({
        adminDto: { ...values }
      })
      toast.success("Removed from home feed")
    } catch (error: unknown) {
      errorMessage(error, true)
    }
  }

  const markSuggested = async (values: AdminFormSchema) => {
    try {
      const api = new AdminApi()
      await api.markSuggested({
        adminDto: { ...values }
      })
      toast.success("Added to suggetsed")
    } catch (error: unknown) {
      errorMessage(error, true)
    }
  }

  const removeSuggested = async (values: AdminFormSchema) => {
    try {
      const api = new AdminApi()
      await api.removeSuggested({
        adminDto: { ...values }
      })
      toast.success("Removed from suggetsed")
    } catch (error: unknown) {
      errorMessage(error, true)
    }
  }

  const renderTab = () => {
    switch (activeTab) {
      case AdminTabsEnum.ImpersonateUser:
        return (
          <AdminUserPage
            action={impersonateUser}
            label="Impersonate"
            title="Impersonate a user"
          />
        )
      case AdminTabsEnum.MakeAdult:
        return (
          <AdminUserPage
            action={flagAsAdult}
            label="Update"
            title="Make a creator as adult"
          />
        )
      case AdminTabsEnum.MakeCreator:
        return (
          <AdminUserPage
            action={setupCreator}
            label="Update"
            title="Make a user a creator"
          />
        )
      case AdminTabsEnum.MakePublic:
        return (
          <AdminUserPage
            action={markPublic}
            label="Update"
            title="Make public (add to home feed)"
          />
        )
      case AdminTabsEnum.MakePrivate:
        return (
          <AdminUserPage
            action={removePublic}
            label="Update"
            title="Make private (remove from home feed)"
          />
        )
      case AdminTabsEnum.MakeSuggested:
        return (
          <AdminUserPage
            action={markSuggested}
            label="Update"
            title="Add to Suggested"
          />
        )
      case AdminTabsEnum.RemoveSuggested:
        return (
          <AdminUserPage
            action={removeSuggested}
            label="Update"
            title="Remove from Suggested"
          />
        )
      case AdminTabsEnum.UpdateCovetedMember:
        return <UpdatedCovetedMember />
      case AdminTabsEnum.ViewCovetedMember:
        return <ViewCovetedMembers />
      case AdminTabsEnum.Chargebacks:
        return <Chargebacks />
      default: {
        return (
          <div className="ml-28 mt-20 text-lg font-medium">
            Select a tab to begin
          </div>
        )
      }
    }
  }

  return (
    <>
      {ready && (
        <div className="flex h-screen w-full flex-col overflow-hidden">
          <div className="flex w-full items-center justify-between px-8 py-4">
            <span className="text-xl font-bold">Admin</span>
          </div>
          <div className=" flex flex-1 flex-row border-t-[1px] border-passes-dark-200">
            <AdminSidebar
              searchText={searchText}
              setSearchText={setSearchText}
              tabs={tabs}
            />
            {renderTab()}
          </div>
        </div>
      )}
    </>
  )
}
