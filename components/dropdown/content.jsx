import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Content({
	element,
	queryParams,
	itemClass,
	realms,
	auctionHouses,
	type,
}) {
	const router = useRouter();
	const { realm, auctionHouse } = router.query;

	const pathname = {
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
		<Link href={pathname[type]}>
			<div className="h-full w-full hover:bg-neutral-200">
				{elementName[type]}
			</div>
		</Link>
	);
}
