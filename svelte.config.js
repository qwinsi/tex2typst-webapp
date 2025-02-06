import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import inlineSvg from '@svelte-put/preprocess-inline-svg';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		// https://v3.tailwindcss.com/docs/guides/sveltekit
		vitePreprocess(),
        // https://www.npmjs.com/package/@svelte-put/preprocess-inline-svg
		inlineSvg([ { directories: 'src/assets', }, ]),
	],
};
export default config;