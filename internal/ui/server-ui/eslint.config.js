import pbxxBase from "@promoboxx/eslint-config";
import pbxxPrettier from "@promoboxx/eslint-config/prettier";
import { defineConfig } from "eslint/config";

const config = defineConfig([
  // Base config applies to all projects.
  ...pbxxBase,
  // If the project uses vitest:
  // ...pbxxVitest,
  // If the project uses react:
  // ...pbxxReact,
  // If the project uses graphql:
  // ...pbxxGraphql,
  // If the project uses prettier:
  ...pbxxPrettier,
]);

export default config;
