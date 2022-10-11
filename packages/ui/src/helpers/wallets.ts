import copy from "copy-to-clipboard"
import { toast } from "react-toastify"

export const formatWalletAddress = (
  wallet: string,
  { amountFirst, amountLast }: { amountFirst: number; amountLast: number }
) => {
  const firstDigits = wallet.slice(0, amountFirst)
  const lastDigits = wallet.slice(wallet.length - amountLast, wallet.length)

  return `${firstDigits}...${lastDigits}`
}

export const copyWalletToClipboard = (address: string) => {
  copy(address)

  toast.info("Wallet address copied to clipboard")
}
