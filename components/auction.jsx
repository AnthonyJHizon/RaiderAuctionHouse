import floatToGold from '../utils/formatData/props/floatToGold';

export default function Auction({ itemId, itemName, itemIcon, itemVal }) {
	return (
		<div
			key={itemId}
			id={itemName}
			className="grid grid-cols-3 w-full h-[58px] items-center hover:bg-gray-50/80 text-normal-1 overflow-hidden"
		>
			<a
				href={'https://wowhead.com/wotlk/item=' + itemId}
				className="justify-self-start"
				target="_blank"
				rel="noreferrer"
			>
				<img src={itemIcon} alt="" height="58" width="58" />
			</a>
			<a
				href={'https://wowhead.com/wotlk/item=' + itemId}
				className="ml-[20%]"
				target="_blank"
				rel="noreferrer"
			>
				{itemName}
			</a>
			<p className="mr-2 justify-self-end">{floatToGold(itemVal)}</p>
		</div>
	);
}
