import { defineConfig } from "tsup"

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["cjs", "esm"],
	clean: true,
	dts: true,
	sourcemap: true,
	splitting: false,
	external: ["react", "react-dom"],
	treeshake: true,
	minify: false,
	injectStyle: true,
})
