export const CONFIRM_PASSWORD_RESET_EMAIL = `---
title: You have successfully reset your password
preheader: You have successfully reset your password
---

<extends src="src/modules/email/layouts/main.html">
  <block name="template">
    <table class="wrapper w-full font-sans">
      <tr>
        <td align="center" class="bg-white">
          <table class="w-160 sm:w-full">
            <tr>
              <td class="px-10 py-12 sm:px-4 sm:py-6 text-left bg-white">
                <div class="mb-6">
                  <a href="{{ page.websiteUrl }}">
                    <img src="https://lever-client-logos.s3.us-west-2.amazonaws.com/3bed1e3c-0767-4162-a312-a45905c140c6-1659708002730.png" alt="Passes" width="50">
                  </a>
                </div>

                <p class="mt-0 mb-4 text-[21px] leading-7 text-gray-900">
                  This is a confirmation email that your password for your account has just been changed.
                </p>

                <p class="m-0 text-base leading-5.5 text-gray-500">
                  If this is your account but you didn't request a password change, please, <a href="{{ page.websiteUrl }}" class="hover:text-brand-700 hover:underline">contact Support team</a>  immediately.
                </p>

                <component src="src/modules/email/components/footer.html"></component>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </block>
</extends>`
