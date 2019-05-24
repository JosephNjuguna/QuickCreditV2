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
			const {
				firstname,
				lastname,
				email
			} = req.userData;
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

	static async allLoanapplications(req, res) {
		try {
			const loanData = await Models.allLoanapplications();
			if (!loanData) {
				return reqResponses.handleError(404, 'No records found', res);
			}
			reqResponses.handleSuccess(200, 'Loan Applications Records', loanData, res);
		} catch (error) {
			reqResponses.handleError(500, error.toString(), res);
		}
	}

	static async loanRepaidstatus(req, res) {
		try {
			const {
				status,
				repaid
			} = req.query;
			const loanstatus = await Models.loanRepaidstatus(status, repaid);
			if (!loanstatus) {
				return reqResponses.handleError(404, 'No loans records found', res);
			}
			reqResponses.handleSuccess(200, 'loan status', loanstatus.result, res);
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
			return reqResponses.handleSuccess(200, 'success', loanStatus.result, res);
		} catch (error) {
			return reqResponses.handleError(500, error.toString(), res);
		}
	}

	static async acceptloanapplication(req, res) {
		try {
			const userloanId = req.params.loan_id;
			const {
				status
			} = req.body;
			const acceptLoan = await Models.loanAccepted(status, userloanId, requestedDate);
			return reqResponses.handleSuccess(200, 'loan accepted successfully', acceptLoan, res);
		} catch (error) {
			return reqResponses.handleError(500, error.toString(), res);
		}
	}

	static async payloan(req, res) {
		try {
			const token = req.headers.authorization.split(' ')[1];
			const decoded = jwt.verify(token, process.env.JWT_KEY);
			req.userData = decoded;
			const loanModel = await new Models({
				email: req.userData.email,
				loanInstallment: req.body.amount,
				paidOn: requestedDate,
				userloanId: req.params.loan_id,
			});
			if (!loanModel.payloan()) {
				return reqResponses.handleError(404, loanModel.result, res);
			}
			return reqResponses.handleSuccess(200, 'loan payment successful', loanModel.result, res);
		} catch (error) {
			return reqResponses.internalError(res);
		}
	}

	static async repaymentHistory(req, res) {
		try {
			const token = req.headers.authorization.split(' ')[1];
			const decoded = jwt.verify(token, process.env.JWT_KEY);
			req.userData = decoded;

			const {
				email
			} = req.userData;
			const userloanId = req.params.loan_id;

			const paymentHistory = await Models.repaymentHistory(email, userloanId);
			if (!paymentHistory) {
				const status = req.body.status;
				const paidOn = requestedDate;
				const acceptLoan = await Models.acceptloanapplication(userloanId, status, paidOn);
				if (!acceptLoan) {
					return reqResponses.handleError(404, 'Loan id not found', res);
				}
				return reqResponses.handleSuccess(200, 'Loan Repayment Record ', paymentHistory.result, res);
			}
		} catch (error) {
			return reqResponses.handleError(500, error.toString(), res);
		}
	}

	static async allLoanpayments(req, res) {
		try {
			const loanData = await Models.allLoanpayments();
			if (!loanData) {
				return reqResponses.handleError(404, loanData.result, res);
			}
			return reqResponses.handleSuccess(200, 'Loan Repayment History Record ', loanData.result, res);
		} catch (error) {
			return reqResponses.handleError(500, error.toString(), res);
		}
	}

}
export default Loans;