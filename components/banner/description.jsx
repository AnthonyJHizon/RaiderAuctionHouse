'use client';

import Typewriter from 'typewriter-effect';

export default function Description() {
	return (
		<div className="flex flex-col justify-between w-full h-full font-bold text-wrap text-cyan z-10 [text-shadow:_1px_1px_5px_rgb(0_0_0/_80%)] md:pt-[5%] pt-[20%] pl-[7%] pr-[7%] md:pb-[2%] pb-[10%]">
			<div className="w-full text-title-1 text-center">
				<p className="text-white">Filtered auction house data for </p>
				<p>WOTLK Classic</p>
			</div>
			<div className="flex w-full min-h-6 h-fit max-h-12 text-title-2 text-center justify-center">
				<Typewriter
					onInit={(typewriter) => {
						typewriter
							.typeString('Gems')
							.pauseFor(2500)
							.deleteAll()
							.typeString('Consumables')
							.pauseFor(2500)
							.deleteAll()
							.typeString('Crafting Mats')
							.pauseFor(2500)
							.deleteAll()
							.typeString('Glyphs')
							.pauseFor(2500)
							.deleteAll()
							.start();
					}}
					options={{
						autoStart: true,
						loop: true,
					}}
				/>
			</div>
		</div>
	);
}
