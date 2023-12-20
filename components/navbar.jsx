import Link from 'next/link';

export default function Navbar() {
	return (
		<div className="flex w-full h-[5%] justify-center items-center bg-black text-white text-4xl font-bold">
			<Link href="/" className="text-4xl">
				Raider Auction House
			</Link>
		</div>
	);
}
