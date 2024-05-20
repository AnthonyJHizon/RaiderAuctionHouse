import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Content({
	element,
	queryParams,
	itemClass,
	realms,
	auctionHouses,
	type,
}) {
	const pathname = usePathname().split('/');
	const realm = pathname[1];
	const auctionHouse = pathname[2];

	const newPathname = {
		AuctionHouse: {
			pathname: `../${realm}/${element}`,
			query: queryParams,
		},
		Realm: { pathname: `../${element}/${auctionHouse}`, query: queryParams },
		Filter: {
			pathname: `../${realm}/${auctionHouse}`,
			query: { filter: itemClass, subclass: element },
		},
	};

	const elementName = {
		AuctionHouse: auctionHouses && auctionHouses[element],
		Realm: realms && realms[element],
		Filter: element,
	};

	return (
		<Link href={newPathname[type]}>
			<div className="h-fit w-full hover:bg-neutral-200">
				{elementName[type]}
			</div>
		</Link>
	);
}
