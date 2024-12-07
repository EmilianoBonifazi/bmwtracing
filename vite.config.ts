// /workspaces/bmwtracing/frontend/vite.config.ts

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "localhost", // Ensure consistency
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean), // Comma added here
  resolve: { // Ensure this property is correctly placed
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  }, // Ensure closing brace and comma
}));
