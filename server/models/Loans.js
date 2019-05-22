import Db from '../db/db';
import totalAmountdetail from '../helpers/Totalamount';

class LoanModel {
  constructor(payload = null) {
    this.payload = payload;
    this.result = null;
  }

  static async requestLoan({
        requestedloan,
				firstname,
				lastname,
				email,
				dateRequested
  }) {
    const amount = parseFloat(requestedloan);
    const calculateTotalamount = totalAmountdetail.totalAmountdata(amount);
    const sqlInsert = 'INSERT INTO loans (usermail,firstname,lastname, requestedOn, status, repaid, tenor, principalAmount, paymentInstallment, totalAmounttopay, intrestRate) VALUES($1, $2, $3, $4, $5 ,$6 ,$7 ,$8 ,$9, $10, $11)  returning *;';
    const values = [email, firstname, lastname, dateRequested, 'pending', false, calculateTotalamount.numberOfInstallments, amount, calculateTotalamount.installmentAmount, calculateTotalamount.totalamounttoPay, calculateTotalamount.interestRate];
    const {rows} = await Db.query(sqlInsert, values);
    this.result = rows;
    return true;
  }

  static async findMail(usermail) {
    const sql = `SELECT * FROM loans WHERE usermail='${usermail}'`;
    const {rows}  = await Db.query(sql);
    if (rows.length === 0) {
      return false;
    }
    const result = rows[0];
    return result;
  }

}
export default LoanModel;