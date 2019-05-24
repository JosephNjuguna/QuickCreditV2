import jwt from 'jsonwebtoken';
import reqResponses from '../helpers/Responses';
import Usermodel from '../models/Users';
import Loanmodel from '../models/Loans';
import Db from '../db/db';

class Validations {
	static validatesignup(req, res, next) {
		try {
			const {
				firstname,
				lastname,
				address,
				email,
				password,
			} = req.body;

			let re;

			if (!firstname || !lastname || !address || !email || !password) {
				return reqResponses.handleError(400, 'Ensure you have: Firstname, Lastname, address, email and password fields filled', res);
			}
			if (firstname) {
				re = /[a-zA-Z]{3,}/;
				if (!re.test(firstname)) reqResponses.handleError(400, 'enter valid firstname', res);
			}
			if (lastname) {
				re = /[a-zA-Z]{3,}/;
				if (!re.test(lastname)) reqResponses.handleError(400, 'enter valid lastname', res);
			}
			if (address) {
				re = /[a-zA-Z]{3,}_*[0-9_]*[a-zA-Z]*_*/;
				if (!re.test(address)) reqResponses.handleError(400, 'address validation failed', res);
			}
			if (email) {
				re = /(^[a-zA-Z0-9_.]+@[a-zA-Z0-9-]+\.[a-z]+$)/;
				if (!re.test(email)) reqResponses.handleError(400, 'enter valid email e.g user@gmail.com', res);
			}
			if (password) {
				re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(\W|_)).{7,}$/;
				if (!re.test(password)) reqResponses.handleError(400, 'enter valid password. should be more than 7 characters, contain letters,numbers and an alphanumeric character e.g @', res);
			}
			next();
		} catch (error) {
			return reqResponses.handleError(error.toString(), 500, res);
		}
	}

	static validatelogin(req, res, next) {
		try {
			const {
				email,
				password,
			} = req.body;

			let re;
			if (email === '' || password === '' || !email || !password) {
				return reqResponses.handleError(400, 'Ensure all fields are filled', res);
			}
			if (email) {
				re = /(^[a-zA-Z0-9_.]+@[a-zA-Z0-9-]+\.[a-z]+$)/;
				if (!re.test(email) || email === '') return reqResponses.handleError(400, 'enter valid email', res);
			}
			next();
		} catch (error) {
			reqResponses.handleError(error.toString(), 500, res);
		}
	}

	static async validatenewEmail(req, res, next) {
		try {
			const {
				email
			} = req.body;
			const checkEmail = await Usermodel.findByEmail(email);
			if (checkEmail) {
				return reqResponses.handleError(409, 'Users email already exist', res);
			}
			next();
		} catch (error) {
			return reqResponses.handleError(500, error.toString(), res);
		}
	}

	static async validateexistingEmail(req, res, next) {
		try {
			const {
				email,
			} = req.body;
			const checkEmail = await Usermodel.login(email);
			if (!checkEmail) {
				return reqResponses.handleError(404, 'No email found', res);
			}
			next();
		} catch (error) {
			return reqResponses.handleError(500, error.toString(), res);
		}
	}

	static async validateLoan(req, res, next) {
		try {
			const loan = req.body.amount;
			const {
				tenor
			} = req.body;

			if (!loan || !tenor) {
				return reqResponses.handleError(400, 'loan and tenor field required', res);
			}
			if (loan) {
				const re = /([0-9]*[.])?[0-9]+/;
				if (!re.test(loan)) return reqResponses.handleError(404, 'enter amount in digits not strings', res);
			}
			if (tenor) {
				const re = /^([1-9]|1[012])$/;
				if (!re.test(tenor)) return reqResponses.handleError(400, 'enter correct tenor, less than 12months and  in digits not strings', res);
			}
			next();
		} catch (error) {
			return error;
		}
	}

	static async validatePayloan(req, res, next) {
		try {
			const loan = req.body.amount;
			if (!loan) {
				return reqResponses.handleError(400, 'loan input field required', res);
			}
			if (loan) {
				const re = /([0-9]*[.])?[0-9]+/;
				if (!re.test(loan)) return reqResponses.handleError(404, 'enter amount in digits not strings', res);
			}
			next();
		} catch (error) {
			return reqResponses.internalError(res);
		}
	}

	static async validateexistingloanrequest(req, res, next) {
		try {
			const token = req.headers.authorization.split(' ')[1];
			const decoded = jwt.verify(token, process.env.JWT_KEY);
			req.userData = decoded;
			const useremail = req.userData.email;
			const checkEmail = await Loanmodel.findMail(useremail);
			if (checkEmail) {
				return reqResponses.handleError(409, 'You have a loan request', res);
			}
			next();
		} catch (error) {
			return reqResponses.handleError(500, error.toString(), res);
		}
	}

	static async validateFindLoan(req, res, next) {
		try {
			const loanid = req.params.loan_id;
			const sql = `SELECT * FROM loans WHERE id='${parseFloat(loanid)}'`;
			const {
				rows
			} = await Db.query(sql);
			if (rows.length === 0) {
				return reqResponses.handleError(404, 'loan id not found', res);
			}
			next();
		} catch (error) {
			return reqResponses.handleError(500, error.toString(), res);
		}
	}

	static validateID(req, res, next) {
		try {
			const {
				id
			} = req.params;
			const re = /([0-9]*[.])?[0-9]+/;
			if (id) {
				if (!re.test(id)) reqResponses.handleError(404, 'enter an id in digits not letters', res);
			}
			next();
		} catch (error) {
			reqResponses.handleError(error.toString(), 500, res);
		}
	}

}
export default Validations;
