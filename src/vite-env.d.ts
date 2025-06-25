/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_OTHER_VAR?: string;
    // أضف متغيرات البيئة الأخرى هنا
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }