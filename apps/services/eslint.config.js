// @ts-check

import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  js.configs.recommended,
  .../**@type {any} */tseslint.configs.recommended,
  {
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
    }
  },
  {
    ignores: ["dist/", "node_modules/"],
  }
]);
