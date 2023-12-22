export default async function Realm(data) {
	let realmData = {};
	const realms = data.results;
	realms.forEach((realm) => {
		realmData[realm.data.realms[0].slug] = {
			id: realm.data.id,
			name: realm.data.realms[0].name.en_US,
			timeZone: realm.data.realms[0].timezone,
		};
	});
	return realmData;
}
