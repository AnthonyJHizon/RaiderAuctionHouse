'use server';

import getAccessToken from '../utils/db/getAccessToken';

export async function getWowToken() {
	const accessToken = await getAccessToken();
}
