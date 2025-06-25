import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import checker from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // ✅ تحميل متغيرات البيئة بناءً على الـ mode
  const env = loadEnv(mode, process.cwd());

  // ✅ قراءة المتغير المطلوب
  const url = env.VITE_API_URL;

  return {
    build: {
      chunkSizeWarningLimit: 10000,
    },
    plugins: [
      react(),
      tsconfigPaths(),
      checker({
        typescript: true,
        eslint: {
          lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
        },
      }),
    ],
    base: './',
    server: {
      host: '0.0.0.0',
      port: 3000,
      proxy: {
        "/api": {
          target: url,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
