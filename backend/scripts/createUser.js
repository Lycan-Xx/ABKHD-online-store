import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';

dotenv.config();

const createUser = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);

		const email = process.argv[2];
		const password = process.argv[3];

		if (!email || !password) {
			console.error('Please provide email and password');
			process.exit(1);
		}

		await User.create({ email, password });
		console.log('Account has been successfully registered');
		process.exit(0);
	} catch (error) {
		console.error('Error creating user:', error);
		process.exit(1);
	}
};

createUser();