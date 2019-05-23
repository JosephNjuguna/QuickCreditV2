import express from 'express';
import loans from '../controllers/Loans';
import validation from '../middleware/validations';
import checkAuth from '../middleware/auth';

const route = express.Router();

route.post('/requestloan', checkAuth.checkUser, validation.validateLoan, validation.validateexistingloanrequest, loans.requestLoan);
route.get('/loan/:loan_id', checkAuth.checkAdmin,  validation.validateID, loans.oneLoanapplication);

export default route;
