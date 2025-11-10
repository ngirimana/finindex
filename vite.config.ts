import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [tsconfigPaths(), tailwindcss(), reactRouter()],
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./app", import.meta.url)),
      "@": fileURLToPath(new URL("./app", import.meta.url)),
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      onwarn(warning, defaultHandler) {
        if (
          warning.code === "SOURCEMAP_ERROR" ||
          /sourcemap.*original location/i.test(warning.message || "")
        ) return;
        defaultHandler(warning);
      },
    },
  },
  css: { devSourcemap: false },
  esbuild: { sourcemap: false },
  ssr: { sourcemap: false },
  server: { sourcemapIgnoreList: () => true },
});
