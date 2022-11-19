import { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import { ListDetail } from "src/components/organisms/creator-tools/lists/ListDetail"
import { queryParam } from "src/helpers/query"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"

const FanDetailLists: NextPage = () => {
  const [listId, setListId] = useState<string>()
  const router = useRouter()

  useEffect(() => {
    if (router.query?.list_id) {
      setListId(queryParam(router.query.list_id))
    }
  }, [router])

  return (
    <>
      {listId !== undefined && listId.length > 0 && (
        <ListDetail listId={listId} />
      )}
    </>
  )
}

export default WithNormalPageLayout(FanDetailLists, { creatorOnly: true })
