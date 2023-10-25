/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				'royal-blue': '#04729e',
				cyan: '#058fc5',
			},
		},
	},
	plugins: [require('tailwind-scrollbar')({ nocompatible: true })],
};
