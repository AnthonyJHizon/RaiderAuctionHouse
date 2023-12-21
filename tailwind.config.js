/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			backgroundImage: {
				icecrown: "url('../public/background.jpg')",
				banner: "url('../public/banner.jpg')",
			},
			colors: {
				'royal-blue': '#04729e',
				cyan: '#058fc5',
			},
			fontSize: {
				'normal-1': 'clamp(.75rem, .9vw, 2rem)',
				'header-1': 'clamp(1rem, 2.25vw, 2.5rem)',
				'header-2': 'clamp(1rem, 1.5vw, 2.25rem)',
			},
		},
	},
	plugins: [require('tailwind-scrollbar')({ nocompatible: true })],
};
