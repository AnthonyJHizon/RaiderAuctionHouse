import AuctionHouseCard from './auctionHouseCard';

export default function RealmCard({ realm, name, auctionHouses }) {
	return (
		<div
			key={realm}
			className="group relative flex flex-col w-[250px] h-[500px]"
		>
			<img
				src={`/cards/${realm}.webp`}
				alt=""
				className="h-full w-full absolute top-0 left-0 transition-all ease-in-out duration-1000 opacity-0 z-0 group-hover:opacity-100 group-hover:blur group-hover:z-30 object-cover"
			/>
			<div className="flex items-center justify-center text-center bg-black h-[10%] overflow-hidden text-normal-1 z-40">
				{name}
			</div>
			<div className="flex relative flex-col overflow-hidden h-[90%] w-full transition-all ease-in-out duration-1000 group-hover:opacity-0">
				<img
					src={`/cards/${realm}.webp`}
					alt=""
					className="h-full w-full object-cover"
				/>
			</div>
			<div className="relative h-[35%] transition-all duration-700 ease-in-out cursor-pointer group-hover:z-30 group-hover:translate-y-[-75%]">
				{Object.keys(auctionHouses).map((auctionHouse) => {
					return (
						<AuctionHouseCard
							key={realm + '/' + auctionHouse}
							realm={realm}
							auctionHouse={auctionHouse}
							numAuctions={auctionHouses[auctionHouse].numAuctions}
						/>
					);
				})}
			</div>
		</div>
	);
}
