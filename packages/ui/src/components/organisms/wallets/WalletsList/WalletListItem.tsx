import {
  GetDefaultWalletRequestDtoChainEnum,
  WalletDto,
  WalletDtoChainEnum
} from "@passes/api-client"
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

interface WalletListItemProps {
  wallet: WalletDto
  deleteWalletHandler: (value: string) => void
  defaultSolMinting: boolean
  defaultEthMinting: boolean
  setDefaultMinting: (
    walletId: string,
    chain: GetDefaultWalletRequestDtoChainEnum
  ) => Promise<void>
}

export const WalletListItem: FC<WalletListItemProps> = ({
  wallet,
  deleteWalletHandler,
  defaultSolMinting,
  defaultEthMinting,
  setDefaultMinting
}) => {
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
    <>
      <div
        className="flex w-[600px] items-center justify-between gap-0 border-t border-[#2C282D] py-3 md:w-full md:gap-[40px] md:pl-8"
        key={wallet.walletId}
      >
        <div className="relative flex basis-1/4 items-center justify-center">
          <div className="absolute left-3 md:-left-3">
            {Boolean(wallet.custodial) && (
              <IconTooltip
                Icon={InfoIcon}
                position="top"
                tooltipText={CUSTODIAL_TOOLTIP_TEXT}
                className=""
              />
            )}
          </div>
          <div className="absolute left-3 md:-left-3">
            {!wallet.authenticated && (
              <IconTooltip
                Icon={TooltipStar}
                position="top"
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
            width="12px"
            className="invisible ml-2 group-hover:visible md:block"
          />
        </div>
        {wallet.authenticated && (
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
                variant="purple-light"
                tag="button"
                onClick={async () =>
                  await setDefaultMinting(wallet.walletId, wallet.chain)
                }
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
            variant="link-purple"
            tag="button"
          >
            Delete
          </Button>
        </div>
      </div>
    </>
  )
}
