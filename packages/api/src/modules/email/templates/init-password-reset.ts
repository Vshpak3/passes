import { MAIN_LAYOUT_PATH } from './constants'

export const INIT_PASSWORD_RESET_EMAIL_TEMPLATE = `---
title: Reset your password
preheader: Reset your password
---

<extends src="${MAIN_LAYOUT_PATH}">
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

                <p class="m-0 text-[21px] leading-7 text-gray-900">
                  Hi 👋,
                </p>

                <p class="m-0 text-[21px] leading-7 text-gray-900">
                  We received a request to reset your password. You can reset is at this link below:
                </p>

                <div class="leading-4" role="separator">&zwnj;</div>

                <a
                  href="{{ page.passwordResetLink }}"
                  class="inline-block sm:block py-4 px-8 rounded shadow text-base text-center leading-4 font-bold [text-decoration:none] text-white bg-[#0052E2] hover:bg-brand-600"
                >
                  <!--[if mso]><i style="letter-spacing: 32px; mso-font-width: -100%; mso-text-raise:30px;">&#8202;</i><![endif]-->
                  <span style="mso-text-raise: 16px;">Reset Password</span>
                  <!--[if mso]><i style="letter-spacing: 32px; mso-font-width: -100%;">&#8202;</i><![endif]-->
                </a>

                <div class="leading-4" role="separator">&zwnj;</div>

                <p class="m-0 text-base leading-5.5 text-gray-500">
                  If you did not request to reset your password, ignore this email and the link will expire in an hour automatically.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </block>
</extends>`
