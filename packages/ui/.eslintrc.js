module.exports = {
  extends: [
    "../../.eslintrc.js",
    "../../eslint-config/react",
    "../../eslint-config/strict",
    "next/core-web-vitals"
  ],
  parserOptions: {
    project: "./tsconfig.json"
  },
  overrides: [
    {
      files: ["./test/**/*", "**/*.test.ts"],
      rules: {
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/restrict-template-expressions": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/no-unsafe-argument": "off"
      }
    }
  ],
  rules: {
    "jsx-a11y/anchor-is-valid": "off"
  }
}
