import { MAIN_LAYOUT_PATH } from './constants'

export const CONFIRM_EMAIL_TEMPLATE = `---
title: Please confirm your email address
preheader: Please confirm your email address
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
                    <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI2LjQuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA4NDIgNTU5IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA4NDIgNTU5OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPHJlY3QgeD0iMzE5LjUiIHk9IjMxNyIgd2lkdGg9Ijc1IiBoZWlnaHQ9Ijc1Ii8+Cgk8cmVjdCB4PSIzNzUuNyIgeT0iMzE3IiB3aWR0aD0iMTguOCIgaGVpZ2h0PSIxOC44Ii8+Cgk8cGF0aCBkPSJNNDY5LjUsMzE3aC03NVYxNjdoNzVDNTY5LDE3MSw1NjguOSwzMTMuMSw0NjkuNSwzMTd6Ii8+Cgk8cmVjdCB4PSIzOTQuNSIgeT0iMjk4LjIiIHdpZHRoPSIxOC44IiBoZWlnaHQ9IjE4LjgiLz4KCTxwYXRoIGQ9Ik0zOTQuNSwzMzUuOGMwLDAsMC4zLTE4LjgsMTguOC0xOC44cy00LTE5LjktNC0xOS45bC0yMi43LDMwLjRsLTEzLDEwLjVMMzk0LjUsMzM1LjhMMzk0LjUsMzM1Ljh6Ii8+Cgk8cGF0aCBkPSJNMzk0LjUsMjk4LjJjMCwwLDAsMTguOC0xOC44LDE4LjhzLTkuNiwxMC44LTkuNiwxMC44bDIyLjEtNC4zbDI2LjgtMjhMMzk0LjUsMjk4LjJMMzk0LjUsMjk4LjJ6Ii8+CjwvZz4KPC9zdmc+Cg==" alt="Passes" width="50" />
                  </a>
                </div>

                <p class="m-0 text-[21px] leading-7 text-gray-900">
                  Hi 👋,
                </p>

                <p class="m-0 text-[21px] leading-7 text-gray-900">
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

                <p class="m-0 text-base leading-5.5 text-gray-500">
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
