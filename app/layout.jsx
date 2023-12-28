import '../styles/globals.css';

export const metadata = {
	title: 'Raider Auction House',
	description: 'Search through filtered auction house data for WOTLK Classic',
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
