import { WalletDto, WalletDtoChainEnum } from "@passes/api-client"
import Clipboard from "public/icons/clipboard.svg"
import ColdWalletIcon from "public/icons/cold-wallet-icon.svg"
import DeleteOutlineIcon from "public/icons/delete-outline-pink-icon.svg"
import InfoIcon from "public/icons/infoIcon.svg"
import LockOutlineIcon from "public/icons/lock-outline-pink-icon.svg"
import MetamaskIcon from "public/icons/metamask-icon.svg"
import PhantomIcon from "public/icons/phantom-icon.svg"
import TooltipStar from "public/icons/tooltip-star-icon.svg"
import { FC } from "react"

import { Button } from "src/components/atoms/Button"
import { IconTooltip } from "src/components/atoms/IconTooltip"
import { copyWalletToClipboard, formatWalletAddress } from "src/helpers/wallets"
import { useUserDefaultMintingWallets } from "src/hooks/useUserDefaultMintingWallet"

interface WalletListItemProps {
  wallet: WalletDto
  deleteWalletHandler: (value: string) => void
}

export const WalletTableRow: FC<WalletListItemProps> = ({
  wallet,
  deleteWalletHandler
}) => {
  const { ethWallet, solWallet, setDefaultWallet } =
    useUserDefaultMintingWallets()

  const defaultEthMinting = ethWallet?.walletId === wallet.walletId
  const defaultSolMinting = solWallet?.walletId === wallet.walletId

  const CUSTODIAL_TOOLTIP_TEXT =
    "This is your custodial address: the address generated by Passes on your behalf, used to store your Passes NFTs."
  const AUTH_TOOLTIP_TEXT =
    "Unauthenticated wallet can only be used for payouts."

  const walletTypeIcon = (value: WalletDtoChainEnum, isAuthWallet: boolean) => {
    if (isAuthWallet) {
      switch (value) {
        case WalletDtoChainEnum.Eth:
          return <MetamaskIcon height="36px" width="36px" />
        case WalletDtoChainEnum.Sol:
          return <PhantomIcon height="36px" width="36px" />
      }
    }
    return <ColdWalletIcon height="36px" width="36px" />
  }

  const walletTypeName = (value: WalletDtoChainEnum, isAuthWallet: boolean) => {
    if (!isAuthWallet) {
      return "Cold"
    }
    switch (value) {
      case WalletDtoChainEnum.Eth:
        return "Metamask"
      case WalletDtoChainEnum.Sol:
        return "Phantom"
    }
    return value
  }

  const onDeleteHandler = () => {
    if (!wallet.custodial) {
      deleteWalletHandler(wallet.walletId)
    }
  }

  return (
    <tr className="border-t border-[#2C282D]" key={wallet.walletId}>
      <td className="min-w-[40px]">
        <div className="flex items-center justify-center px-2">
          {!!wallet.custodial && (
            <IconTooltip
              Icon={InfoIcon}
              position="right"
              tooltipText={CUSTODIAL_TOOLTIP_TEXT}
            />
          )}
          {!wallet.authenticated && (
            <IconTooltip
              Icon={TooltipStar}
              position="right"
              tooltipText={AUTH_TOOLTIP_TEXT}
            />
          )}
        </div>
      </td>
      <td className="min-w-[160px] py-3">
        <div className="flex items-center justify-center md:justify-start">
          <div className="shrink-0">
            {walletTypeIcon(wallet.chain, wallet.authenticated)}
          </div>
          <span className="ml-[12px] hidden font-bold md:visible md:block">
            {walletTypeName(wallet.chain, wallet.authenticated)}
          </span>
        </div>
      </td>
      <td className="min-w-[160px] py-3">
        <div
          className="group flex cursor-pointer justify-center text-[#B8B8B8]"
          onClick={() => copyWalletToClipboard(wallet.address)}
        >
          {formatWalletAddress(wallet.address, {
            amountFirst: 6,
            amountLast: 7
          })}
          <Clipboard
            className="invisible ml-2 group-hover:visible md:block"
            width="12px"
          />
        </div>
      </td>
      <td className="min-w-[160px] py-3">
        <div className="flex justify-center">
          {!!wallet.authenticated && (
            <>
              {defaultEthMinting && (
                <Button className="cursor-default" variant="black">
                  ETH NFT Minting
                </Button>
              )}
              {defaultSolMinting && (
                <Button className="cursor-default" variant="black">
                  SOL NFT Minting
                </Button>
              )}
              {!defaultEthMinting &&
                !defaultSolMinting &&
                wallet.authenticated && (
                  <Button
                    onClick={async () =>
                      await setDefaultWallet(wallet.walletId, wallet.chain)
                    }
                    variant="purple-light"
                  >
                    Set {wallet.chain.toUpperCase()} default
                  </Button>
                )}
              {!defaultEthMinting &&
                !defaultSolMinting &&
                !wallet.authenticated && <div>Unauthenticated</div>}
            </>
          )}
        </div>
      </td>
      <td className="min-w-[160px] py-3">
        <div className="flex justify-center">
          <Button
            className="h-[36px] w-[36px] text-passes-primary-color"
            disabled={wallet.custodial}
            onClick={onDeleteHandler}
            variant="pink-outline"
          >
            {wallet.custodial ? (
              <LockOutlineIcon className="absolute z-10 -translate-x-1/2" />
            ) : (
              <DeleteOutlineIcon className="absolute z-10 -translate-x-1/2" />
            )}
          </Button>
        </div>
      </td>
    </tr>
  )
}
