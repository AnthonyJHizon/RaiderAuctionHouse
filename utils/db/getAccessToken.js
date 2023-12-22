import cache from 'memory-cache';

import AccessToken from '../../models/accessToken';
import connectToDatabase from './dbConnect';

export default async () => {
	try {
		await connectToDatabase();
		const now = new Date();
		if (cache.get('expiresIn') && now < cache.get('expiresIn')) {
			cache.put('expiresIn', new Date(now.getTime() + 86399 * 500));
			const token = await AccessToken.findOne({ _id: 1 });
			return token.credentials;
		} else {
			const url = 'https://us.battle.net/oauth/token';
			const response = await fetch(url, {
				method: 'POST',
				body: 'grant_type=client_credentials',
				headers: {
					Authorization:
						'Basic ' +
						Buffer.from(
							`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
						).toString('base64'),
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			});
			const result = await response.json();
			const newToken = result.access_token;
			await AccessToken.updateOne(
				{ _id: 1 },
				{ $set: { credentials: newToken } },
				{ upsert: true }
			);
			cache.put('expiresIn', new Date(now.getTime() + result.expires_in * 500));
			return newToken;
		}
	} catch (error) {
		return error;
	}
};
