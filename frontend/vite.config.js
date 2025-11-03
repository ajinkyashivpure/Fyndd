import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { SitemapPlugin } from 'vite-plugin-sitemap'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react() , tailwindcss() ,SitemapPlugin({
    hostname: 'https://fyndd.in',
    routes: ['/', '/features', '/about'],
  }),],
  server: {
    historyApiFallback: true,
  },
  preview: {
    historyApiFallback: true,
  }
})
