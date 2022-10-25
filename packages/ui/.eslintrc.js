module.exports = {
  extends: "../../.eslintrc.js",
  parserOptions: {
    project: "./tsconfig.json"
  },
  plugins: [
    "no-relative-import-paths"
    // "tailwind",
  ],
  extends: [
    "next/core-web-vitals",
    // 'plugin:jsx-a11y/recommended',
    "plugin:react-hooks/recommended",
    "plugin:react/recommended"
    // 'plugin:tailwindcss/recommended',
  ],
  rules: {
    "@next/next/no-img-element": "off",
    "no-console": ["error", { allow: ["error"] }],
    "no-relative-import-paths/no-relative-import-paths": [
      "error",
      { allowSameFolder: true }
    ],

    // Not needed for Next.js
    "react/react-in-jsx-scope": "off",

    // Unnecessary for frontend
    "sonarjs/cognitive-complexity": "off",
    "sonarjs/no-duplicate-string": "off"
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
