import { FOOTER } from '../components/footer'
import { SUPPORT } from '../components/support'

export const PAYMENT_WALLET_SUCCESS_EMAIL_SUBJECT =
  'Success! Your Wallet is connected & ready to be used on Passes'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PaymentWalletSuccessTemplateVariables {}

export const PAYMENT_WALLET_SUCCESS = `---
title: Success! Your Wallet is connected & ready to be used on Passes
preheader: Success! Your Wallet is connected & ready to be used on Passes
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
                  Success! Your Wallet is connected & ready to be used on Passes
                </p>

                <p class="m-0 mb-4 text-base leading-5.5 text-gray-500">
                  Your wallet was added as a payment method on Passes. You can update your default payment method under "Payment & Wallet Settings".
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
