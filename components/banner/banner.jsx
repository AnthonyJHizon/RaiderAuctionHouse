import Description from './description';
import WowToken from './wowToken';

export default function Banner() {
	return (
		<div className="flex flex-col w-full h-80 bg-banner bg-contain bg-no-repeat">
			<Description />
			<WowToken />
		</div>
	);
}
