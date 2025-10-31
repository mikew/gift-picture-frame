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

export default defineConfig(async (env) => {
  const config = await viteConfig(env)

  config.plugins?.push(
    tanstackStart({
      pages: [
        // Prerender the $catchall route.
        {
          path: '/prerender',
          prerender: {
            enabled: true,
            outputPath: 'index.html',
          },
        },
      ],
    }),

    solid({ ssr: true }),
  )

  config.server = {
    ...config.server,
    open: '/test',
  }

  config.build = {
    ...config.build,
    sourcemap: false,
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
