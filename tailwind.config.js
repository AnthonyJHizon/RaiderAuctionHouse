/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			backgroundImage: {
				cataclysm: "url('../public/backgrounds/background-cata.webp')",
			},
			colors: {
				primary: '#a10202',
				secondary: '#e30202',
			},
			fontSize: {
				'normal-1': 'clamp(12px, 1vw, 24px)',
				'header-1': 'clamp(16px, 3vw, 40px)',
				'header-2': 'clamp(14px, 2.5vw, 32px)',
				'title-1': 'clamp(24px, 4vw, 46px)',
				'title-2': 'clamp(24px, 3vw, 36px)',
			},
		},
	},
	plugins: [require('tailwind-scrollbar')({ nocompatible: true })],
};
