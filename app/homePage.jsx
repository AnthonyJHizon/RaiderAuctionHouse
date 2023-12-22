'use client';

import Link from 'next/link';

import Navbar from '../components/navbar';
import Footer from '../components/footer';

export default function HomePage({ data }) {
	let realmsArr = [];
	Object.keys(data).forEach((realm) => {
		let auctionHouses = [];
		Object.keys(data[realm].auctionHouses).forEach((auctionHouse) => {
			auctionHouses.push(
				<Link
					key={realm + '-' + auctionHouse}
					href={`/${realm}/${auctionHouse}`}
				>
					<div className="relative h-[33.34%] opacity-[.99] transition-all duration-500 ease-in-out hover:scale-110">
						<div className="absolute flex items-center justify-center text-center h-full w-full text-normal-1 z-50">
							{data[realm].auctionHouses[auctionHouse].numAuctions}{' '}
							{data[realm].auctionHouses[auctionHouse].numAuctions != 1
								? 'Auctions'
								: 'Auction'}
						</div>
						<img
							src={`/auctionHouses/${auctionHouse}.webp`}
							alt=""
							className="z-[-10] h-full w-full object-cover"
						/>
					</div>
				</Link>
			);
		});
		realmsArr.push(
			<div
				key={realm}
				className="group relative flex flex-col w-[250px] h-[500px]"
			>
				<img
					src={`/cards/${realm}.webp`}
					alt=""
					className="h-full w-full absolute top-0 left-0 transition-all ease-in-out duration-1000 opacity-0 z-0 group-hover:opacity-100 group-hover:blur group-hover:z-30 object-cover"
				/>
				<div className="flex items-center justify-center text-center bg-black h-[10%] overflow-hidden text-normal-1 z-40">
					{data[realm].realm}
				</div>
				<div className="flex relative flex-col overflow-hidden h-[90%] w-full transition-all ease-in-out duration-1000 group-hover:opacity-0">
					<img
						src={`/cards/${realm}.webp`}
						alt=""
						className="h-full w-full object-cover"
					/>
				</div>
				<div className="relative h-[35%] transition-all duration-700 ease-in-out cursor-pointer group-hover:z-30 group-hover:translate-y-[-75%]">
					{auctionHouses}
				</div>
			</div>
		);
	});
	realmsArr.sort((a, b) => a.key.localeCompare(b.key));
	return (
		<div className="flex flex-col items-center bg-icecrown bg-cover bg-no-repeat bg-center h-screen">
			<Navbar />
			<main className="flex flex-wrap justify-center items-center gap-[2.5%] bg-white/70 backdrop-blur-md font-bold h-screen lg:w-6/12 w-9/12 overflow-y-scroll text-white pt-5 pl-2.5 pr-2.5 pb-12 text-normal-1 scrollbar-none">
				{/* <Banner /> */}
				{realmsArr}
			</main>
			<Footer />
		</div>
	);
}
