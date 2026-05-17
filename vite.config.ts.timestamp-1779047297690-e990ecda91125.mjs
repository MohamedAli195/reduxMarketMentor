// vite.config.ts
import react from "file:///C:/reduxMarketMentor/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { defineConfig, loadEnv } from "file:///C:/reduxMarketMentor/node_modules/vite/dist/node/index.js";
import checker from "file:///C:/reduxMarketMentor/node_modules/vite-plugin-checker/dist/esm/main.js";
import tsconfigPaths from "file:///C:/reduxMarketMentor/node_modules/vite-tsconfig-paths/dist/index.mjs";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const url = env.VITE_API_URL;
  return {
    build: {
      chunkSizeWarningLimit: 1e4
    },
    plugins: [
      react(),
      tsconfigPaths(),
      checker({
        typescript: true,
        eslint: {
          lintCommand: 'eslint "./src/**/*.{ts,tsx}"'
        }
      })
    ],
    base: "./",
    server: {
      host: "0.0.0.0",
      port: 3e3,
      proxy: {
        "/api": {
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: false,
          // ✅ استخدم هذا rewrite
          rewrite: (path) => path.replace(/^\/api/, "")
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxyZWR1eE1hcmtldE1lbnRvclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxccmVkdXhNYXJrZXRNZW50b3JcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L3JlZHV4TWFya2V0TWVudG9yL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcbmltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IGNoZWNrZXIgZnJvbSAndml0ZS1wbHVnaW4tY2hlY2tlcic7XG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tICd2aXRlLXRzY29uZmlnLXBhdGhzJztcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgLy8gXHUyNzA1IFx1MDYyQVx1MDYyRFx1MDY0NVx1MDY0QVx1MDY0NCBcdTA2NDVcdTA2MkFcdTA2M0FcdTA2NEFcdTA2MzFcdTA2MjdcdTA2MkEgXHUwNjI3XHUwNjQ0XHUwNjI4XHUwNjRBXHUwNjI2XHUwNjI5IFx1MDYyOFx1MDY0Nlx1MDYyN1x1MDYyMVx1MDY0QiBcdTA2MzlcdTA2NDRcdTA2NDkgXHUwNjI3XHUwNjQ0XHUwNjQwIG1vZGVcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpKTtcblxuICAvLyBcdTI3MDUgXHUwNjQyXHUwNjMxXHUwNjI3XHUwNjIxXHUwNjI5IFx1MDYyN1x1MDY0NFx1MDY0NVx1MDYyQVx1MDYzQVx1MDY0QVx1MDYzMSBcdTA2MjdcdTA2NDRcdTA2NDVcdTA2MzdcdTA2NDRcdTA2NDhcdTA2MjhcbiAgY29uc3QgdXJsID0gZW52LlZJVEVfQVBJX1VSTDtcblxuICByZXR1cm4ge1xuICAgIGJ1aWxkOiB7XG4gICAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDEwMDAwLFxuICAgIH0sXG4gICAgcGx1Z2luczogW1xuICAgICAgcmVhY3QoKSxcbiAgICAgIHRzY29uZmlnUGF0aHMoKSxcbiAgICAgIGNoZWNrZXIoe1xuICAgICAgICB0eXBlc2NyaXB0OiB0cnVlLFxuICAgICAgICBlc2xpbnQ6IHtcbiAgICAgICAgICBsaW50Q29tbWFuZDogJ2VzbGludCBcIi4vc3JjLyoqLyoue3RzLHRzeH1cIicsXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICBdLFxuICAgIGJhc2U6ICcuLycsXG4gICAgc2VydmVyOiB7XG4gIGhvc3Q6ICcwLjAuMC4wJyxcbiAgcG9ydDogMzAwMCxcbiAgcHJveHk6IHtcbiAgICAnL2FwaSc6IHtcbiAgICAgIHRhcmdldDogZW52LlZJVEVfQVBJX1VSTCxcbiAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgIHNlY3VyZTogZmFsc2UsXG4gICAgICAvLyBcdTI3MDUgXHUwNjI3XHUwNjMzXHUwNjJBXHUwNjJFXHUwNjJGXHUwNjQ1IFx1MDY0N1x1MDYzMFx1MDYyNyByZXdyaXRlXG4gICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpLywgJycpLCBcbiAgICB9LFxuICB9LFxufSxcbiAgfTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFrUCxPQUFPLFdBQVc7QUFDcFEsU0FBUyxjQUFjLGVBQWU7QUFDdEMsT0FBTyxhQUFhO0FBQ3BCLE9BQU8sbUJBQW1CO0FBRzFCLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxNQUFNO0FBRXhDLFFBQU0sTUFBTSxRQUFRLE1BQU0sUUFBUSxJQUFJLENBQUM7QUFHdkMsUUFBTSxNQUFNLElBQUk7QUFFaEIsU0FBTztBQUFBLElBQ0wsT0FBTztBQUFBLE1BQ0wsdUJBQXVCO0FBQUEsSUFDekI7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE1BQU07QUFBQSxNQUNOLGNBQWM7QUFBQSxNQUNkLFFBQVE7QUFBQSxRQUNOLFlBQVk7QUFBQSxRQUNaLFFBQVE7QUFBQSxVQUNOLGFBQWE7QUFBQSxRQUNmO0FBQUEsTUFDRixDQUFDO0FBQUEsSUFDSDtBQUFBLElBQ0EsTUFBTTtBQUFBLElBQ04sUUFBUTtBQUFBLE1BQ1YsTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sT0FBTztBQUFBLFFBQ0wsUUFBUTtBQUFBLFVBQ04sUUFBUSxJQUFJO0FBQUEsVUFDWixjQUFjO0FBQUEsVUFDZCxRQUFRO0FBQUE7QUFBQSxVQUVSLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxVQUFVLEVBQUU7QUFBQSxRQUM5QztBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRTtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
