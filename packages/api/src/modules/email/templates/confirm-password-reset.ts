import { FOOTER } from '../components/footer'

export const CONFIRM_PASSWORD_RESET_EMAIL_SUBJECT =
  '[Passes] Password Reset Successful'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ConfirmPasswordResetTemplateVariables {}

export const CONFIRM_PASSWORD_RESET_EMAIL_TEMPLATE = `---
title: You have successfully reset your password
preheader: You have successfully reset your password
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
                  This is a confirmation email that your password for your account has just been changed.
                </p>

                <p class="m-0 text-base leading-5.5 text-gray-500">
                  If you did not request a password change, please contact the support team immediately at
                    <a href="mailto:{{ page.supportEmail }}" class="hover:text-brand-700 hover:underline">{{ page.supportEmail }}</a>.
                </p>

                ${FOOTER}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </block>
</extends>`
