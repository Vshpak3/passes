import { NextPage } from "next"
import { useRouter } from "next/router"
import React from "react"
import ListDetail from "src/components/pages/tools/lists/ListDetail"
import { withPageLayout } from "src/layout/WithPageLayout"

const FanDetailLists: NextPage = () => {
  const router = useRouter()
  const { list_id } = router.query

  return <ListDetail id={list_id?.toString()} />
}

export default withPageLayout(FanDetailLists)
