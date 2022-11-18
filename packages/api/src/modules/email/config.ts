import path from 'path'

// eslint-disable-next-line import/no-default-export
export default {
  build: {},
  mainLayoutPath: path
    .join(__dirname, '/layouts/main.html')
    .replace('dist/', process.env.NODE_ENV === 'dev' ? '' : 'dist/'),
  inlineCSS: false,
  removeUnusedCSS: false,
  websiteUrl: 'https://www.passes.com',
  updateEmailPreferenceUrl:
    'https://www.passes.com/settings/notifications/preferences/email',
  termsUrl: 'https://www.passes.com/terms',
  privacyUrl: 'https://www.passes.com/privacy',
  cookiesUrl: 'https://www.passes.com/cookies',
  supportEmail: 'support@passes.com',
  year: new Date().getFullYear(),
}
