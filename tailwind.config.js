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
			},
			colors: {
				'royal-blue': '#04729e',
				cyan: '#058fc5',
			},
			fontSize: {
				'normal-1': 'clamp(0.2rem, 1vw, 2rem)',
				'header-1': 'clamp(0.8rem, 2.25vw, 1.8rem)',
				'header-2': 'clamp(0.6rem, 2vw, 1.6rem)',
			},
		},
	},
	plugins: [require('tailwind-scrollbar')({ nocompatible: true })],
};
