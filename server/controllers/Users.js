import jwt from 'jsonwebtoken';
import Usermodel from '../models/Users';
import EncryptData from '../helpers/Encrypt';
import userDate from '../helpers/Date';
import reqResponses from '../helpers/Responses';
import jwtGen from '../helpers/Jwt';

const signedupDate = userDate.date();

class Users {
	static async signup(req, res) {
		try {
			const {
				firstname,
				lastname,
				address,
				email,
				password,
			} = req.body;
			const hashedPassword = EncryptData.generateHash(password);
			const addUser = await Usermodel.signup(email, firstname, lastname, hashedPassword, address, 'unverified', false, signedupDate);
			const token = jwtGen.generateToken(email, firstname, lastname, address);
			return reqResponses.handleSignupsuccess(201, 'successfully created account', token, addUser, res);
		} catch (error) {
			console.log(error);
			return reqResponses.handleError(500, error.toString(), res);
		}
	}

	static async login(req, res) {
		try {
			const incomingEmail = req.body.email;
			const { password } = req.body;
			const addUser = await Usermodel.login(incomingEmail);
			const {
				email, firstname, lastname, address,
			} = addUser;
			if (EncryptData.validPassword(password, addUser.userpassword)) {
				const token = jwtGen.generateToken(email, firstname, lastname, address);
				return reqResponses.handleSignupsuccess(200, `welcome ${firstname}`, token, addUser, res);
			}
			return reqResponses.handleError(401, 'Incorrect password', res);
		} catch (error) {
			return reqResponses.handleError(500, error.toString(), res);
		}
	}

	static async verifyUser(req, res) {
		try {
			const { email } = req.params;
			const { status } = req.body;

			const userVerifaction = await Usermodel.verifyUser(email, status);

			if (!userVerifaction) {
				return reqResponses.handleError(404, 'User email not found', res);
			}
			return reqResponses.handleSuccess(200, 'user verified successfully', userVerifaction.result, res);
		} catch (error) {
			return reqResponses.handleError(500, error.toString(), res);
		}
	}

	static async userProfile(req, res) {
		try {
			const token = req.headers.authorization.split(' ')[1];
			const decoded = jwt.verify(token, process.env.JWT_KEY);
			req.userData = decoded;

			const userProfilemail = req.userData.email;
			const userInfo = await Usermodel.findprofile(userProfilemail);

			if (!userInfo) {
				return reqResponses.handleError(404, 'User id not found', res);
			}
			return reqResponses.handleSuccess(200, 'welcome', userInfo, res);
		} catch (error) {
			return reqResponses.handleError(500, error.toString(), res);
		}
	}

	static async allUsers(req, res) {
		try {
			const allUserdata = await new Usermodel();
			if (!allUserdata.allUsers()) {
				return reqResponses.handleError(404, 'No Users record found', res);
			}
			return reqResponses.handleSuccess(200, 'All users record', allUserdata.result, res);
		} catch (error) {
			return reqResponses.handleError(500, error.toString(), res);
		}
	}
}
export default Users;
