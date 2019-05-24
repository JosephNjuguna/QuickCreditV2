import dotenv from 'dotenv';
import EncryptData from '../helpers/Encrypt';

dotenv.config();
const users = {
	user1: {
		email: 'test2@mail.com',
		firstname: '',
		lastname: 'testlastname',
		password: process.env.password,
		address: 'nairobi',
	},
	user2: {
		email: 'test2@mail.com',
		firstname: 'testfirstname',
		lastname: '',
		password: process.env.password,
		address: 'nairobi',
	},
	user3: {
		email: '',
		firstname: 'testfirstname',
		lastname: 'testlastname',
		password: process.env.password,
		address: 'nairobi',
	},
	user4: {
		email: 'test2@mail.com',
		firstname: 'testfirstname',
		lastname: 'testlastname',
		password: '',
		address: 'nairobi',
	},
	user5: {
		email: 'test2@mail.com',
		firstname: 'testfirstname',
		lastname: 'testlastname',
		password: process.env.password,
		address: 'nairobi',
	},
	user6: {
		email: 'test2@mail.com',
		firstname: 'testfirstname',
		lastname: 'testlastname',
		password: process.env.password,
		address: 'nairobi',
	},
};

export default users;
