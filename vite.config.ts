import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

export default defineConfig({
  plugins: [react()],
  base: '/golden-summit/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    open: true,
    port: 5185,
    strictPort: true,
    middleware: [
      (req, res, next) => {
        // Always serve index.html for any path that doesn't include a file extension
        // or is a direct request to /golden-summit/
        if (!req.url.includes('.') || req.url === '/golden-summit/') {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          const indexHtml = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
          return res.end(indexHtml);
        }
        next();
      }
    ]
  }
}) 