import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // تنظیمات سرور برای توسعه
  server: {
    host: "::", // اجازه می‌ده به همه اینترفیس‌ها (مثل localhost و IPهای شبکه) گوش بده
    port: 8080, // پورت پیش‌فرض برای توسعه
    strictPort: true, // اگر پورت 8080 مشغول باشه، Vite خطا می‌ده به جای تغییر پورت
    watch: {
      usePolling: true, // برای محیط‌های داکرایز شده که hot-reload مشکل داره
    },
  },

  // تنظیمات برای بیلد پروداکشن
  build: {
    outDir: "dist", // پوشه خروجی بیلد (با Nginx هماهنگه)
    sourcemap: mode === "development", // فقط در توسعه sourcemap تولید بشه
    minify: "esbuild", // مینی‌فای کردن با esbuild برای سرعت و حجم کمتر
    target: "esnext", // هدف بیلد برای مرورگرهای مدرن
    rollupOptions: {
      output: {
        // برای بهینه‌سازی chunkها
        manualChunks: {
          vendor: ["react", "react-dom"], // کتابخانه‌های بزرگ جدا بشن
        },
      },
    },
  },

  // پلاگین‌ها
  plugins: [
    react(), // پلاگین React با SWC برای کامپایل سریع‌تر
    mode === "development" && componentTagger(), // فقط در توسعه اجرا بشه
  ].filter(Boolean), // حذف مقادیر false/null از آرایه

  // تنظیم alias برای ساده‌تر کردن importها
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // شورت‌کات برای پوشه src
    },
  },

  // تنظیم base برای هماهنگی با Nginx
  base: mode === "production" ? "/" : "/", // برای پروداکشن و توسعه ریشه باشه

  // بهینه‌سازی برای محیط‌های داکر
  optimizeDeps: {
    include: ["react", "react-dom"], // پیش‌کامپایل کتابخانه‌های اصلی
  },
}));