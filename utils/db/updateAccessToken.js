import cache from 'memory-cache';

import AccessToken from '../../models/accessToken';
import connectToDatabase from './dbConnect';

export default async (newToken) => {
    const now = new Date();
	try {
		await connectToDatabase();
        await AccessToken.updateOne(
            { _id: 1 },
            { $set: { credentials: newToken } },
            { upsert: true }
        );
        cache.put('expiresIn', new Date(now.getTime() + result.expires_in * 500));
	} catch (error) {
		return error;
	}
};
