import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
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
      // Local-only routes power internal animation tooling and should not ship in non-local builds.
      "@/dev-routes": path.resolve(
        __dirname,
        mode === "development" ? "./src/dev/DevRoutes.tsx" : "./src/dev/NoopRoutes.tsx",
      ),
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
