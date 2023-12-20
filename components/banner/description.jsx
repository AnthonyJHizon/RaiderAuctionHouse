import Typewriter from 'typewriter-effect';

export default function Description() {
	return (
		<h1 className="w-6/12 h-40 text-black font-bold text-header-1 text-wrap">
			<Typewriter
				options={{
					strings:
						'Collections and filtered auction house data for WOTLK Classic!',
					autoStart: true,
					loop: true,
					delay: 30,
					pauseFor: 20000,
				}}
			/>
		</h1>
	);
}
