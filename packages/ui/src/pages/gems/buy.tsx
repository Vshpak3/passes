import { GemApi, GemPackagesDto } from "@moment/api-client"
import { useEffect, useState } from "react"

const GemSelection = () => {
  const [packages, setPackages] = useState({ packages: [] } as GemPackagesDto)
  useEffect(() => {
    const fetchData = async () => {
      const api = new GemApi()
      const p = await api.gemGetPublicPackages()
      p.packages.sort((a, b) => {
        return a.cost - b.cost
      })
      setPackages(p)
    }
    fetchData()
  })
  return (
    <div>
      {packages.packages.map((value, index) => {
        return (
          <button
            onClick={() => {
              window.location.href = "/gems/card?package=" + value.title
            }}
            key={index}
          >
            {value.title} <br></br>${value.cost} <br></br>
            {value.baseGems}(+{value.bonusGems}) gems<br></br>
            {value.description}
            <br></br>
            <br></br>
          </button>
        )
      })}
    </div>
  )
}
export default GemSelection
