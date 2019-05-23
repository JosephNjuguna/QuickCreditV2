import jwt from 'jsonwebtoken';
import Models from '../models/Loans';
import userDate from '../helpers/Date';
import reqResponses from '../helpers/Responses';

const requestedDate = userDate.date();

class Loans {

	static async requestLoan(req, res) {
		try {
			const token = req.headers.authorization.split(' ')[1];
			const decoded = jwt.verify(token, process.env.JWT_KEY);
			req.userData = decoded;
			const requestedloan = req.body.amount;
			const tenor = req.body.tenor;			
			const { firstname, lastname, email } = req.userData;
			const dateRequested = requestedDate;
			
			const loanModel = await Models.requestLoan({
				requestedloan,
				tenor,
				firstname,
				lastname,
				email,
				dateRequested
			});
			return reqResponses.handleSuccess(200, 'Loan request successful', loanModel, res);
		} catch (error) {
			reqResponses.handleError(500, error.toString(), res);
		}
	}

	static async oneLoanapplication(req, res) {
		try {
			const userloanId = req.params.loan_id;
			const oneloanData = await Models.oneLoanapplication(userloanId);
			if (!oneloanData) {
				return reqResponses.handleError(404, 'Loan id not found', res);
			}
			reqResponses.handleSuccess(200, 'success', oneloanData, res);
		} catch (error) {
			console.log(error);
    }
  }
  
	static async userloanStatus(req, res) {
		try {
			const token = req.headers.authorization.split(' ')[1];
			const decoded = jwt.verify(token, process.env.JWT_KEY);
			req.userData = decoded;

			const loanStatus = await Models.findMail(req.userData.email);
			if (!loanStatus) {
				return reqResponses.handleError(404, loanStatus.result, res);
			}
			reqResponses.handleSuccess(200, 'success', loanStatus.result, res);
		} catch (error) {
			reqResponses.handleError(500, error.toString(), res);
		}
	}
	
	static async acceptloanapplication(req, res) {
		try {
			const userloanId = req.params.loan_id;
			const status = req.body.status;
			const paidOn = requestedDate;			
			const acceptLoan = await Models.acceptloanapplication(userloanId, status, paidOn);
			if (!acceptLoan) {
				return reqResponses.handleError(404, 'Loan id not found', res);
			}
			reqResponses.handleSuccess(200, 'loan accepted successfully', acceptLoan, res);
		} catch (error) {
			reqResponses.handleError(500, error.toString(), res);
		}
	}
	
}

export default Loans;
