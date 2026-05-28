import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  appType: "spa",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@styles": path.resolve(__dirname, "./src/styles"),
    },
  },
  build: {
    target: "es2025",
  },
  server: {
    host: "0.0.0.0",
    port: 8080,
    watch: {
      usePolling: true,
      interval: 100,
    },
    hmr: {
      clientPort: 8080,
    },
    proxy: {
      // Proxy API requests to backend service (default: http://backend:3000)
      "/api": {
        target: process.env.VITE_PROXY_TARGET || "http://backend:3000",
        changeOrigin: true,
        configure: (proxy) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            console.log("Proxying request:", req.method, req.url);
            proxyReq.setHeader("origin", "http://127.0.0.1:8080");
          });
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          proxy.on("error", (err, req, _res) => {
            console.warn("[Vite proxy] API request failed:", req.url, err.message);
          });
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            if (proxyRes.statusCode && proxyRes.statusCode >= 400) {
              console.warn("[Vite proxy] Backend returned", proxyRes.statusCode, req.url);
            }
          });
        },
      },
    },
  },
});
