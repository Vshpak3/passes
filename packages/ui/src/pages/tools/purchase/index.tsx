import AmexIcon from "public/icons/amex-icon.svg"
import CoinbaseIcon from "public/icons/coinbase-icon.svg"
import DiscoverIcon from "public/icons/discover-icon.svg"
import MastercardIcon from "public/icons/mastercard-icon.svg"
import MetamaskIcon from "public/icons/metamask-icon.svg"
import PhantomIcon from "public/icons/phantom-icon.svg"
import InfoIcon from "public/icons/post-info-circle-icon.svg"
import TrelloIcon from "public/icons/trello-icon.svg"
import VisaIcon from "public/icons/visa-icon.svg"
import WalletConnectIcon from "public/icons/wallet-connect-icon.svg"
import { useForm } from "react-hook-form"
import { FormInput, PassesPinkButton } from "src/components/atoms"
import { CreatorPassTiles, FormContainer } from "src/components/organisms"
import { withPageLayout } from "src/components/pages/WithPageLayout"

const mockData = {
  passName: "Kaila Troy Pro",
  creatorName: "Kaila Troy",
  cost: "20.00"
}

const Purchase = () => {
  const {
    // handleSubmit,
    register
    // formState: { errors },
    // getValues,
    // setValue
  } = useForm({
    defaultValues: {}
  })

  // const onPurchaseHandler = () => {}

  return (
    <div className="mx-auto -mt-[205px] mb-[70px] grid w-full grid-cols-10 justify-center gap-5 px-4 sm:w-[653px] md:w-[653px] lg:w-[900px] lg:px-0 sidebar-collapse:w-[1000px]">
      <div className="col-span-3 mx-auto w-full space-y-6 lg:col-span-3 lg:max-w-[680px]">
        <CreatorPassTiles passData={mockData} />
      </div>
      <div className="col-span-7 mx-auto w-full space-y-6 lg:col-span-7 lg:max-w-[680px]">
        <div>
          <span className="text-[#ffff]">Your order</span>
        </div>
        <div className="flex justify-between text-2xl font-bold">
          <span className="text-[#ffff]">Kaila Troy Pro</span>
          <span className="text-[#ffff]">$20.00 / month</span>
        </div>
        <div className="flex items-center">
          <InfoIcon />
          <span className="ml-2 text-[#ffff]/70">
            Your subscription will be automatically renewed every month
          </span>
        </div>
        <FormContainer>
          <div>
            <span className="text-[#ffff]/70">About your membership</span>
          </div>
          <div>
            <span className="font-semibold text-[#ffff]/90">
              No long-term commitment. Cancel anytime in your account settings.
              Plan will automatically renew until cancelled.
            </span>
          </div>
          <div className="align-center mx-auto flex w-[250px] justify-center">
            <div className="px-2">
              <MetamaskIcon />
            </div>
            <div className="px-2">
              <CoinbaseIcon />
            </div>
            <div className="px-2">
              <TrelloIcon />
            </div>
            <div className="px-2">
              <PhantomIcon />
            </div>
            <div className="px-2">
              <WalletConnectIcon />
            </div>
          </div>
          <div>
            <span className="text-[#ffff]/90">or Pay with Credit card</span>
            <span className="text-[#ffff]/70">Card info</span>
            <FormInput
              register={register}
              type="text"
              name="credit-card-number"
              className="m-0 border-transparent bg-transparent text-[#ffff]/90 focus:border-[#BF7AF0] focus:ring-0"
              placeholder="0000 0000 0000 0000"
              icon={
                <>
                  <AmexIcon />
                  <VisaIcon />
                  <MastercardIcon />
                  <DiscoverIcon />
                </>
              }
            />
          </div>
          <div>
            <span className="text-[#ffff]/90">Billing address</span>
            <FormInput
              register={register}
              type="text"
              name="address"
              placeholder="Street address"
              className="mb-4 border-transparent bg-transparent text-[#ffff]/90 focus:border-[#BF7AF0] focus:ring-0"
            />
            <FormInput
              register={register}
              type="text"
              name="address-optional"
              placeholder="Street address (optinal)"
              className="mb-4 border-transparent bg-transparent text-[#ffff]/90 focus:border-[#BF7AF0] focus:ring-0"
            />
            <FormInput
              register={register}
              type="text"
              name="city"
              placeholder="City"
              className="mb-4 border-transparent bg-transparent text-[#ffff]/90 focus:border-[#BF7AF0] focus:ring-0"
            />
            <div className="flex justify-between">
              <FormInput
                register={register}
                type="text"
                name="state"
                placeholder="State"
                className="mb-4 border-transparent bg-transparent text-[#ffff]/90 focus:border-[#BF7AF0] focus:ring-0"
              />
              <FormInput
                register={register}
                type="text"
                name="zip"
                placeholder="Zip"
                className="mb-4 border-transparent bg-transparent text-[#ffff]/90 focus:border-[#BF7AF0] focus:ring-0"
              />
            </div>
          </div>
          <div>
            <span className="font-semibold text-[#ffff]/90">
              Send email recipients to
            </span>

            <FormInput
              register={register}
              type="text"
              name="email"
              placeholder="Email address"
              className="mb-4 border-transparent bg-transparent text-[#ffff]/90 focus:border-[#BF7AF0] focus:ring-0"
            />
          </div>
          <PassesPinkButton
            name="Confirm and Continue"
            // onClick={onPurchaseHandler}
          />
        </FormContainer>
      </div>
    </div>
  )
}

export default withPageLayout(Purchase)
