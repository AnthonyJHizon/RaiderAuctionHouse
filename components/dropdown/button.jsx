import Link from 'next/link';

import { usePathname } from 'next/navigation';

export default function Button({ name, itemClass }) {
	const pathname = usePathname().split('/');

	const realm = pathname[1];
	const auctionHouse = pathname[2];

	return (
		<>
			{itemClass ? (
				<button className="flex justify-center items-center bg-primary group-hover:bg-secondary hover:bg-secondary transition-all duration-500 ease-out text-white w-full h-full">
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
				<button className="bg-primary group-hover:bg-secondary text-white w-full h-full transition-all duration-500 ease-out">
					{name}
				</button>
			)}
		</>
	);
}
