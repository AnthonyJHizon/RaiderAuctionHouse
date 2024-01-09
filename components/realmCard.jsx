import AuctionHouseCard from './auctionHouseCard';

export default function RealmCard({ realm, name, auctionHouses }) {
	return (
		<div
			key={realm}
			className="group relative flex flex-col w-[250px] h-[500px] rounded-md shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] [text-shadow:_1px_1px_2px_rgb(0_0_0/_80%)]"
		>
			<img
				src={`/cards/${realm}.webp`}
				alt=""
				className="h-full w-full absolute top-0 left-0 transition-all ease-in-out duration-1000 opacity-0 z-0 group-hover:opacity-100 group-hover:blur group-hover:z-30 object-cover rounded-md"
				draggable={false}
			/>
			<span className="absolute flex items-center justify-center text-cente min-h-[5%] h-fit w-full overflow-hidden text-normal-1 z-40">
				{name}
			</span>
			<div className="flex relative flex-col overflow-hidden h-[90%] w-full transition-all ease-in-out duration-1000 group-hover:opacity-0">
				<img
					src={`/cards/${realm}.webp`}
					alt=""
					className="h-full w-full object-cover rounded-t-md overflow-hidden"
					draggable={false}
				/>
			</div>
			<div className="relative h-48 transition-all duration-700 ease-in-out cursor-pointer group-hover:z-30 group-hover:translate-y-[-75%]">
				{Object.keys(auctionHouses).map((auctionHouse) => {
					return (
						<AuctionHouseCard
							key={realm + '/' + auctionHouse}
							realm={realm}
							auctionHouse={auctionHouse}
						/>
					);
				})}
			</div>
		</div>
	);
}
