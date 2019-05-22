import jwt from 'jsonwebtoken';
import Token from '../helpers/Jwt';
import dotenv from 'dotenv';

dotenv.config();

class AuthValidator {

	static async checkUser(req, res, next) {
		try {
			const tokenData = req.headers.authorization;
			const token = req.headers.authorization.split(' ')[1];
			if (Token.checkToken(tokenData,res)) {			
				const decoded = jwt.verify(token, process.env.JWT_KEY);
				req.userData = decoded;
			}	
			next();
		} catch (e) {
			res.status(401).json({
				status: '401',
				message: 'Auth failed',
				error: e,
			});
		}
	}

	static async checkAdmin(req, res, next) {
		try {
			const tokenData = req.headers.authorization;
			if (Token.checkToken(tokenData,res)) {
				const token = req.headers.authorization.split(' ')[1];
				const decoded = jwt.verify(token, process.env.JWT_KEY);
				req.userData = decoded;
				if (req.userData.email === 'admin123@gmail.com') {
					next();
				} else {
					return res.status(403).json({
						message: 'Access Denied! You are not allowed to access this route',
					});
				}
			}
		} catch (e) {			
			res.status(401).json({
				message: 'Auth failed',
				error: e,
			});
		}
	}

}
export default AuthValidator;