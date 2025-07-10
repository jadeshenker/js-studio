import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import prettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ["postcss.config.mjs", "next.config.js", "node_modules", ".next", "public", "**/*.cjs"],
  },
  // Base JS config
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      ...js.configs.recommended.rules,
      quotes: ["error", "double"],
      semi: ["error", "always"],
      "max-len": ["error", { code: 128 }],
      indent: ["error", "tab"],
    },
  },
  // TypeScript config
  // ts-specific type-aware linting
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
  },
  ...tseslint.configs.recommended,
  // React config
  {
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  // Prettier overrides (disables conflicting ESLint rules)
  {
    name: "prettier",
    rules: prettier.rules,
  },
]);
