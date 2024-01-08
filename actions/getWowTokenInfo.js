'use server';

import { getWowTokenInfo } from '../lib/clients/blizzard/client';

export default async function WowTokenData() {
	const response = await getWowTokenInfo();
	const data = await response.json();
	return data;
}
