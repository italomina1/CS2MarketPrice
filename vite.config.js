import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const base = process.env.GH_PAGES ? '/CS2MarketPrice/' : '/'

export default defineConfig({
  plugins: [react()],
  base,
})
