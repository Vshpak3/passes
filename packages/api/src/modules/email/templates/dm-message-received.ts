import { FOOTER } from '../components/footer'
import { SUPPORT } from '../components/support'

export const DM_MESSAGE_RECEIVED_EMAIL_SUBJECT = 'You received a new message!'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PostNewMentionTemplateVariables {}

export const DM_MESSAGE_RECEIVED = `---
title: You received a new message!
preheader: You received a new message!
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
                  You received a new message on Passes!
                </p>

                <p class="m-0 mb-4 text-base leading-5.5 text-gray-500">
                You can go to the "Messaging" page in the left side panel to view and respond to this message.
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
