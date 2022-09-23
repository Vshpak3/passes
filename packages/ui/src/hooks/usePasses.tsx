import {
  GetPassHoldingsRequestDtoOrderTypeEnum,
  PassApi,
  PassHolderDto
} from "@passes/api-client"
import { useEffect, useState } from "react"
import { useUser } from "src/hooks"
import useSWR from "swr"

const MOCKED_VIEWER_PASSES: PassHolderDto[] = [
  {
    passHolderId: "1",
    passId: "1",
    price: 20,
    title: "Kalia Troy Basic Kalia Troy Basic Kalia Troy Basic",
    type: "subscription",
    expiresAt: 1659945535 as unknown as Date,
    creatorId: "test",
    description: "test",
    totalSupply: 0,
    remainingSupply: 0,
    freetrial: false,
    address: "0",
    chain: "sol",
    symbol: "PASS",
    collectionAddress: ""
  }
]

function filterPasses(expired = true) {
  return (pass: PassHolderDto) => {
    const currentDate = Date.now()
    const expiryDate = Number(pass.expiresAt) * 1000

    return expired ? currentDate < expiryDate : currentDate > expiryDate
  }
}
function filterPassesByTitle(searchTerm: string) {
  return (item: PassHolderDto) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
}
function filterPassesByType(type: string) {
  return (item: PassHolderDto | undefined) => {
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
        const api = new PassApi()
        return (
          await api.getCreatorPasses({
            getCreatorPassesRequestDto: { creatorId }
          })
        ).passes
      }
    }
  )

  const { data: fanPasses, isValidating: isLoadingFanPasses } = useSWR(
    user ? "/pass/owned" : null,
    async () => {
      const api = new PassApi()
      return (
        await api.getPassHoldings({
          getPassHoldingsRequestDto: {
            order: "desc",
            orderType: GetPassHoldingsRequestDtoOrderTypeEnum.CreatedAt
          }
        })
      ).passHolders
    }
  )

  const [filteredActive, setFilteredActive] = useState(MOCKED_VIEWER_PASSES)
  const [filteredExpired, setFilteredExpired] = useState(MOCKED_VIEWER_PASSES)
  const [filteredCreatorPassesList, setFilteredCreatorPassesList] =
    useState(MOCKED_VIEWER_PASSES)

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
    const filteredCreatorPasses = MOCKED_VIEWER_PASSES.filter(
      filterPasses(false)
    )
      .filter(filterPassesByTitle(passSearchTerm))
      .filter(filterPassesByType(passType))
    setFilteredCreatorPassesList(filteredCreatorPasses)
  }, [passType, passSearchTerm])

  return {
    passType,
    filteredActive,
    filteredCreatorPassesList,
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
