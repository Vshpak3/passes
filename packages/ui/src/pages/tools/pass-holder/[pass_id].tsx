import { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import { PassHolders } from "src/components/organisms/creator-tools/pass-holders/PassHolders"
import { queryParam } from "src/helpers/query"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"

const PassHoldersList: NextPage = () => {
  const [passId, setPassId] = useState<string>()
  const router = useRouter()

  useEffect(() => {
    if (router.query?.list_id) {
      setPassId(queryParam(router.query.pass_id))
    }
  }, [router])

  return (
    <>
      {passId !== undefined && passId.length > 0 && (
        <PassHolders passId={passId} />
      )}
    </>
  )
}

export default WithNormalPageLayout(PassHoldersList, { creatorOnly: true })
