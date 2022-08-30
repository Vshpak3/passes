import { CircleBankDto } from "@passes/api-client"

import { Button } from "../../components/atoms"
interface IAccountCard {
  account?: CircleBankDto
  handleClick: () => void
  isDefault?: boolean
}

const AccountCard = ({ account, handleClick, isDefault }: IAccountCard) => {
  return (
    <div className="mb-16 text-base font-medium leading-[19px] lg:h-full">
      <div className="flex flex-col justify-around rounded-[20px] border border-[#ffffff]/10 bg-[#1b141d]/50 px-[17px] py-[22px] pt-[19px] backdrop-blur-[100px] lg:h-full">
        <div className="flex flex-col">
          <span className="text-sm text-[#ffff]/70 lg:self-start">
            {account?.description}
          </span>
          {/* <span className="text-sm text-[#ffff]/70 lg:self-start">
            IDR /BCA
          </span>
          <span className="text-sm text-[#ffff]/70 lg:self-start">
            ********8920 
          </span> */}
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
              <Button variant="pink" onClick={handleClick}>
                Set Default
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default AccountCard
