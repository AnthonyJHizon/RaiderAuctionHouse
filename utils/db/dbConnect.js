import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

export default async function dbConnect() {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		mongoose.set('strictQuery', true);
		cached.promise = await mongoose.connect(process.env.MONGODB_URI);
		// console.log('connected to mongoDB!');
	}

	cached.conn = await cached.promise;
	return cached.conn;
}
