import Link from 'next/link';

import { useRouter } from 'next/router';

export default function Button({ name, itemClass }) {
	const router = useRouter();
	const { realm, auctionHouse } = router.query;

	return (
		<>
			{itemClass ? (
				<Link
					href={{
						pathname: `../${realm}/${auctionHouse}`,
						query: { filter: itemClass },
					}}
				>
					<button className="bg-royal-blue group-hover:bg-cyan text-white w-full h-full">
						{name}
					</button>
				</Link>
			) : (
				<button className="bg-royal-blue group-hover:bg-cyan text-white w-full h-full">
					{name}
				</button>
			)}
		</>
	);
}
