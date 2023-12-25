import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export default redis;

// redisClient.on('error', (err) => console.log('Redis Client Error', err));

// if (!redisClient.isOpen) {
// 	await redisClient.connect();
// }

// if (!redisClient) throw new Error('Redis client not initialized');

// export default redisClient;
