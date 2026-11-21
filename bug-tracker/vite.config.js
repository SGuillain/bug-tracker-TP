import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// En développement, les appels /api/... sont redirigés vers l'API Symfony.
// Le navigateur ne voit qu'une seule origine : pas de problème de CORS.
// Changez la cible si votre API n'écoute pas sur le port 8000.
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
