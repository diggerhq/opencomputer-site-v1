import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
// TODO: Switch animation lab exposure back behind a preview-only toggle before production launch.
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@/dev-routes": path.resolve(__dirname, "./src/dev/DevRoutes.tsx"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
