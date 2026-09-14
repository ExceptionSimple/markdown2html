import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { previewSyncPlugin } from './plugins/previewSyncPlugin.ts'

const isElectron = process.env.ELECTRON === 'true'

export default defineConfig(async () => {
  const plugins = [
    vue(),
    tailwindcss(),
    previewSyncPlugin()
  ]

  if (isElectron) {
    const electron = (await import('vite-plugin-electron')).default
    plugins.push(
      electron([
        {
          entry: 'electron/main.ts',
          vite: {
            build: {
              outDir: 'dist-electron',
              rollupOptions: {
                external: ['electron']
              }
            }
          }
        },
        {
          entry: 'electron/preload.ts',
          onstart(args) {
            args.reload()
          },
          vite: {
            build: {
              outDir: 'dist-electron',
              rollupOptions: {
                external: ['electron']
              }
            }
          }
        }
      ])
    )
  }

  return {
    plugins,
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
        // juice needs client bundle in browser
        'juice': path.resolve(import.meta.dirname, './node_modules/juice/client.js'),
        // Browser shims to eliminate externalized compatibility warnings
        'path': path.resolve(import.meta.dirname, './src/shims/path.ts'),
        'fs': path.resolve(import.meta.dirname, './src/shims/fs.ts'),
        'url': path.resolve(import.meta.dirname, './src/shims/url.ts'),
        'source-map-js': path.resolve(import.meta.dirname, './src/shims/source-map-js.ts')
      }
    },
    server: {
      port: 5173,
      host: true
    },
    build: {
      emptyOutDir: true
    }
  }
})
