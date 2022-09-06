module.exports = {
  extends: "../../.eslintrc.js",
  parserOptions: {
    project: "./tsconfig.json"
  },
  extends: [
    "next/core-web-vitals",
    // 'plugin:jsx-a11y/recommended',
    "plugin:react-hooks/recommended",
    "plugin:react/recommended"
  ],
  overrides: [
    {
      files: ["./src/**/*"],
      rules: {
        "@typescript-eslint/no-floating-promises": "off",
        "no-console": "off",
        // Breaking for some reason after upgrades
        "react/no-unknown-property": "off",
        "react/prop-types": "off",
        "react/react-in-jsx-scope": "off",
        "sonarjs/cognitive-complexity": "off",
        "sonarjs/no-duplicate-string": "off"
      }
    }
  ],
  // Easier to run JS scripts than have build require tsc-node
  ignorePatterns: ["*.config.js", "scripts/generate-robots-txt.js"]
}
