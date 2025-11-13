import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

const DEV_PROXY_TARGET = process.env.VITE_DEV_API_PROXY || "http://localhost:3000";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/",
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: ["./client", "./shared", "./"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
    // Proxy API requests to the backend server during development
    proxy: {
      "/api": {
        target: DEV_PROXY_TARGET,
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: "dist",
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.svg?react'],
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    configureServer(server) {
      const app = createServer();
      
      // Add Express app as middleware to Vite dev server
      server.middlewares.use((req, res, next) => {
        // Skip Express handling for API requests (let proxy handle them)
        if (req.url?.startsWith('/api/')) {
          next();
          return;
        }
        // Let Express handle all other requests
        // @ts-ignore - Type mismatch between Vite and Express request objects
        app(req, res, next);
      });
    },
  };
}