import { useState } from "react"

export interface MockVaultData {
  id: string
  source: string
  url: any
  type: string
  date: string
  totalLikes: number
  totalTips: number
}

const MOCK_VAULT_DATA: MockVaultData[] = [
  {
    id: "1",
    source: "vault",
    url: require("../../../public/img/investors/david.jpg"),
    type: "image",
    date: "1661057523",
    totalLikes: 325,
    totalTips: 246
  },
  {
    id: "2",
    source: "messages",
    url: require("../../../public/img/investors/jake.jpg"),
    type: "image",
    date: "1661057535",
    totalLikes: 2,
    totalTips: 432
  },
  {
    id: "3",
    source: "messages",
    url: require("../../../public/img/investors/kyle.jpg"),
    type: "video",
    date: "1661057535",
    totalLikes: 765,
    totalTips: 1345
  },
  {
    id: "4",
    source: "posts",
    url: require("../../../public/img/investors/kevin.jpg"),
    type: "video",
    date: "1661157535",
    totalLikes: 321,
    totalTips: 176
  },
  {
    id: "5",
    source: "vault",
    url: require("../../../public/img/investors/ryan.jpg"),
    type: "gif",
    date: "1660957535",
    totalLikes: 126,
    totalTips: 153
  },
  {
    id: "6",
    source: "vault",
    url: require("../../../public/img/investors/wenwen.jpg"),
    type: "gif",
    date: "1660857535",
    totalLikes: 54,
    totalTips: 14
  },
  {
    id: "7",
    source: "vault",
    url: require("../../../public/img/gradient.jpg"),
    type: "gif",
    date: "1660757535",
    totalLikes: 587,
    totalTips: 290
  },
  {
    id: "8",
    source: "vault",
    url: require("../../../public/img/gradient_dark.jpg"),
    type: "gif",
    date: "1660657535",
    totalLikes: 216,
    totalTips: 134
  },
  {
    id: "9",
    source: "vault",
    url: require("../../../public/img/gradient_dark.jpg"),
    type: "gif",
    date: "1660557535",
    totalLikes: 765,
    totalTips: 475
  },
  {
    id: "10",
    source: "vault",
    url: require("../../../public/img/gradient_light.jpg"),
    type: "gif",
    date: "1660457535",
    totalLikes: 234,
    totalTips: 79
  },
  {
    id: "11",
    source: "vault",
    url: require("../../../public/img/investors/david.jpg"),
    type: "image",
    date: "1660357535",
    totalLikes: 675,
    totalTips: 492
  },
  {
    id: "12",
    source: "messages",
    url: require("../../../public/img/investors/jake.jpg"),
    type: "image",
    date: "1660257535",
    totalLikes: 234,
    totalTips: 94
  },
  {
    id: "13",
    source: "messages",
    url: require("../../../public/img/investors/kyle.jpg"),
    type: "video",
    date: "1661057535",
    totalLikes: 765,
    totalTips: 421
  },
  {
    id: "14",
    source: "posts",
    url: require("../../../public/img/investors/kevin.jpg"),
    type: "video",
    date: "1661057535",
    totalLikes: 4321,
    totalTips: 1654
  },
  {
    id: "15",
    source: "vault",
    url: require("../../../public/img/investors/ryan.jpg"),
    type: "gif",
    date: "1661057535",
    totalLikes: 532,
    totalTips: 432
  },
  {
    id: "16",
    source: "vault",
    url: require("../../../public/img/investors/wenwen.jpg"),
    type: "gif",
    date: "1661057535",
    totalLikes: 127,
    totalTips: 54
  },
  {
    id: "17",
    source: "vault",
    url: require("../../../public/img/gradient.jpg"),
    type: "gif",
    date: "1661057535",
    totalLikes: 121,
    totalTips: 43
  },
  {
    id: "18",
    source: "vault",
    url: require("../../../public/img/gradient_dark.jpg"),
    type: "gif",
    date: "1661057535",
    totalLikes: 127,
    totalTips: 53
  },
  {
    id: "19",
    source: "vault",
    url: require("../../../public/img/gradient_dark.jpg"),
    type: "gif",
    date: "1661057535",
    totalLikes: 984,
    totalTips: 654
  },
  {
    id: "20",
    source: "vault",
    url: require("../../../public/img/gradient_light.jpg"),
    type: "gif",
    date: "1661057535",
    totalLikes: 176,
    totalTips: 58
  }
]

const useVaultGallery = () => {
  // TODO: Replace mediaContent value with API Vault content
  const [mediaContent] = useState(MOCK_VAULT_DATA)

  const [filteredItems, setFilteredItems] = useState(mediaContent)
  const [selectedItems, setSelectedItems] = useState<MockVaultData[]>([])

  return {
    mediaContent,
    filteredItems,
    selectedItems,
    setFilteredItems,
    setSelectedItems
  }
}

export default useVaultGallery
