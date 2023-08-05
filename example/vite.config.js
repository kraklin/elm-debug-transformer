import { defineConfig } from 'vite'
import plugin from 'vite-plugin-elm'
import transformer from 'vite-plugin-elm-debug-transformer'

export default defineConfig({
  plugins: [plugin(), transformer({theme: 'dark'}) ]
})
