import path from 'path'

export const MAIN_LAYOUT_PATH = path
  .join(__dirname, '..', '/layouts/main.html')
  .replace('dist/', '')
