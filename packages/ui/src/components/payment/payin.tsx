import {
  PayinDto,
  PayinDtoPayinMethodEnum,
  PayinDtoPayinStatusEnum,
  PaymentApi
} from "@passes/api-client"
import React from "react"

//TODO: add FE for payment object specific stuff
// e.g. displaying nft picture of nft brought, or name of person for tipped message
const Payin = (payin: PayinDto, accessToken: string) => {
  let payinMethodText = ""
  let canCancel = false
  switch (payin.payinMethod) {
    case PayinDtoPayinMethodEnum.CircleCard:
      payinMethodText =
        "Card ending in " +
        payin.card?.fourDigits +
        " expiring on " +
        payin.card?.expMonth +
        "/" +
        payin.card?.expYear
      break
    case PayinDtoPayinMethodEnum.PhantomCircleUsdc:
    case PayinDtoPayinMethodEnum.MetamaskCircleUsdc:
    case PayinDtoPayinMethodEnum.MetamaskCircleEth:
      if (payin.transactionHash) {
        payinMethodText = payin.payinMethod + " chain:" + payin.chainId
        payinMethodText += " Transaction hash " + payin.transactionHash
      }
      if (payin.payinStatus === PayinDtoPayinStatusEnum.Created) {
        canCancel = true
      }
      break
  }
  const cancel = async () => {
    const paymentApi = new PaymentApi()
    await paymentApi.paymentCancelPayin(
      { payinId: payin.id },
      {
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json"
        }
      }
    )
    window.location.reload()
  }
  return (
    <div>
      Payment method: {payinMethodText}
      &emsp; Amount: ${payin.amount}
      &emsp; Target: {payin.callback}
      &emsp; Status: {payin.payinStatus}
      <br />
      {canCancel && (
        <button
          onClick={cancel}
          className="w-32 rounded-[50px] bg-[#C943A8] p-4"
          type="submit"
        >
          Cancel
        </button>
      )}
    </div>
  )
}
export default Payin
