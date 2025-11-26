import { pluginOptions, viteConfig } from '@promoboxx/react-scripts-vite'
import { tanstackStart } from '@tanstack/solid-start/plugin/vite'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import type { SolidSVGPluginOptions } from 'vite-plugin-solid-svg'
import solidSvg from 'vite-plugin-solid-svg'

let svgoConfig: NonNullable<SolidSVGPluginOptions['svgo']>['svgoConfig']
if (pluginOptions.svgr && typeof pluginOptions.svgr === 'object') {
  svgoConfig = { ...pluginOptions.svgr.svgrOptions?.svgoConfig }
}

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

  config.plugins?.unshift(vanillaExtractPlugin())

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

  config.plugins?.push(
    solidSvg({
      svgo: {
        enabled: true,
        svgoConfig: {
          ...svgoConfig,
        },
      },
    }),
  )

  config.server = {
    ...config.server,
    open: '/test',
  }

  config.build = {
    ...config.build,
    sourcemap: false,
    cssMinify: 'lightningcss',
    rollupOptions: {
      output: {
        entryFileNames: 'static/assets/[name]-[hash].js',
        chunkFileNames: 'static/assets/[name]-[hash].js',
        assetFileNames: 'static/assets/[name]-[hash][extname]',
      },
    },
  }

  config.css = {
    ...config.css,
    transformer: 'lightningcss',
  }

  config.resolve = {
    ...config.resolve,
    dedupe: [
      ...(config.resolve?.dedupe || []),
      'solid-js',
      '@vanilla-extract/css',
    ],
  }

  return config
})
