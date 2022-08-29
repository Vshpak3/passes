import { useRouter } from "next/router"
import React from "react"
import { PassesListSection, SelectPassType } from "src/components/organisms"
import { usePasses } from "src/hooks"
import { PassTypeEnum } from "src/hooks/useCreatePass"
import { withPageLayout } from "src/layout/WithPageLayout"

const filterCreatorPasses = (passes) => (type) =>
  passes?.filter((pass) => pass.type === type)

const ManagePasses = () => {
  const router = useRouter()
  const { creatorPasses } = usePasses()
  const filterPasses = filterCreatorPasses(creatorPasses)

  const subscriptionPasses = filterPasses(PassTypeEnum.SUBSCRIPTION)
  const lifetimePasses = filterPasses(PassTypeEnum.LIFETIME)
  const existingPasses =
    lifetimePasses?.length > 0 || subscriptionPasses?.length > 0

  const onCreatePass = () => router.push("/tools/manage-passes/create")

  return existingPasses ? (
    <PassesListSection
      lifetimePasses={lifetimePasses}
      onCreatePass={onCreatePass}
      subscriptionPasses={subscriptionPasses}
    />
  ) : (
    <SelectPassType initialCreation />
  )
}
export default withPageLayout(ManagePasses)
