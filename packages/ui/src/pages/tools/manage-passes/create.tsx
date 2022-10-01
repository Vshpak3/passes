import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { CreatePassForm, SelectPassType } from "src/components/organisms"
import { PassTypeEnum } from "src/hooks/useCreatePass"
import { withPageLayout } from "src/layout/WithPageLayout"

import CreatorOnlyWrapper from "../../../components/wrappers/CreatorOnly"

const PASS_TYPES = [PassTypeEnum.LIFETIME, PassTypeEnum.SUBSCRIPTION]

const CreatePass = () => {
  const [hasMounted, setHasMounted] = useState(false)
  const router = useRouter()

  const passType = Array.isArray(router.query.passType)
    ? router.query.passType[0]
    : router.query.passType || ""
  const isSelectPassOption = !PASS_TYPES.includes(passType)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  return (
    <CreatorOnlyWrapper isPage>
      {isSelectPassOption ? (
        <SelectPassType />
      ) : (
        <CreatePassForm passType={passType} />
      )}
    </CreatorOnlyWrapper>
  )
}

export default withPageLayout(CreatePass, { header: true })
