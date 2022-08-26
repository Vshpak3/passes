import { Button } from "../../components/atoms"

// interface IAccountCard {
//   account: any
//   handleClick: () => void
// }

const AccountCard = () => {
  // const AccountCard = ({ account, handleClick }: IAccountCard) => {
  return (
    <div className="mb-16 text-base font-medium leading-[19px] lg:h-full">
      <div className="flex flex-col justify-around rounded-[20px] border border-[#ffffff]/10 bg-[#1b141d]/50 px-[17px] py-[22px] pt-[19px] backdrop-blur-[100px] lg:h-full">
        <div className="flex flex-col">
          <span className="text-sm text-[#ffff]/70 lg:self-start">
            IDR /BCA {/* Name of Bank */}
          </span>
          <span className="text-sm text-[#ffff]/70 lg:self-start">
            ********8920 {/* Bank Account Number */}
          </span>
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
            <Button
              variant="pink"
              onClick={() => {
                // setDefault()
              }}
            >
              Set Default
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default AccountCard
