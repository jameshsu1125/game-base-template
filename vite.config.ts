import { resolve } from "path";
import { visualizer } from "rollup-plugin-visualizer";
import type { PluginOption } from "vite";
import { defineConfig } from "vite";

// Plugin to move scripts to body
const moveScriptToBody = (): PluginOption => {
  return {
    name: "move-script-to-body",
    apply: "build", // Only apply during build
    transformIndexHtml(html) {
      // Remove scripts from head and add them to body
      return html
        .replace(/<script\b[^>]*type="module"[^>]*>.*?<\/script>/g, "")
        .replace(
          "</body>",
          `    <script type="module" src="_ASSETS_/index.js"></script>
    </body>`
        );
    },
  };
};

export default defineConfig({
  root: "./",
  base: "",
  server: {
    open: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        entryFileNames: "_ASSETS_/index.js",
        chunkFileNames: "[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
  plugins: [visualizer({ open: false }), moveScriptToBody()],
});
