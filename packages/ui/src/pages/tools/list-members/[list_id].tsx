import { NextPage } from "next"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"

import { queryParam } from "src/helpers/query"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"

const ListDetail = dynamic(
  () => import("src/components/organisms/creator-tools/lists/ListDetail"),
  { ssr: false }
)

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
