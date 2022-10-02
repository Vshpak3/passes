import { CircleBankDto, WalletDto } from "@passes/api-client"
import { Button } from "src/components/atoms"

interface IAccountCard {
  account?: CircleBankDto
  handleClick: () => void
  isDefault?: boolean
  deleteBank?: () => void
  deleteWallet?: () => void
  wallet?: WalletDto
}

const AccountCard = ({
  account,
  handleClick,
  isDefault,
  deleteBank,
  deleteWallet,
  wallet
}: IAccountCard) => {
  return (
    <div className="mb-16 text-base font-medium leading-[19px] lg:h-full">
      {account && (
        <div className="flex flex-col justify-around rounded-[20px] border border-[#ffffff]/10 bg-[#1b141d]/50 px-[17px] py-[22px] pt-[19px] backdrop-blur-[100px] lg:h-full">
          <div className="flex flex-col">
            <div className="flex flex-row justify-between">
              <span className="text-sm text-[#ffff]/70 lg:self-start">
                {account.description}
              </span>
              <Button variant="white-outline" className="w-[72px]  rounded ">
                {account.circleId ? "Bank" : "Wallet"}
              </Button>
            </div>
          </div>
          <div className="flex flex-row justify-between gap-16">
            <div className="flex flex-col">
              <span className="text-sm text-[#ffff]/70 lg:self-start">
                Transfer type
              </span>
              <span className="text-sm text-[#ffff]/70 lg:self-start">
                Domestic {/* Domestic or Foreign */}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-[#ffff]/70 lg:self-start">
                Bank Country
              </span>
              <span className="text-sm text-[#ffff]/70 lg:self-start">
                USA {/* Domestic or Foreign */}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-[#ffff]/70 lg:self-start">
                We&apos;ll use this bank account for:
              </span>
              <span className="text-sm text-[#ffff]/70 lg:self-start">
                Transfer to this account will always be made in IDR.
              </span>
            </div>
            <div className="flex flex-col">
              {!isDefault && (
                <div className="mt-2 mb-1">
                  <Button variant="pink" onClick={handleClick}>
                    Set Default
                  </Button>
                </div>
              )}
              {deleteBank && (
                <div className="mt-1">
                  <Button
                    variant="pink"
                    onClick={() => {
                      if (deleteBank) {
                        deleteBank()
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {wallet && (
        <div className="flex flex-col justify-around rounded-[20px] border border-[#ffffff]/10 bg-[#1b141d]/50 px-[17px] py-[22px] pt-[19px] backdrop-blur-[100px] lg:h-full">
          <div className="flex flex-col">
            <div className="flex flex-row justify-between">
              <span className="text-sm text-[#ffff]/70 lg:self-start">
                {wallet.address}
              </span>
              <Button variant="white-outline" className="w-[72px]  rounded ">
                Wallet
              </Button>
            </div>
            <div className="flex flex-row justify-between gap-16">
              <div className="flex flex-col">
                <span className="text-sm text-[#ffff]/70 lg:self-start">
                  Chain
                </span>
                <span className="text-sm text-[#ffff]/70 lg:self-start">
                  {wallet.chain.toUpperCase()}
                </span>
              </div>
              <div className="flex flex-col">
                {!isDefault && (
                  <div className="mt-2 mb-1">
                    <Button variant="pink" onClick={handleClick}>
                      Set Default
                    </Button>
                  </div>
                )}
                {!!deleteWallet && (
                  <div className="mt-1">
                    <Button
                      variant="pink"
                      onClick={() => {
                        if (deleteWallet) {
                          deleteWallet()
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default AccountCard
