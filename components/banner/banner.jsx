import Description from './description';
import WowToken from './wowToken';

export default function Banner() {
	return (
		<div className="flex flex-col w-full h-40 bg-lk bg-cover bg-no-repeat">
			<Description />
			<WowToken />
		</div>
	);
}
