import { pluginOptions, viteConfig } from '@promoboxx/react-scripts-vite'
import { tanstackStart } from '@tanstack/solid-start/plugin/vite'
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

pluginOptions.react = false
pluginOptions.aliasHq = false
pluginOptions.checker = false

pluginOptions.svgr = false
pluginOptions.envCompatible = false
pluginOptions.pwa = false

export default defineConfig(async (env) => {
  return {
    // base: '/vite-config-base',

    plugins: [
      tanstackStart({
        // target: 'static',

        prerender: {
          enabled: true,
          onSuccess: ({ page }) => {
            console.log(`Rendered ${page.path}!`)
          },
        },

        // pages: [
        //   {
        //     path: '/',
        //     prerender: {
        //       enabled: true, crawlLinks: true,
        //       autoSubfolderIndex: true,
        //       onSuccess: ({ page }) => {
        //         console.log(`pages prerender Rendered ${page.path}!`)
        //       },
        //     }
        //   }
        // ],

        // spa: {
        //   enabled: true,
        //   prerender: {
        //     autoSubfolderIndex: true,
        //     enabled: true,
        //     // outputPath: '.',
        //     crawlLinks: true,
        // //     onSuccess: ({ page }) => {
        // //       console.log(`spa Rendered ${page.path}!`)
        // //     },
        //   }
        // }
      }),

      solid({ ssr: true }),
    ]
  }

  const config = await viteConfig(env)

  config.plugins?.push(tanstackStart(), solid({ ssr: true }))
  config.base = env.command === 'serve' ? undefined : '/static'

  config.server = {
    ...config.server,
    open: '/test',
  }

  config.build = {
    ...config.build,
    sourcemap: false,
  }

  console.log(config.plugins)

  return config
})
