import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		// https://v3.tailwindcss.com/docs/guides/sveltekit
		vitePreprocess(),
	],
};
export default config;