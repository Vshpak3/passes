import { NextPage } from "next"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import ListDetail from "src/components/pages/tools/lists/ListDetail"
import { withPageLayout } from "src/layout/WithPageLayout"

import ConditionRendering from "../../../components/molecules/ConditionRendering"

const FanDetailLists: NextPage = () => {
  const [listId, setListId] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (router && router.query) {
      setListId(router.query.list_id as string)
    }
  }, [router])

  return (
    <ConditionRendering condition={listId !== undefined}>
      <ListDetail id={listId} />
    </ConditionRendering>
  )
}

export default withPageLayout(FanDetailLists)
