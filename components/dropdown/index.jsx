import Button from './button';
import Content from './content';

export default function Dropdown({
	name,
	content,
	queryParams,
	itemClass,
	realms,
	auctionHouses,
	type,
}) {
	let contentArr = [];
	content.forEach((element) => {
		contentArr.push(
			<Content
				key={element}
				element={element}
				queryParams={queryParams}
				itemClass={itemClass}
				realms={realms}
				auctionHouses={auctionHouses}
				type={type}
			/>
		);
	});
	return (
		<div className="group relative flex items-center justify-center basis-full text-normal-1 h-full">
			<Button name={name} itemClass={itemClass} />
			<div className="absolute max-h-0 w-full right-0 left-0 top-full z-10 overflow-hidden text-center bg-white group-hover:max-h-[75vh] group-hover:overflow-y-auto scrollbar-none transition-all duration-500 ease-in-out">
				{contentArr}
			</div>
		</div>
	);
}
