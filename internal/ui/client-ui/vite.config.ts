import { pluginOptions, viteConfig } from "@promoboxx/react-scripts-vite";
import { defineConfig } from "vite";

pluginOptions.react = false;
// pluginOptions.checker = false;

export default defineConfig(async (env) => {
  const config = await viteConfig(env);

  return config;
});
