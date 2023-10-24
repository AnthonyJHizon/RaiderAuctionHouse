import Image from 'next/image';

import intToGold from '../utils/formatData/props/intToGold';

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
				<Image src={itemIcon} alt="" height="58px" width="58px" />
			</a>
			<a
				href={'https://wowhead.com/wotlk/item=' + itemId}
				className="justify-self-center"
				target="_blank"
				rel="noreferrer"
			>
				{itemName}
			</a>
			<p className="justify-self-end">{intToGold(itemVal)}</p>
		</div>
	);
}
