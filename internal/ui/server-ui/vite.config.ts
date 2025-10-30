import { pluginOptions, viteConfig } from '@promoboxx/react-scripts-vite'
import { tanstackStart } from '@tanstack/solid-start/plugin/vite'
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

// It's solid ...
pluginOptions.react = false
// package.json import aliasing
pluginOptions.aliasHq = false

// TODO Check if works as expected in tanstack start
pluginOptions.svgr = false
// Just commit to import.meta.env
pluginOptions.envCompatible = false
// TODO Check if works as expected in tanstack start
pluginOptions.pwa = false
// Breaks tanstack start
pluginOptions.splitVendorChunkPlugin = false

pluginOptions.checker = false

export default defineConfig(async (env) => {
  const config = await viteConfig(env)

  config.plugins?.push(
    tanstackStart({
      // target: 'static',

      // prerender: {
      //   enabled: true,
      //   autoSubfolderIndex: true,
      //   autoStaticPathsDiscovery: true,
      // },

      // pages: [
      //   {
      //     path: '/',
      //     prerender: {
      //       enabled: true,
      //       crawlLinks: true,
      //       autoSubfolderIndex: true,
      //       onSuccess: ({ page }) => {
      //         console.log(`pages prerender Rendered ${page.path}!`)
      //       },
      //     },
      //   },

      //   {
      //     path: '/lol',
      //     prerender: {
      //       enabled: true,
      //       crawlLinks: true,
      //       autoSubfolderIndex: true,
      //       onSuccess: ({ page }) => {
      //         console.log(`pages prerender Rendered ${page.path}!`)
      //       },
      //     },
      //   },
      // ],

      spa: {
        enabled: true,
        prerender: {
          enabled: true,
        },
        //   prerender: {
        //     autoSubfolderIndex: true,
        //     enabled: true,
        //     // outputPath: '.',
        //     crawlLinks: true,
        // //     onSuccess: ({ page }) => {
        // //       console.log(`spa Rendered ${page.path}!`)
        // //     },
        //   }
      },
    }),
    solid({ ssr: true }),
  )
  // config.base = env.command === 'serve' ? undefined : '/static'

  config.server = {
    ...config.server,
    open: '/test',
  }

  config.build = {
    ...config.build,
    // sourcemap: false,
    rollupOptions: {
      output: {
        entryFileNames: 'static/assets/[name]-[hash].js',
        chunkFileNames: 'static/assets/[name]-[hash].js',
        assetFileNames: 'static/assets/[name]-[hash][extname]',
      },
    },
  }

  return config
})
