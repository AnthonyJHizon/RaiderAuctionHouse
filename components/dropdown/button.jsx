import Link from 'next/link';

import { usePathname } from 'next/navigation';

export default function Button({ name, itemClass }) {
	const pathname = usePathname().split('/');

	const realm = pathname[1];
	const auctionHouse = pathname[2];

	return (
		<>
			{itemClass ? (
				<button className="flex justify-center items-center bg-royal-blue group-hover:bg-cyan hover:bg-cyan text-white w-full h-full">
					<Link
						href={{
							pathname: `../${realm}/${auctionHouse}`,
							query: itemClass === 'All' ? {} : { filter: itemClass },
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
