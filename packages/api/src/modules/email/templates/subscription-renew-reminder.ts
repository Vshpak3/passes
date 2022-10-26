import { FOOTER } from '../components/footer'
import { SUPPORT } from '../components/support'

export const SUBSCRIPTION_RENEW_REMINDER_EMAIL_SUBJECT =
  'Your Subscription is about to expire'

export interface SubscriptionRenewReminderTemplateVariables {
  creatorName: string
  amount: string
  expirationDate: string
  paymentMethod: string
}

export const SUBSCRIPTION_RENEW_REMINDER = `---
title: Your Subscription is about to expire
preheader: Your Subscription is about to expire
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
                  Your Subscription is about to expire
                </p>

                <p class="m-0 mb-4 text-base leading-5.5 text-gray-500">
                  Your subscription expires soon. To avoid missing exclusive content from the creators you follow, renew your subscription by making a payment ahead of time.
                </p>

                <p class="m-0 mb-4 text-base leading-5.5 text-gray-500">
                  To renew your subscription, go to "My Cards" and click "Renew" to pay via your default payment method.
                </p>

                <p class="m-0 mb-4 text-base leading-5.5 text-gray-500">
                  At the next expiration date for the subscription, we will automatically process payment using your default payment method on Passes.
                </p>

                <p class="m-0 mb-4 text-base leading-5.5 text-gray-500">
                  Creator Name: {{ page.creatorName }}<br />
                  Price: {{ page.amount }}<br />
                  Expiration Date: {{ page.expirationDate }}<br />
                  Payment Method: {{ page.paymentMethod }}<br />
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
