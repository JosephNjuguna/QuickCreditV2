import jwt from 'jsonwebtoken';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';
import Db from '../db/db';
import userDate from '../helpers/Date';
import dotenv from 'dotenv';

dotenv.config();

chai.should();
const {
  expect
} = chai;
chai.use(chaiHttp);

const user = {
  email: 'test1@mail.com',
  firstname: 'test',
  lastname: 'test',
  password: 'qwerQ@qwerre123',
  address: 'kenya',
  status: 'unverified',
  isAdmin: false,
  signedupDate: userDate.date(),
};

let userToken, adminToken, wrongemailToken;
const wrongId = 134243;

describe('/USER DATA', () => {
  before('add user', (done) => {
    adminToken = jwt.sign({
      email: 'admin123@gmail.com',
      userid: '123admin',
      firstname: 'main',
      lastname: 'admin',
      address: 'database'
    }, process.env.JWT_KEY, {
      expiresIn: '1h'
    });

    userToken = jwt.sign({
      email: 'test1@mail.com',
      firstname: 'Joseph',
      lastname: 'Njuguna',
      address: 'Kenya'
    }, process.env.JWT_KEY, {
      expiresIn: '1h'
    });

    wrongemailToken = jwt.sign({
      email: 'test1sddd@mail.com',
      firstname: 'Joseph',
      lastname: 'Njuguna',
      address: 'Kenya'
    }, process.env.JWT_KEY, {
      expiresIn: '1h'
    });

    const {
      rows
    } = Db.query('INSERT INTO users (email, firstname, lastname, userpassword, address, status, isAdmin, signedupDate) values($1, $2, $3, $4, $5 ,$6 ,$7 ,$8)',
      [user.email, user.firstname, user.lastname, user.password, user.address, user.status, user.isAdmin, user.signedupDate]);
    done();
  });

  after('after all test', (done) => {
    Db.query('DELETE FROM users');
    done();
  });

  describe('/PATCH admin verify user', () => {

    it('should check user not authorized to access the route', (done) => {
      chai.request(app)
        .patch('/api/v2/user/test2@mail.com/verify')
        .set('authorization', `Bearer ${userToken}`)
        .send({
          status: 'verified'
        })
        .end((err, res) => {
          expect(res.status).equals(403);
          if (err) return done();
          done();
        })
    })

  })

  describe('/GET user datail', () => {

    it('should not return a user when email is invalid', (done) => {
      chai.request(app)
        .get('/api/v2/profile')
        .set('authorization', `Bearer ${wrongemailToken}`)
        .end((err, res) => {
          res.should.have.status(404);
          if (err) return done();
          done();
        });
    });

    it('should check user email is not available', (done) => {
      chai.request(app)
        .patch('/api/v2/user/test100@mail.com/verify')
        .set('authorization', `Bearer ${adminToken}`)
        .send({
          status: 'verified',
        })
        .end((err, res) => {
          expect(res.status).equals(404);
          if (err) return done();
          done();
        });
    });

    it('should check user email is available', (done) => {
      chai.request(app)
        .patch('/api/v2/user/test1@mail.com/verify')
        .set('authorization', `Bearer ${adminToken}`)
        .send({
          status: 'verified'
        })
        .end((err, res) => {
          res.should.have.status(200);
          if (err) return done();
          done();
        });
    })

    it('should return one user detail', (done) => {
      chai.request(app)
        .get('/api/v2/profile')
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          if (err) return done();
          done();
        });
    });

  });
});
