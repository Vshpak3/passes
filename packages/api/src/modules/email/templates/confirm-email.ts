export const CONFIRM_EMAIL_SUBJECT = 'Verify Email'

export interface ConfirmEmailTemplateVariables {
  verifyEmailUrl: string
}

export const CONFIRM_EMAIL_TEMPLATE = `---
title: Please confirm your email address
preheader: Please confirm your email address
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

                <p class="m-0 mb-8 text-[21px] leading-7 text-gray-900">
                  Hi 👋,
                </p>

                <p class="m-0 mb-4 text-[21px] leading-7 text-gray-900">
                  In order to start using your account, you need to confirm your email.
                </p>

                <div class="leading-4" role="separator">&zwnj;</div>

                <a
                  href="{{ page.verifyEmailUrl }}"
                  class="inline-block sm:block py-4 px-8 rounded shadow text-base text-center leading-4 font-bold [text-decoration:none] text-white bg-[#0052E2] hover:bg-brand-600"
                >
                  <!--[if mso]><i style="letter-spacing: 32px; mso-font-width: -100%; mso-text-raise:30px;">&#8202;</i><![endif]-->
                  <span style="mso-text-raise: 16px;">Confirm your email address</span>
                  <!--[if mso]><i style="letter-spacing: 32px; mso-font-width: -100%;">&#8202;</i><![endif]-->
                </a>

                <div class="leading-4" role="separator">&zwnj;</div>

                <p class="m-0 mt-4 text-base leading-5.5 text-gray-500">
                  If you did not sign up for this account you can ignore this email and the account will be deleted automatically after 5 days.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </block>
</extends>`
