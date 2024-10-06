import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import { fileURLToPath, URL } from 'url';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { vitePluginSsrCss } from '@hiogawa/vite-plugin-ssr-css';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  resolve: {
    alias: [
      {
        find: '~',
        replacement: fileURLToPath(new URL('./', import.meta.url))
      },
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url))
      },
      {
        find: 'assets',
        replacement: fileURLToPath(new URL('./src/assets', import.meta.url))
      },
      {
        find: 'pages',
        replacement: fileURLToPath(new URL('./src/pages', import.meta.url))
      },
      {
        find: 'components',
        replacement: fileURLToPath(new URL('./src/components', import.meta.url))
      },
      {
        find: 'stores',
        replacement: fileURLToPath(new URL('./src/stores', import.meta.url))
      },
      {
        find: 'utils',
        replacement: fileURLToPath(new URL('./src/utils', import.meta.url))
      },
      {
        find: 'services',
        replacement: fileURLToPath(new URL('./src/services', import.meta.url))
      },
      {
        find: 'common',
        replacement: fileURLToPath(new URL('./src/common', import.meta.url))
      },
      {
        find: 'constants',
        replacement: fileURLToPath(new URL('./src/constants', import.meta.url))
      },
      {
        find: 'types',
        replacement: fileURLToPath(new URL('./src/types', import.meta.url))
      }
    ]
  },
  plugins: [
    vue(),
    svgLoader({
      // defaultImport: 'component'
      // svgo: false
    }),
    AutoImport({
      resolvers: [AntDesignVueResolver()]
    }),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: 'css-in-js' // css in js
        })
      ]
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
    // vitePluginSsrCss({ entries: ['/src/entry-client'] })
  ],
  server: {
    port: 5173
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 512
  },
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `@import "~/assets/style/globalStyle/_variables.scss";`
        additionalData:
          '@use "@/assets/style/globalStyle/_variables.scss" as *;'
      }
    },
    transformer: 'postcss',
    lightningcss: {
      errorRecovery: true
    },
    postcss: {
      plugins: []
    }
  }
});
