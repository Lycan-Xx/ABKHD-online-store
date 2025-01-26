import axios from 'axios';

const api = axios.create({
	baseURL: process.env.NODE_ENV === 'production'
		? 'https://abkhd-online-store.onrender.com/api'
		: 'http://localhost:5000/api',
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json'
	}
});

export default api;