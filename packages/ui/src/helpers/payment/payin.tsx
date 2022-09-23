import {
  PayinDto,
  PayinDtoPayinStatusEnum,
  PayinMethodDtoMethodEnum,
  PaymentApi
} from "@passes/api-client"
import React from "react"

//TODO: add FE for payment object specific stuff
// e.g. displaying nft picture of nft brought, or name of person for tipped message
const Payin = (payin: PayinDto) => {
  let payinMethodText = ""
  let canCancel = false
  switch (payin.payinMethod.method) {
    case PayinMethodDtoMethodEnum.CircleCard:
      payinMethodText =
        "Card ending in " +
        payin.card?.fourDigits +
        " expiring on " +
        payin.card?.expMonth +
        "/" +
        payin.card?.expYear
      break
    case PayinMethodDtoMethodEnum.PhantomCircleUsdc:
    case PayinMethodDtoMethodEnum.MetamaskCircleUsdc:
    case PayinMethodDtoMethodEnum.MetamaskCircleEth:
      if (payin.transactionHash) {
        payinMethodText =
          payin.payinMethod.method + " chain:" + payin.payinMethod.chainId
        payinMethodText += " Transaction hash " + payin.transactionHash
      }
      if (payin.payinStatus === PayinDtoPayinStatusEnum.Created) {
        canCancel = true
      }
      break
  }
  const cancel = async () => {
    const paymentApi = new PaymentApi()
    await paymentApi.cancelPayin({ payinId: payin.id })
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
          className="w-32 rounded-[50px] bg-passes-pink-100 p-4"
          type="submit"
        >
          Cancel
        </button>
      )}
    </div>
  )
}
export default Payin
