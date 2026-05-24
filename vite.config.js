import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

function copySqliteWasm() {
  return {
    name: 'copy-sqlite-wasm',
    writeBundle() {
      const sourcePath = path.resolve(__dirname, 'node_modules/@sqlite.org/sqlite-wasm/dist/sqlite3.wasm')
      const destinationPath = path.resolve(__dirname, 'dist/assets/sqlite3.wasm')

      fs.mkdirSync(path.dirname(destinationPath), { recursive: true })
      fs.copyFileSync(sourcePath, destinationPath)
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
  plugins: [vue(), copySqliteWasm()],
})
