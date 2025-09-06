import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
	plugins: [pluginReact()],
	output: {
		manifest: true,
	},
	html: {
		favicon: "./src/assets/icon.png",
		title: "Assistent",
		meta: {
			"apple-mobile-web-app-capable": "yes",
			"apple-mobile-web-app-status-bar-style": "black-translucent",
			"apple-mobile-web-app-title": "AI",
			"mobile-web-app-capable": "yes",
			"theme-color": "black",
			"viewport": "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
		}
	},
});
