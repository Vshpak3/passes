export const FOOTER = `<div class="text-left">
  <table class="w-full" role="separator">
    <tr>
      <td class="pt-16 pb-4">
        <div class="h-px leading-px bg-gray-ui-200">&zwnj;</div>
      </td>
    </tr>
  </table>

  <p class="mb-4 mt-0 text-xs leading-4 text-gray-500">
    This email was sent to you as a registered member of
    <a href="{{ page.websiteUrl }}"
      class="hover:text-brand-700 hover:[text-decoration:underline] inline-block">Passes.com</a>.

    To update your emails preferences <a href="{{ page.updateEmailPreferenceUrl }}"
      class="hover:text-brand-700 hover:[text-decoration:underline] inline-block">click here</a>.

    <span class="sm:block sm:mt-4">
      Use of the service and website is subject to our
      <a href="{{ page.termsUrl }}" class="hover:text-brand-700 hover:[text-decoration:underline] inline-block">Terms
        of
        Use</a>
      and
      <a href="{{ page.privacyUrl }}"
        class="hover:text-brand-700 hover:[text-decoration:underline] inline-block">Privacy
        Statement</a>.
    </span>
  </p>

  <p class="m-0 text-xs leading-4 text-gray-500">&copy; Passes. All rights reserved.</p>
</div>`
