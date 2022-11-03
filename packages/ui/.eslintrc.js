module.exports = {
  extends: "../../.eslintrc.js",
  parserOptions: {
    project: "./tsconfig.json"
  },
  plugins: ["no-relative-import-paths", "tailwindcss"],
  extends: [
    "next/core-web-vitals",
    // 'plugin:jsx-a11y/recommended',
    "plugin:react-hooks/recommended",
    "plugin:react/all",
    "plugin:tailwindcss/recommended"
  ],
  rules: {
    // Opt in / adjust these rules
    "@typescript-eslint/no-explicit-any": "error",
    "no-console": ["error", { allow: ["error"] }],
    "no-relative-import-paths/no-relative-import-paths": [
      "error",
      { allowSameFolder: true }
    ],
    "react/jsx-filename-extension": ["error", { extensions: [".tsx"] }],
    "react/jsx-no-useless-fragment": ["error", { allowExpressions: "off" }],

    // Turned off since we often want to use <img> tags
    "@next/next/no-img-element": "off",

    // Consider turning on
    "tailwindcss/no-custom-classname": "off",
    "react/jsx-no-constructed-context-values": "off",
    "react/no-array-index-key": "off",
    "react/no-unstable-nested-components": "off",

    // Turned off since these conflict with prettier
    "react/jsx-curly-newline": "off",
    "react/jsx-child-element-spacing": "off",
    "react/jsx-indent-props": "off",
    "react/jsx-indent": "off",
    "react/jsx-max-props-per-line": "off",
    "react/jsx-newline": "off",
    "react/jsx-one-expression-per-line": "off",

    // Turned off since we currently don't follow these
    "react/forbid-component-props": "off",
    "react/function-component-definition": "off",
    "react/jsx-max-depth": "off",
    "react/jsx-no-bind": "off",
    "react/jsx-no-literals": "off",
    "react/jsx-props-no-spreading": "off",
    "react/button-has-type": "off",
    "react/no-multi-comp": "off",
    "react/require-default-props": "off",
    "sonarjs/cognitive-complexity": "off",

    // Turned off for a necessary issue
    "react/jsx-no-leaked-render": "off", // Does not respect boolean types
    "react/react-in-jsx-scope": "off" // Not needed for Next.js
  },
  overrides: [
    {
      files: ["src/pages/**"],
      rules: {
        "import/no-default-export": "off"
      }
    }
  ],
  // Easier to run JS scripts than have build require tsc-node
  ignorePatterns: ["*.config.js", "scripts/generate-robots-txt.js"]
}
