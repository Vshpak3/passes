import { FOOTER } from '../../components/footer'
import { SUPPORT } from '../../components/support'

export const PURCHASE_CARD_SUBSCRIPTION_PAYMENT_SUCCESS_EMAIL_SUBJECT =
  'Your Subscription has started!'

export interface PurchaseCardSubscriptionPaymentSuccessTemplateVariables {
  creatorName: string
  amount: string
  paymentMethod: string
}

export const PURCHASE_CARD_SUBSCRIPTION_PAYMENT_SUCCESS = `---
title: Your Subscription has started!
preheader: Your Subscription has started!
---

<extends src="{{ page.mainLayoutPath }}">
  <block name="template">
    <table class="wrapper w-full font-sans">
      <tr>
        <td align="center" class="bg-white">
          <table class="w-160 sm:w-full">
            <tr>
              <td class="px-10 py-12 sm:px-4 sm:py-6 text-left bg-white">
                <div class="mb-6">
                  <a href="{{ page.websiteUrl }}">
                    <img src="{{ page.logoUrl }}" alt="Passes" width="50" />
                  </a>
                </div>

                <p class="mt-0 mb-4 text-[21px] leading-7 text-gray-900">
                  Your Subscription has started!
                </p>

                <p class="m-0 mb-4 text-base leading-5.5 text-gray-500">
                  You purchased a subscription! Please see details of the purchase below.
                </p>
                
                <p class="m-0 mb-4 text-base leading-5.5 text-gray-500">
                  Creator Name: {{ page.creatorName }}<br />
                  Amount: {{ page.amount }}<br />
                  Payment Method: {{ page.paymentMethod }}<br />
                </p>

                <p class="m-0 mb-4 text-base leading-5.5 text-gray-500">
                  This subscription will be available in your Passes wallet or your Phantom wallet connected on the platform. More info about your subscription can be found under "My Cards" on the left side panel.
                </p>

                <p class="m-0 mb-4 text-base leading-5.5 text-gray-500">
                  Remember that your subscription expires every month and will be renewed automatically with your selected payment method. In the event the payment fails, you will lose access to your creator's exclusive content moving forward but will still be able to access all past content that was unlocked.
                </p>

                ${SUPPORT}

                ${FOOTER}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </block>
</extends>`
