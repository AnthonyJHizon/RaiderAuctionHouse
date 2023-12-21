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
			<div className="hidden absolute w-full right-0 left-0 top-[100%] z-10 text-center bg-neutral-100 group-hover:block">
				{contentArr}
			</div>
		</div>
	);
}
