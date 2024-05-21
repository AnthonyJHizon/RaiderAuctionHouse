import floatToGold from '../utils/formatData/props/floatToGold';

export default function Auction({ itemId, itemName, itemIcon, itemVal }) {
	const itemIconSplit = itemIcon.split('/');
	const itemIconName = itemIconSplit[itemIconSplit.length - 1];
	const backupLink = `https://wow.zamimg.com/images/wow/icons/large/${itemIconName}`;
	return (
		<div
			key={itemId}
			id={itemName}
			className="grid grid-cols-3 w-full h-[56px] items-center hover:bg-gray-50/80 text-normal-1 overflow-hidden transition-all duration-200 ease-in-out"
		>
			<a
				href={'https://wowhead.com/cata/item=' + itemId}
				className="justify-self-start"
				target="_blank"
				rel="noreferrer"
			>
				<object data={itemIcon} type="image/jpeg">
					<img
						src={backupLink}
						alt=""
						height="56"
						width="56"
						draggable={false}
					/>
				</object>
			</a>
			<a
				href={'https://wowhead.com/cata/item=' + itemId}
				className="w-full max-h-[56px] text-center truncate hover:text-wrap"
				target="_blank"
				rel="noreferrer"
			>
				{itemName}
			</a>
			<p className="mr-2 justify-self-end">{floatToGold(itemVal)}</p>
		</div>
	);
}
