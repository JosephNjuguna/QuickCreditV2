import express from 'express';
import loans from '../controllers/Loans';
import validation from '../middleware/validations';
import checkAuth from '../middleware/auth';

const route = express.Router();

route.post('/requestloan', checkAuth.checkUser, validation.validateLoan, validation.validateexistingloanrequest, loans.requestLoan);
route.get('/viewloanrequest', checkAuth.checkUser, loans.userloanStatus);
route.patch('/loan/:loan_id', checkAuth.checkAdmin, validation.validateFindLoan, loans.acceptloanapplication);
route.post('/payloan/:loan_id', checkAuth.checkUser, validation.validatePayloan, validation.validateFindLoan, loans.payloan);
route.get('/paymenthistory/:loan_id', checkAuth.checkUser, loans.repaymentHistory);
route.get('/payments', checkAuth.checkAdmin, loans.allLoanpayments);
route.get('/loans', checkAuth.checkAdmin, loans.loanRepaidstatus);

export default route;
