/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{svelte,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
  future: {
    // Disable hover styles on mobile.
    // https://github.com/tailwindlabs/tailwindcss/discussions/1739?sort=top#discussioncomment-3630717
    hoverOnlyWhenSupported: true,
  },
}

