import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { SITE_CONFIG } from './src/config'

// Plugin to inject meta tags from config at build time
function injectMetaTags(): Plugin {
  return {
    name: 'inject-meta-tags',
    transformIndexHtml(html) {
      const replacements: Record<string, string> = {
        '%SITE_TITLE%': SITE_CONFIG.title,
        '%SITE_DESCRIPTION%': SITE_CONFIG.description,
        '%SITE_AUTHOR%': SITE_CONFIG.author,
        '%SITE_URL%': SITE_CONFIG.url,
        '%SITE_IMAGE%': `${SITE_CONFIG.url}${SITE_CONFIG.defaultImage}`,
        '%SITE_LOCALE%': SITE_CONFIG.locale,
        '%TWITTER_HANDLE%': SITE_CONFIG.twitterHandle || '',
      }

      let result = html
      for (const [key, value] of Object.entries(replacements)) {
        result = result.replace(new RegExp(key, 'g'), value)
      }
      return result
    },
  }
}

export default defineConfig({
  plugins: [react(), injectMetaTags()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-markdown': ['react-markdown', 'rehype-highlight'],
          'vendor-motion': ['framer-motion'],
          'vendor-icons': ['lucide-react'],
        },
      },
    },
  },
})