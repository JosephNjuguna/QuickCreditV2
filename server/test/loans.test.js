import jwt from 'jsonwebtoken';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';
import Db from '../db/db';
import total from '../helpers/Totalamount';
import assert, {
	equal
} from 'assert';
import dotenv from 'dotenv';

dotenv.config();

const {
	expect
} = chai;
chai.should();
chai.use(chaiHttp);

let userToken, adminToken;
const wrongId = 1232;

describe('/LOAN', () => {

	before('generate JWT', (done) => {
		adminToken = jwt.sign({
				email: 'admin123@gmail.com',
				firstname: 'main',
				lastname: 'admin',
				address: 'database',
				isAdmin: true
			},
			process.env.JWT_KEY, {
				expiresIn: '1h',
			});

		userToken = jwt.sign({
				email: 'test1@mail.com',
				firstname: 'Joseph',
				lastname: 'Njuguna',
				address: 'Kenya',
				isAdmin: false
			},
			process.env.JWT_KEY, {
				expiresIn: '1h',
			});
		done();
	});

	after('after all test', (done) => {
		Db.query('DELETE FROM loans');
		Db.query('DROP TABLE IF EXISTS loans');
		console.log('after');
		done();
	});

	describe('/POST user request loan', () => {

		it('should check loan field is not entered', (done) => {
			chai.request(app)
				.post('/api/v2/requestloan')
				.set('authorization', `Bearer ${userToken}`)
				.send({
					'': 10000,
					"tenor": 4
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
					tenor: 2
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
					amount: 200000,
					tenor: 6
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
					tenor: 6
				})
				.end((err, res) => {
					res.should.have.status(409);
					if (err) return done();
					done();
				});
		});
	});

	describe('/CALCULATE TOTAL AMOUNT', (done) => {

		it('should calculate the Total amount payable when user enters loan request', () => {
			assert.equal(2100, total.totalAmountdata(2000, 4).totalamounttoPay);
			expect(total.totalAmountdata(2000, 5)).to.be.an('Object');
		});

	});

	describe('/GET admin', () => {

		it('should get all loan applications', (done) => {
			chai.request(app)
				.get('/api/v2/loans')
				.set('authorization', `Bearer ${adminToken}`)
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
					tenor: 6
				})
				.end((err, res) => {
					res.should.have.status(409);
					if (err) return done();
					done();
				});
		});
	});

	describe('/CALCULATE TOTAL AMOUNT', (done) => {
		it('should calculate the Total amount payable when user enters loan request', () => {
			assert.equal(2100, total.totalAmountdata(2000, 4).totalamounttoPay);
			expect(total.totalAmountdata(2000, 5)).to.be.an('Object');
		});
	});

	describe('/GET admin get loans by their status', (done) => {
		it('should get all loans fully paid', (done) => {
			chai.request(app)
				.get('/api/v2/loans?status=pending&repaid=false')
				.set('authorization', `Bearer ${adminToken}`)
				.end((err, res) => {
					res.should.have.status(200);
					if (err) return done();
					done();
				});
		});

		it('should check a loan id is not available', (done) => {
			chai.request(app)
				.get('/api/v2/loan/30000')
				.set('authorization', `Bearer ${adminToken}`)
				.send({
					status: 'rejected'
				})
				.end((err, res) => {
					res.should.have.status(404);
					if (err) return done();
					done();
				});
		});
		it('should check a loan id is not available', (done) => {
			chai.request(app)
				.get('/api/v2/loan/30000')
				.set('authorization', `Bearer ${adminToken}`)
				.send({
					status: 'rejected'
				})
				.end((err, res) => {
					res.should.have.status(404);
					if (err) return done();
					done();
				});
		});
	});
});
