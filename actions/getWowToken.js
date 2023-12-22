// 'use server';

// import getAccessToken from '../utils/db/getAccessToken';

// export async function getWowToken() {
// 	const accessToken = await getAccessToken();
// 	const wowTokenRes = await fetch(
// 		`https://us.api.blizzard.com/data/wow/token/index?namespace=dynamic-classic-us&locale=en_US&access_token=${accessToken}`,
// 		{
// 			method: 'GET',
// 			headers: {
// 				'Content-Type': 'application/json',
// 			},
// 		}
// 	);
// 	const wowTokenData = wowTokenRes.json();
// 	return wowTokenData;
// }
