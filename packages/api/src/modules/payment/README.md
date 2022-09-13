# Payment / Finance Module

## Setup

To test locally, you must expose an register your API endpoint to Circle

First, expose your localhost port via however method you like. If unsure, I would recommend using ngrok here https://ngrok.com/. You should then get a URL pointing to your localhost API endpoint.

Next, register this URL with Circle via

```
curl -H 'Accept: application/json' \
  -H 'Content-type: application/json' \
  -H "Authorization: Bearer {CIRCLE_API_KEY}" \
  -d "{\"endpoint\": \"{URL}/api/payment/circle/notification\"}" \
  -X POST --url https://api-sandbox.circle.com/v1/notifications/subscriptions
```

I would recommend using a new circle account and CIRCLE_API_KEY since each account can only have up to 3 active running notification subscriptions (make sure to update your .env.dev if you do).

## Integregation with New Payment Target

Examples are buying

- tipped messages
- NFT passes

Make an endpoint in a seperate service that calls `PaymentService.registerPayin` internally. This should then be attached in the FE wherever the `pay-button.tsx` component is put as `registerPaymentFunc`.

Internally, the payin method will be handled by between the FE and `PaymentService.payinEntryHandler` in order to submit a complete payin.

Now we, create callbacks for your payment target.

Add an enum in `PayinCallbackEnum` and a type in `callback.types.ts` that contains any information needed for the callback.
Write 3 different callback functions following the examples in `payment.callback.ts` to deal with state changes of the payin. (Don't forget to register your functions into `functionMapping` in `payment.callback.ts`).

## Integregation with Subscriptions

TODO
