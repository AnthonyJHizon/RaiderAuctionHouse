import Image from 'next/image';

import floatToGold from '../utils/formatData/props/floatToGold';

export default function Auction({ itemId, itemName, itemIcon, itemVal }) {
	return (
		<div
			key={itemId}
			id={itemName}
			className="grid grid-cols-3 w-full h-[58px] items-center bg-neutral-50 hover:bg-neutral-200"
		>
			<a
				href={'https://wowhead.com/wotlk/item=' + itemId}
				className="justify-self-start"
				target="_blank"
				rel="noreferrer"
			>
				<Image src={itemIcon} alt="" height="58" width="58" />
			</a>
			<a
				href={'https://wowhead.com/wotlk/item=' + itemId}
				className="justify-self-center"
				target="_blank"
				rel="noreferrer"
			>
				{itemName}
			</a>
			<p className="mr-2 justify-self-end">{floatToGold(itemVal)}</p>
		</div>
	);
}
