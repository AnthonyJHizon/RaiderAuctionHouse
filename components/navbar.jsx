import Link from 'next/link';

export default function Navbar() {
	return (
		<div className="flex w-full h-[5%] justify-center items-center bg-black text-white text-title-1 font-bold">
			<Link href="/">Raider Auction House</Link>
		</div>
	);
}
