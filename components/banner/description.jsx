import Typewriter from 'typewriter-effect';

export default function Description() {
	return (
		<div className="w-4/12 h-40 font-bold text-header-1 text-wrap text-cyan">
			<Typewriter
				options={{
					strings:
						'<span style="color: black">Filtered auction house data and collections for </span>WOTLK Classic',
					autoStart: true,
					delay: 30,
					loop: true,
					pauseFor: 30000,
				}}
			/>
		</div>
	);
}
