import Description from './description';

export default function Banner() {
	return (
		<div className="relative w-full h-[350px] bg-gradient-to-r from-gray-700 via-zinc-500 to-gray-800 flex flex-wrap justify-center">
			<img
				src="/banner.jpg"
				alt=""
				className="absolute w-full h-full object-cover mix-blend-overlay"
				draggable={false}
			/>
			<Description />
		</div>
	);
}
