import Db from '../db/db';
import totalAmountdetail from '../helpers/Totalamount';

class LoanModel {
	constructor(payload = null) {
		this.payload = payload;
		this.result = null;
	}

	static async requestLoan({
		requestedloan,
		tenor,
		firstname,
		lastname,
		email,
		dateRequested,
	}) {
		const amount = parseFloat(requestedloan, 10);
		const loanTenor = parseFloat(tenor, 10);
		const calculateTotalamount = totalAmountdetail.totalAmountdata(amount, loanTenor);
		const sqlInsert = 'INSERT INTO loans (usermail,firstname,lastname, requestedOn, status, repaid, tenor, principalAmount, paymentInstallment, totalAmounttopay, intrestRate) VALUES($1, $2, $3, $4, $5 ,$6 ,$7 ,$8 ,$9, $10, $11)  returning *;';
		const values = [email, firstname, lastname, dateRequested, 'pending', false, calculateTotalamount.tenor, amount, calculateTotalamount.installmentAmount, calculateTotalamount.totalamounttoPay, calculateTotalamount.interestRate];
		const {rows} = await Db.query(sqlInsert, values);		
		this.result = rows;
		return this.result;
	}

	static async findMail(usermail) {
		const sql = `SELECT * FROM loans WHERE usermail='${usermail}'`;
		const {
			rows
		} = await Db.query(sql);
		if (rows.length === 0) {
			return false;
		}
		const result = rows[0];
		return result;
	}

	static async paymentDetail(loanid, usermail, totalamounttoPay, loanInstallment, paidOn) {
		const sql = 'INSERT INTO payments(loanid, usermail, totalAmounttopay, installmentAmount, balance, paymentNo, paidOn ) VALUES($1, $2, $3, $4, $5 ,$6 ,$7) returning *;';
		const values = [loanid, usermail, totalamounttoPay, loanInstallment, totalamounttoPay, 0, paidOn];
		const {
			rows
		} = await Db.query(sql, values);
		return rows;
	}

	static async loanAccepted(status, loanid, requestedDate) {
		const rowData = 'UPDATE loans SET status = ($1) WHERE id = ($2) returning *;';
		const valuesUpdate = [status, parseFloat(loanid, 10)];
		const {
			rows
		} = await Db.query(rowData, valuesUpdate);
		console.log(rows);
		const paymentFunction = await this.paymentDetail(rows[0].id, rows[0].usermail, rows[0].totalamounttopay, rows[0].paymentinstallment, requestedDate);
		return true;
	}

	async continuedpayment(paymentNo, amount, balance, latestPayment, datepaid) {
		const sqlFirst = 'INSERT INTO payments(loanid, usermail, totalAmounttopay, installmentAmount,balance, paymentNo, paidOn ) VALUES($1, $2, $3, $4, $5 ,$6 ,$7) returning *;';
		const valuesFirst = [latestPayment.loanid, latestPayment.usermail, latestPayment.totalamounttopay, latestPayment.installmentamount, balance, paymentNo, datepaid];
		const { rows } = await Db.query(sqlFirst, valuesFirst);
		this.result = 'continue paying your loan';
	}

	async paymentdata(amount, loaniddetail, datepaid) {
		const idString = loaniddetail.toString();
		const sql = `SELECT * FROM payments  WHERE loanid ='${idString}'`;
		const { rows } = await Db.query(sql);
		const paymentsCount = rows.length;
		const latestPayment = rows[paymentsCount - 1];
		const balance = latestPayment.balance - amount;
		const paymentNo = paymentsCount + 1;
		if (rows.length === 0) {
			this.result = 'kindly wait for your application to be accepted';
			return false;
		}
		if (latestPayment.balance === 0 || latestPayment.balance < 0) {
			const sql = 'UPDATE loans SET repaid = ($1) WHERE id = ($2) returning *;';
			const values = [true, parseFloat(rows[0].loanId, 10)];
			const {
				rows,
			} = await Db.query(sql, values);
			this.result = 'your loan is fully paid';
			return true;
		}
		if (rows.length === 1) {
			const payment = rows[0];
			if (payment.paymentno === 0) {
				const newPayment = {
					loanid: loaniddetail,
					user: rows.usermail,
					amount: rows.totalAmounttopay,
					installmentsAmount: rows.installmentamount,
					balance: payment.balance - amount,
					paymentNo: 1,
					paidOn: datepaid,
				};
				const sqlFirst = 'INSERT INTO payments(loanid, usermail, totalAmounttopay, installmentAmount, balance, paymentNo, paidOn ) VALUES($1, $2, $3, $4, $5 ,$6 ,$7) returning *;';
				const valuesFirst = [loaniddetail, rows.usermail, amount, rows.installmentsamount, newPayment.balance, newPayment.paymentNo, datepaid];
				this.result = newPayment;
				return true;
			}
			const sqlFirst = 'INSERT INTO payments(loanid, usermail, totalAmounttopay, installmentAmount, balance, paymentNo, paidOn ) VALUES($1, $2, $3, $4, $5 ,$6 ,$7) returning *;';
			const valuesFirst = [loaniddetail, rows.usermail, amount, rows.installmentsamount, balance, 2, datepaid];
			const {
				rows,
			} = await Db.query(sqlFirst, valuesFirst);
			this.result = 'second loan payment';
			return true;
		}
		const loancontinous = await this.continuedpayment(paymentNo, amount, balance, latestPayment, datepaid);
	}

	async payloan() {
		const amount = parseFloat(this.payload.loanInstallment);
		const loanid = parseFloat(this.payload.userloanId);
		const datepaid = parseFloat(this.payload.paidOn);
		const sql = `SELECT * FROM loans WHERE id ='${loanid}' AND usermail = '${this.payload.email}'`;
		const {
			rows,
		} = await Db.query(sql);
		const loaniddetail = rows[0].id;
		if (rows) {
			const paymentFunc = await this.paymentdata(amount, loaniddetail, datepaid);
		}
		this.result = 'There was an error paying your loan';
		return false;
	}

	static async repaymentHistory(userRequestLoanid, userid) {
		const {
			rows,
		} = await pool.query('SELECT * FROM payments WHERE status=($1) AND repaid=($2)', [userRequestLoanid, userid]);
		if (rows.length === 0) {
			this.result = 'There are no any loan payments';
			return false;
		}
		this.result = payments;
		return true;
	}

	static async allLoanpayments() {
		const {
		  rows
		} = await pool.query('SELECT * FROM payments');
		if (rows.length === 0) {
		  this.result = "There are no any loan payments"
		  return false;
		}
		this.result = payments;
		return true;
	}

	static async loanRepaidstatus(status, repaid) {
		let repaidStatus;
		if (repaid === 'false') {
			repaidStatus = false;
		} else if (repaid === 'true') {
			repaidStatus = true;
		}
		const sql = `SELECT * FROM loans WHERE status ='${status}' AND repaid = '${repaidStatus}'`;
		const { rows } = await Db.query(sql);
		if (rows.length === 0) {
			return false;
		}
		this.result = rows;
		return true;
	}
}
export default LoanModel;
