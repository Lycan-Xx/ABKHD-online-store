import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from '../src/models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const createAdmin = async () => {
	try {
		if (!process.env.MONGODB_URI) {
			throw new Error('MONGODB_URI is not defined in environment variables');
		}

		await mongoose.connect(process.env.MONGODB_URI);

		const name = process.argv[2];
		const email = process.argv[3];
		const password = process.argv[4];
		const role = process.argv[5];

		if (!name || !email || !password || !role) {
			console.error('Please provide all required parameters');
			console.error('Usage: node createAdmin.js "name" "email" "password" "role"');
			process.exit(1);
		}

		if (!['admin', 'user'].includes(role)) {
			console.error('Role must be either "admin" or "user"');
			process.exit(1);
		}

		await User.create({ name, email, password, role });
		console.log('User created successfully');
		process.exit(0);
	} catch (error) {
		console.error('Error creating user:', error);
		process.exit(1);
	}
};

createAdmin();