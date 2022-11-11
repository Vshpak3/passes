import { FOOTER } from '../components/footer'
import { SUPPORT } from '../components/support'

export const POST_NEW_MENTION_EMAIL_SUBJECT = 'You have a new mention!'

export interface PostNewMentionTemplateVariables {
  item: string
}

export const POST_NEW_MENTION = `---
title: You were mentioned in a recent post!
preheader: You were mentioned in a recent post!
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
                  You were mentioned in a recent {{ page.item }}!
                </p>

                <p class="m-0 mb-4 text-base leading-5.5 text-gray-500">
                  Log in to your Passes account to view and respond to the mention.
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
