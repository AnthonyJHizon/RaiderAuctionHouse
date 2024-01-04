import wowTokenData from '../../actions/getWowTokenInfo';

export default async function WowToken() {
	const data = await wowTokenData();
	const price = data.price / 10000;
	return (
		<div className="flex items-center justify-center z-10 text-normal-1 [text-shadow:_1px_1px_2px_rgb(0_0_0/_80%)]">
			<img
				src="wow-token.png"
				alt=""
				className="z-10 h-[100px] w-[100px] object-cover"
				draggable={false}
			/>
			<span>{price} Gold</span>
		</div>
	);
}
