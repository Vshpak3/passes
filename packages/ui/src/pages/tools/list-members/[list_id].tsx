import { NextPage } from "next"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"

const ListDetail = dynamic(
  () => import("../../../components/organisms/creator-tools/lists/ListDetail"),
  { ssr: false }
)

const FanDetailLists: NextPage = () => {
  const [listId, setListId] = useState<string>()
  const router = useRouter()

  useEffect(() => {
    if (router && router.query) {
      setListId(router.query.list_id as string)
    }
  }, [router])
  return (
    <>
      {listId !== undefined && listId.length > 0 && <ListDetail id={listId} />}
    </>
  )
}

export default WithNormalPageLayout(FanDetailLists, { creatorOnly: true })
