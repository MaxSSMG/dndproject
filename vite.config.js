import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

function copySqliteAssets() {
  return {
    name: 'copy-sqlite-assets',
    writeBundle() {
      const assetsDir = path.resolve(__dirname, 'dist/assets')
      const sourceFiles = [
        'sqlite3.wasm',
        'sqlite3-opfs-async-proxy.js',
      ]

      fs.mkdirSync(assetsDir, { recursive: true })

      for (const fileName of sourceFiles) {
        const sourcePath = path.resolve(__dirname, 'node_modules/@sqlite.org/sqlite-wasm/dist', fileName)
        const destinationPath = path.resolve(assetsDir, fileName)

        fs.copyFileSync(sourcePath, destinationPath)
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
  optimizeDeps: {
    exclude: ["@sqlite.org/sqlite-wasm"],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [vue(), copySqliteAssets()],
})
