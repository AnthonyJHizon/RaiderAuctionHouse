import Description from './description';

export default function Banner() {
	return (
		<div className="relative w-full min-h-[350px] h-3/5 flex flex-wrap justify-center bg-none">
			<video
				className="absolute h-full w-full object-cover"
				poster="/videos/poster.png"
				autoPlay
				muted
				loop
			>
				<source src="/videos/volcano.mp4" type="video/mp4" />
				Your browser does not support the video tag.
			</video>
			<Description />
		</div>
	);
}
