import { pluginOptions, viteConfig } from '@promoboxx/react-scripts-vite'
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

pluginOptions.react = false

export default defineConfig(async (env) => {
  const config = await viteConfig(env)

  config.plugins = [solid(), ...config.plugins]
  config.base = env.command === 'serve' ? undefined : '/static'

  config.build = {
    ...config.build,
    sourcemap: false,
  }

  return config
})
