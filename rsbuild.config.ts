import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [pluginReact()],
  output: {
    assetPrefix: ".",
  },
  html: {
    favicon: "./src/assets/icon.png",
  },
});
