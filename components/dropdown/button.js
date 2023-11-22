import Link from 'next/link';

import { useRouter } from 'next/router';

export default function Button({ name, itemClass }) {
	const router = useRouter();
	const { realm, auctionHouse } = router.query;

	return (
		<>
			{itemClass ? (
				<button className="flex justify-center items-center bg-royal-blue group-hover:bg-cyan text-white w-full h-full">
					<Link
						href={{
							pathname: `../${realm}/${auctionHouse}`,
							query: { filter: itemClass },
						}}
						style={{
							display: 'inline',
							height: '100%',
							width: '100%',
						}}
					>
						<div className="flex justify-center items-center w-full h-full">
							{name}
						</div>
					</Link>
				</button>
			) : (
				<button className="bg-royal-blue group-hover:bg-cyan text-white w-full h-full">
					{name}
				</button>
			)}
		</>
	);
}
