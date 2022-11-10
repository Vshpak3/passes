module.exports = {
  extends: "../../.eslintrc.js",
  parserOptions: {
    project: "./tsconfig.json"
  },
  plugins: ["no-relative-import-paths", "tailwindcss"],
  extends: [
    "next/core-web-vitals",
    "plugin:jsx-a11y/recommended",
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
    "react/function-component-definition": [
      "error",
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function"
      }
    ],
    "react/jsx-filename-extension": ["error", { extensions: [".tsx"] }],
    "react/jsx-no-useless-fragment": ["error", { allowExpressions: "off" }],
    "react/no-unstable-nested-components": ["error", { allowAsProps: true }],

    // Turned off since we often want to use <img> tags
    "@next/next/no-img-element": "off",

    // Turned off since these conflict with prettier
    "react/jsx-curly-newline": "off",
    "react/jsx-child-element-spacing": "off",
    "react/jsx-indent-props": "off",
    "react/jsx-indent": "off",
    "react/jsx-max-props-per-line": "off",
    "react/jsx-newline": "off",
    "react/jsx-one-expression-per-line": "off",

    // Turned off since we currently don't follow these
    "jsx-a11y/click-events-have-key-events": "off", // Consider turning on
    "jsx-a11y/label-has-associated-control": "off", // Consider turning on
    "jsx-a11y/no-noninteractive-element-interactions": "off", // Consider turning on
    "jsx-a11y/no-static-element-interactions": "off", // Consider turning on
    "react/button-has-type": "off",
    "react/forbid-component-props": "off",
    "react/jsx-max-depth": "off",
    "react/jsx-no-bind": "off",
    "react/jsx-no-literals": "off",
    "react/jsx-props-no-spreading": "off",
    "react/no-array-index-key": "off", // Consider turning on
    "jsx-a11y/media-has-caption": "off",
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
