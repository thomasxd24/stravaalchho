import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves this project from /<repo>/, not the domain root.
  // Cloudflare Pages (and local dev) serve from the root, so only override when building for GH Pages.
  base: process.env.GITHUB_PAGES ? '/stravaalchho/' : '/',
  plugins: [react(), tailwindcss()],
})
