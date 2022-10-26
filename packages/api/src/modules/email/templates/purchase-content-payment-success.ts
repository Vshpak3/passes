import { FOOTER } from '../components/footer'
import { SUPPORT } from '../components/support'

export const PURCHASE_CONTENT_PAYMENT_SUCCESS_EMAIL_SUBJECT =
  'Your content purchase was successful!'

export interface PurchaseContentPaymentSuccessTemplateVariables {
  creatorName: string
  amount: string
  paymentMethod: string
}

export const PURCHASE_CONTENT_PAYMENT_SUCCESS = `---
title: Your content purchase was successful!
preheader: Your content purchase was successful!
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
                  Your content purchase was successful!
                </p>

                <p class="m-0 mb-4 text-base leading-5.5 text-gray-500">
                  You purchased content on Passes!
                </p>

                <p class="m-0 mb-4 text-base leading-5.5 text-gray-500">
                  Creator Name: {{ page.creatorName }}<br />
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
