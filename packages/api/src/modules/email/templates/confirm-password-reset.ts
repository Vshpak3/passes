import path from 'path'

export const CONFIRM_PASSWORD_RESET_EMAIL = `---
title: You have successfully reset your password
preheader: You have successfully reset your password
---

<extends src="${path.join(__dirname, '..', '/layouts/main.html')}">
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

                <p class="mt-0 mb-4 text-[21px] leading-7 text-gray-900">
                  This is a confirmation email that your password for your account has just been changed.
                </p>

                <p class="m-0 text-base leading-5.5 text-gray-500">
                  If this is your account but you didn't request a password change, please, <a href="{{ page.websiteUrl }}" class="hover:text-brand-700 hover:underline">contact Support team</a>  immediately.
                </p>

                <component src="${path.join(
                  __dirname,
                  '..',
                  '/components/footer.html',
                )}"></component>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </block>
</extends>`
