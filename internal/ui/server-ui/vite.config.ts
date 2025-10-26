import { pluginOptions, viteConfig } from '@promoboxx/react-scripts-vite'
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

pluginOptions.react = false

export default defineConfig(async (env) => {
  const config = await viteConfig(env)

  config.plugins?.unshift(solid())
  config.base = env.command === 'serve' ? undefined : '/static'

  config.server = {
    ...config.server,
    open: '/test',
  }

  config.build = {
    ...config.build,
    sourcemap: false,
  }

  return config
})
