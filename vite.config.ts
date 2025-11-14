import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/",                       // IMPORTANT for correct asset URLs in production
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    outDir: "dist",                // ensure Amplify uses 'dist' as artifact folder
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        // split vendor chunks to avoid a single massive bundle
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom")) return "vendor-react";
            return "vendor";
          }
        }
      }
    },
    // raise the warning threshold (optional)
    chunkSizeWarningLimit: 600
  }
}));
