import { FOOTER } from '../components/footer'
import { SUPPORT } from '../components/support'

export const SUBSCRIPTION_EXPIRED_EMAIL_SUBJECT = 'Your Subscription expired'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SubscriptionExpiredTemplateVariables {
  creatorName: string
  amount: string
  expirationDate: string
}

export const SUBSCRIPTION_EXPIRED = `---
title: Your Subscription expired
preheader: Your Subscription expired
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
                  Your Subscription expired
                </p>

                <p class="m-0 mb-4 text-base leading-5.5 text-gray-500">
                  Your subscription expired because we could not process a new payment...
                </p>

                <p class="m-0 mb-4 text-base leading-5.5 text-gray-500">
                  Creator Name: {{ page.creatorName }}<br />
                  Amount: {{ page.amount }}<br />
                  Expiration Date: {{ page.expirationDate }}<br />
                </p>

                <p class="m-0 mb-4 text-base leading-5.5 text-gray-500">
                  If you want to renew this subscription, go to "My Cards", find this subscription under "Expired Cards" and click "Renew".
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
