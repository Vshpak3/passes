import { NextPage } from "next"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { withPageLayout } from "src/layout/WithPageLayout"

const ListDetail = dynamic<any>(
  () => import("src/components/pages/tools/lists/ListDetail"),
  {
    ssr: false
  }
)

const FanDetailLists: NextPage = () => {
  const [listId, setListId] = useState<string>()
  const router = useRouter()

  useEffect(() => {
    if (router && router.query) {
      setListId(router.query.list_id as string)
    }
  }, [router])
  return <>{listId !== undefined && <ListDetail id={listId} />}</>
}

export default withPageLayout(FanDetailLists)
