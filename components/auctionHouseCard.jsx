import { Suspense } from 'react';

import Link from 'next/link';
import { unstable_noStore } from 'next/server';

import { cacheGet } from '../lib/clients/redis/client';

export default async function AuctionHouseCard({ realm, auctionHouse }) {
	unstable_noStore();

	return (
		<Link key={realm + '-' + auctionHouse} href={`/${realm}/${auctionHouse}`}>
			<div className="relative h-16 opacity-[.99] transition-all duration-500 ease-in-out hover:scale-110">
				<div className="absolute flex items-center justify-center text-center h-full w-full text-normal-1 z-50">
					<Suspense fallback={<p className="animate-pulse">Loading</p>}>
						<NumAuctions realm={realm} auctionHouse={auctionHouse} />
					</Suspense>
				</div>
				<img
					src={`/auctionHouses/${auctionHouse}.webp`}
					alt=""
					className={`z-[-10] h-full w-full object-cover overflow-hidden group-hover:rounded-none ${
						auctionHouse === 'blackwater-auction-house' ? 'rounded-b-md' : ''
					}`}
				/>
			</div>
		</Link>
	);
}

async function NumAuctions({ realm, auctionHouse }) {
	const numAuctions = (await cacheGet(`${realm}/${auctionHouse}`)) ?? 0;
	return (
		<p>
			{numAuctions} {numAuctions != 1 ? 'Auctions' : 'Auction'}
		</p>
	);
}
