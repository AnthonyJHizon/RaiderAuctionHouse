import Description from './description';
import WowToken from './wowToken';

export default function Banner() {
	return (
		<div className="flex flex-col w-full h-80 bg-none">
			<Description />
			<WowToken />
		</div>
	);
}
