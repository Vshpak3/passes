import React from "react"

import WalletListItem from "./WalletListItem"

interface WalletsListProps {
  walletsList: Wallet[]
  deleteWalletHandler: (value: string) => void
  isCreator?: boolean
  defaultPayoutWalletId?: string
  miningSolanaWalletId?: string
  miningEthereumWalletId?: string
}

interface Wallet {
  walletId: string
  userId?: string
  address: string
  chain: string
  custodial: number
  authenticated: number
}

const WalletsList = ({
  walletsList,
  deleteWalletHandler,
  isCreator,
  defaultPayoutWalletId,
  miningSolanaWalletId,
  miningEthereumWalletId
}: WalletsListProps) => (
  <div
    className="
        mt-[11px]
        ml-[31px]
        place-items-center
        justify-center
        gap-[40px]
        text-center
        text-[12px]
        text-[#ffffffeb]"
  >
    {walletsList?.map(
      ({ address, chain, walletId, custodial, authenticated }) => (
        <WalletListItem
          walletId={walletId}
          address={address}
          chain={chain}
          custodial={custodial}
          authenticated={authenticated}
          deleteWalletHandler={deleteWalletHandler}
          defaultPayoutWalletId={defaultPayoutWalletId}
          miningSolanaWalletId={miningSolanaWalletId}
          miningEthereumWalletId={miningEthereumWalletId}
          key={walletId}
          isCreator={isCreator}
        />
      )
    )}
  </div>
)

export default WalletsList
