import { WalletDto, WalletDtoChainEnum } from "@passes/api-client"
import Clipboard from "public/icons/clipboard.svg"
import DefaultIcon from "public/icons/defaultWalletTypeIcon.svg"
import InfoIcon from "public/icons/infoIcon.svg"
import Metamask from "public/icons/metamask-icon.svg"
import Phantom from "public/icons/phantom-icon.svg"
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

export const WalletListItem: FC<WalletListItemProps> = ({
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
    "Unauthenticated Wallet: can only be used for Payouts."

  const walletTypeIcon = (value: WalletDtoChainEnum, isAuthWallet: boolean) => {
    if (isAuthWallet) {
      switch (value) {
        case WalletDtoChainEnum.Eth:
          return <Metamask width="40px" />
        case WalletDtoChainEnum.Sol:
          return <Phantom width="40px" />
      }
    }
    return <DefaultIcon />
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
    <div
      className="flex w-[600px] items-center justify-between gap-0 border-t border-[#2C282D] py-3 md:w-full md:gap-[40px] md:pl-8"
      key={wallet.walletId}
    >
      <div className="relative flex basis-1/4 items-center justify-center md:ml-6 md:justify-start">
        <div className="absolute left-3 md:-left-8">
          {!!wallet.custodial && (
            <IconTooltip
              Icon={InfoIcon}
              position="right"
              tooltipText={CUSTODIAL_TOOLTIP_TEXT}
            />
          )}
        </div>
        <div className="absolute left-3 md:-left-8">
          {!wallet.authenticated && (
            <IconTooltip
              Icon={TooltipStar}
              position="right"
              tooltipText={AUTH_TOOLTIP_TEXT}
            />
          )}
        </div>
        <div className="flex items-center justify-center">
          <div>{walletTypeIcon(wallet.chain, wallet.authenticated)}</div>
          <span className="ml-[12px] hidden font-bold md:visible md:block">
            {walletTypeName(wallet.chain, wallet.authenticated)}
          </span>
        </div>
      </div>
      <div
        className='text-[#ffffffeb]" group flex basis-1/4 cursor-pointer flex-row justify-center'
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
      {!!wallet.authenticated && (
        <div className="flex basis-1/4 justify-center">
          {defaultEthMinting && (
            <Button className="cursor-default" variant="gray">
              ETH NFT Minting
            </Button>
          )}
          {defaultSolMinting && (
            <Button className="cursor-default" variant="gray">
              SOL NFT Minting
            </Button>
          )}
          {!defaultEthMinting && !defaultSolMinting && wallet.authenticated && (
            <Button
              onClick={async () =>
                await setDefaultWallet(wallet.walletId, wallet.chain)
              }
              tag="button"
              variant="purple-light"
            >
              Set {wallet.chain} default
            </Button>
          )}
          {!defaultEthMinting &&
            !defaultSolMinting &&
            !wallet.authenticated && <div>Unauthenticated</div>}
        </div>
      )}
      <div className="flex basis-1/4 justify-center">
        <Button
          disabled={wallet.custodial}
          onClick={onDeleteHandler}
          tag="button"
          variant="link-purple"
        >
          Delete
        </Button>
      </div>
    </div>
  )
}
