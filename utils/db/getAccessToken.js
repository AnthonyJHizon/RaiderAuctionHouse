import connectToDatabase from './dbConnect';

module.exports = async () => {
	try {
		await connectToDatabase();
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
		return newToken;
	} catch (error) {
		return error;
	}
};
