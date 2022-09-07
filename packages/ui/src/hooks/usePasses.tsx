import { PassApi, PassDto } from "@passes/api-client"
import { useEffect, useState } from "react"
import { useUser } from "src/hooks"
import useSWR from "swr"

import { wrapApi } from "../helpers/wrapApi"

const MOCKED_VIEWER_PASSES: PassDto[] = [
  {
    id: "1",
    price: 20,
    title: "Kalia Troy Basic Kalia Troy Basic Kalia Troy Basic",
    type: "subscription",
    expiresAt: 1659945535 as unknown as Date,
    creatorId: "test",
    description: "test",
    totalSupply: 0,
    remainingSupply: 0,
    freetrial: false
  },
  {
    id: "1",
    price: 20,
    title: "Testing Today",
    type: "subscription",
    expiresAt: 1667159535 as unknown as Date,
    creatorId: "test",
    description: "test",
    totalSupply: 0,
    remainingSupply: 0,
    freetrial: false
  },
  {
    id: "1",
    price: 20,
    title: "My Pass 1",
    type: "subscription",
    expiresAt: 1663059535 as unknown as Date,
    creatorId: "test",
    description: "test",
    totalSupply: 0,
    remainingSupply: 0,
    freetrial: false
  },
  {
    id: "1",
    price: 20,
    title: "My Pass 1",
    type: "subscription",
    expiresAt: 1663059535 as unknown as Date,
    creatorId: "test",
    description: "test",
    totalSupply: 0,
    remainingSupply: 0,
    freetrial: false
  },
  {
    id: "1",
    price: 20,
    title: "My Pass 1",
    type: "subscription",
    expiresAt: 1667159535 as unknown as Date,
    creatorId: "test",
    description: "test",
    totalSupply: 0,
    remainingSupply: 0,
    freetrial: false
  },
  {
    id: "1",
    price: 20,
    title: "My Pass 1",
    type: "subscription",
    expiresAt: 1667159535 as unknown as Date,
    creatorId: "test",
    description: "test",
    totalSupply: 0,
    remainingSupply: 0,
    freetrial: false
  },
  {
    id: "1",
    price: 20,
    title: "My Pass 1",
    type: "subscription",
    expiresAt: 1663059535 as unknown as Date,
    creatorId: "test",
    description: "test",
    totalSupply: 0,
    remainingSupply: 0,
    freetrial: false
  },
  {
    id: "1",
    price: 20,
    title: "My Pass 1",
    type: "subscription",
    expiresAt: 1663059535 as unknown as Date,
    creatorId: "test",
    description: "test",
    totalSupply: 0,
    remainingSupply: 0,
    freetrial: false
  },
  {
    id: "2",
    price: 20,
    title: "My Pass 2",
    type: "lifetime",
    expiresAt: 1659945535 as unknown as Date,
    creatorId: "test",
    description: "test",
    totalSupply: 0,
    remainingSupply: 0,
    freetrial: false
  },
  {
    id: "3",
    price: 20,
    title: "My Pass 3",
    type: "subscription",
    expiresAt: 1663059535 as unknown as Date,
    creatorId: "test",
    description: "test",
    totalSupply: 0,
    remainingSupply: 0,
    freetrial: false
  },
  {
    id: "4",
    price: 20,
    title: "My Pass 4",
    type: "lifetime",
    expiresAt: 1659945535 as unknown as Date,
    creatorId: "test",
    description: "test",
    totalSupply: 0,
    remainingSupply: 0,
    freetrial: false
  },
  {
    id: "5",
    price: 20,
    title: "My Pass 5",
    type: "lifetime",
    expiresAt: 1667159535 as unknown as Date,
    creatorId: "test",
    description: "test",
    totalSupply: 0,
    remainingSupply: 0,
    freetrial: false
  },
  {
    id: "6",
    price: 20,
    title: "My Pass 6",
    type: "subscription",
    expiresAt: 1667159535 as unknown as Date,
    creatorId: "test",
    description: "test",
    totalSupply: 0,
    remainingSupply: 0,
    freetrial: false
  },
  {
    id: "7",
    price: 20,
    title: "My Pass 7",
    type: "lifetime",
    expiresAt: 1667159535 as unknown as Date,
    creatorId: "test",
    description: "test",
    totalSupply: 0,
    remainingSupply: 0,
    freetrial: false
  }
]

function filterPasses(expired = true) {
  return (pass: PassDto) => {
    const currentDate = Date.now()
    const expiryDate = Number(pass.expiresAt) * 1000

    return expired ? currentDate < expiryDate : currentDate > expiryDate
  }
}
function filterPassesByTitle(searchTerm: string) {
  return (item: PassDto) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
}
function filterPassesByType(type: string) {
  return (item: PassDto | undefined) => {
    if (type === "all") return true
    return item?.type.toLowerCase() === type.toLowerCase()
  }
}

const usePasses = (creatorId = "") => {
  const { user } = useUser()
  const { data: creatorPasses, isValidating: isLoadingCreatorPasses } = useSWR(
    user ? ["/pass/created/", creatorId] : null,
    async () => {
      if (user) {
        const api = wrapApi(PassApi)
        return (
          await api.getCreatorPasses({
            creatorId
          })
        ).passes
      }
    }
  )

  const { data: fanPasses, isValidating: isLoadingFanPasses } = useSWR(
    user ? "/pass/owned" : null,
    async () => {
      const api = wrapApi(PassApi)
      return (
        await api.getPassHoldings({
          creatorId: ""
        })
      ).passHolders
    }
  )

  const [filteredActive, setFilteredActive] = useState(MOCKED_VIEWER_PASSES)
  const [filteredExpired, setFilteredExpired] = useState(MOCKED_VIEWER_PASSES)

  const [passType, setPassType] = useState("all")
  const [passSearchTerm, setPassSearchTerm] = useState("")

  const onSearchPass = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassSearchTerm(event.target.value)
  }

  useEffect(() => {
    const filterActivePasses = MOCKED_VIEWER_PASSES.filter(filterPasses(true))
      .filter(filterPassesByTitle(passSearchTerm))
      .filter(filterPassesByType(passType))
    setFilteredActive(filterActivePasses)

    const filterExpiredPasses = MOCKED_VIEWER_PASSES.filter(filterPasses(false))
      .filter(filterPassesByTitle(passSearchTerm))
      .filter(filterPassesByType(passType))
    setFilteredExpired(filterExpiredPasses)
  }, [passType, passSearchTerm])

  return {
    filteredActive,
    creatorPasses,
    filteredExpired,
    fanPasses,
    isLoadingFanPasses,
    isLoadingCreatorPasses,
    passSearchTerm,
    onSearchPass,
    setPassType
  }
}

export default usePasses
