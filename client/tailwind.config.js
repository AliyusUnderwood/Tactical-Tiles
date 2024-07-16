/**
 * @format
 * @type {import('tailwindcss').Config}
 */

export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				montserrat: ['Montserrat'],
				lato: ['Lato'],
				garamond: ['Garamond'],
			},
		},
	},
	plugins: [
		function ({ addUtilities }) {
			addUtilities({
				'.easyEase': {
					transition: 'all 0.35s cubic-bezier(0.465, 0.183, 0.153, 0.946)',
				},
			});
		},
	],
};
