import Image from 'next/image';

import intToGold from '../utils/formatData/props/intToGold';

export default function Auction({ itemId, itemName, itemIcon, itemVal }) {
	return (
		<div
			key={itemId}
			id={itemName}
			className="grid grid-cols-3 w-full h-[58px] items-center bg-neutral-50 hover:bg-neutral-200"
			href={'https://wowhead.com/wotlk/item=' + itemId}
			target="_blank"
		>
			<a
				href={'https://wowhead.com/wotlk/item=' + itemId}
				target="_blank"
				rel="noreferrer"
				className="justify-self-start"
			>
				<Image src={itemIcon} alt="" height="58px" width="58px" />
			</a>
			<a
				href={'https://wowhead.com/wotlk/item=' + itemId}
				target="_blank"
				className="justify-self-center"
			>
				{itemName}
			</a>
			<p className="justify-self-end">{intToGold(itemVal)}</p>
		</div>
	);
}
