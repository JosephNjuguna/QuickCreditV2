import jwt from 'jsonwebtoken';
import chai from 'chai';
import chaiHttp from 'chai-http';
import assert, {
	equal,
} from 'assert';
import dotenv from 'dotenv';
import app from '../../app';
import Db from '../db/db';
import total from '../helpers/Totalamount';
import paymentFunction from '../models/Loans';

dotenv.config();

const {
	expect,
} = chai;
chai.should();
chai.use(chaiHttp);

let userToken; let
	adminToken;
const wrongId = 1232;
const loanId = 1;
describe('/LOAN', () => {
	before('generate JWT', (done) => {
		adminToken = jwt.sign({
			email: 'admin123@gmail.com',
			firstname: 'main',
			lastname: 'admin',
			address: 'database',
			isAdmin: true,
		},
		process.env.JWT_KEY, {
			expiresIn: '1h',
		});

		userToken = jwt.sign({
			email: 'test1@mail.com',
			firstname: 'Joseph',
			lastname: 'Njuguna',
			address: 'Kenya',
			isAdmin: false,
		},
		process.env.JWT_KEY, {
			expiresIn: '1h',
		});
		done();
	});

	after('after all test', (done) => {
		Db.query('DELETE FROM loans');
		// Db.query('DELETE FROM payments');
		Db.query('DROP TABLE IF EXISTS loans');
		// Db.query('DROP TABLE IF EXISTS payments');
		done();
	});

	describe('/POST user request loan', () => {
		it('should check loan field is not entered', (done) => {
			chai.request(app)
				.post('/api/v2/requestloan')
				.set('authorization', `Bearer ${userToken}`)
				.send({
					'': 10000,
					tenor: 4,
				})
				.end((err, res) => {
					res.should.have.status(400);
					if (err) return done();
					done();
				});
		});

		it('should check loan amount is not entered', (done) => {
			chai.request(app)
				.post('/api/v2/requestloan')
				.set('authorization', `Bearer ${userToken}`)
				.send({
					amount: '',
					tenor: 2,
				})
				.end((err, res) => {
					res.should.have.status(400);
					if (err) return done();
					done();
				});
		});

		it('should check successful loan request', (done) => {
			chai.request(app)
				.post('/api/v2/requestloan')
				.set('authorization', `Bearer ${userToken}`)
				.send({
					amount: 2000,
					tenor: 6,
				})
				.end((err, res) => {
					res.should.have.status(200);
					if (err) return done();
					done();
				});
		});

		it('should check user has loan request available', (done) => {
			chai.request(app)
				.post('/api/v2/requestloan')
				.set('authorization', `Bearer ${userToken}`)
				.send({
					amount: 10000,
					tenor: 6,
				})
				.end((err, res) => {
					res.should.have.status(409);
					if (err) return done();
					done();
				});
		});
	});

	describe('/PATCH  accept loan application', () => {
		it('should check loan id been updated is no available ', (done) => {
			chai.request(app)
				.patch('/api/v2/loan/100')
				.set('authorization', `Bearer ${adminToken}`)
				.send({
					status: 'accepted',
				})
				.end((err, res) => {
					res.should.have.status(404);
					if (err) return done();
					done();
				});
		});

		it('should update a loan application as accepted', (done) => {
			chai.request(app)
				.patch('/api/v2/loan/1')
				.set('authorization', `Bearer ${adminToken}`)
				.send({
					status: 'accepted',
				})
				.end((err, res) => {
					res.should.have.status(200);
					if (err) return done();
					done();
				});
		});
	});

	describe('/POST user pay loan', () => {
		it('check user has not entered amount to pay', (done) => {
			chai.request(app)
				.post(`/api/v2/payloan/${loanId}`)
				.set('authorization', `Bearer ${userToken}`)
				.send({
					amount: '',
				})
				.end((err, res) => {
					expect(res.status).equals(400);
					if (err) return done();
					done();
				});
		});

		it('check user loan id doesn`t exist', (done) => {
			chai.request(app)
				.post(`/api/v2/payloan/${wrongId}`)
				.set('authorization', `Bearer ${userToken}`)
				.send({
					amount: 575,
				})
				.end((err, res) => {
					expect(res.status).equals(404);
					if (err) return done();
					done();
				});
		});

		it('check user has paid loan first time', (done) => {
			chai.request(app)
				.post(`/api/v2/payloan/${loanId}`)
				.set('authorization', `Bearer ${userToken}`)
				.send({
					amount: 350,
				})
				.end((err, res) => {
					expect(res.status).equals(200);
					if (err) return done();
					done();
				});
		});

		it('check user has paid loan second time', (done) => {
			chai.request(app)
				.post(`/api/v2/payloan/${loanId}`)
				.set('authorization', `Bearer ${userToken}`)
				.send({
					amount: 350,
				})
				.end((err, res) => {
					expect(res.status).equals(200);
					if (err) return done();
					done();
				});
		});

		it('check user has paid loan third time', (done) => {
			chai.request(app)
				.post(`/api/v2/payloan/${loanId}`)
				.set('authorization', `Bearer ${userToken}`)
				.send({
					amount: 350,
				})
				.end((err, res) => {
					expect(res.status).equals(200);
					if (err) return done();
					done();
				});
		});
	});

	describe('/GET admin', () => {
		it('should get all loans not fully paid', (done) => {
			chai.request(app)
				.get('/api/v2/loans?status=accepted&repaid=false')
				.set('authorization', `Bearer ${adminToken}`)
				.end((err, res) => {
					res.should.have.status(200);
					if (err) return done();
					done();
				});
		});
	});
});
