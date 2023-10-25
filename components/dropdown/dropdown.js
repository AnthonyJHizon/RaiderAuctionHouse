import Button from './button';
import Content from './content';

export default function Dropdown({
	name,
	content,
	queryParams,
	itemClass,
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
				type={type}
			/>
		);
	});
	return (
		<div className="group relative flex items-center justify-center w-[33.33%]">
			<Button name={name} itemClass={itemClass} />
			<div className="hidden absolute w-full right-0 left-0 top-[100%] z-10 text-center bg-neutral-100 group-hover:block">
				{contentArr}
			</div>
		</div>
	);
}
