import { NextPage } from "next"
import React from "react"
import ListDetail from "src/components/pages/tools/lists/ListDetail"
import { withPageLayout } from "src/layout/WithPageLayout"

const CreateListPage: NextPage = () => {
  return <ListDetail />
}

export default withPageLayout(CreateListPage)
