// eslint.config.js
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier/recommended";

export default tseslint.config(
  // Start with recommended JavaScript rules
  eslint.configs.recommended,

  // Add TypeScript-specific rules
  ...tseslint.configs.recommended,

  // Configure language options for all files
  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },

  prettier,

  // Ignore patterns
  {
    ignores: ["dist/", "build/", "node_modules/", "eslint.config.mjs"],
  },
);
