import { FOOTER } from '../components/footer'
import { SUPPORT } from '../components/support'

export const PAYMENT_FAILURE_EMAIL_SUBJECT = 'Oops! Your payment failed'

export interface PaymentFailureTemplateVariables {
  amount: string
  paymentMethod: string
}

export const PAYMENT_FAILURE = `---
title: Oops! Your payment failed
preheader: Oops! Your payment failed
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
                  Your subscription was renewed successfully!
                </p>

                <p class="m-0 mb-4 text-base leading-5.5 text-gray-500">
                  Your recent attempt to make a payment failed. Please try again with a different payment method by selecting or adding a new payment method under "Payment & Wallet Settings".
                </p>

                <p class="m-0 mb-4 text-base leading-5.5 text-gray-500">
                  Amount: {{ page.amount }}<br />
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
