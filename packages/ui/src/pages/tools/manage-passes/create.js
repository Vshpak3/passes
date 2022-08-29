import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { CreatePassForm, SelectPassType } from "src/components/organisms"
import { PassTypeEnum } from "src/hooks/useCreatePass"
import { withPageLayout } from "src/layout/WithPageLayout"

const PASS_TYPES = [PassTypeEnum.LIFETIME, PassTypeEnum.SUBSCRIPTION]

const CreatePass = () => {
  const [hasMounted, setHasMounted] = useState(false)
  const router = useRouter()

  const { passType } = router.query
  const isSelectPassOption = !PASS_TYPES.includes(passType)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  return isSelectPassOption ? (
    <SelectPassType />
  ) : (
    <CreatePassForm passType={passType} />
  )
}

export default withPageLayout(CreatePass, { header: true })
