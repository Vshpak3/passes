import { FOOTER } from '../../components/footer'
import { SUPPORT } from '../../components/support'

export const PAYOUT_WALLET_CONNECT_SUCCESS_EMAIL_SUBJECT =
  'Success! Your Wallet Address can be used for payouts'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PayoutWalletConnectSuccessTemplateVariables {}

export const PAYOUT_WALLET_CONNECT_SUCCESS = `---
title: Success! Your Wallet Address can be used for payouts
preheader: Success! Your Wallet Address can be used for payouts
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
                  Success! Your Wallet Address can be used for payouts
                </p>

                <p class="m-0 mb-4 text-base leading-5.5 text-gray-500">
                  Your wallet address was added as a payout method on Passes. Go to the "Payouts" page under Creator Tools on the left side panel to request manual or automated payouts.
                </p>

                <p class="m-0 mb-4 text-base leading-5.5 text-gray-500">
                  You can update your default payout method under "Payment & Wallet Settings".
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
