import { pluginOptions, viteConfig } from '@promoboxx/react-scripts-vite'
import { defineConfig } from 'vite'

pluginOptions.react = false

export default defineConfig(async (env) => {
  const config = await viteConfig(env)

  config.base = env.command === 'serve' ? undefined : '/static'

  return config
})
