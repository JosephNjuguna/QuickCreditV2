import { Pool } from 'pg';
import dotenv from 'dotenv';
import config from '../../config/config';
import userDate from '../helpers/Date';
import EncryptData from '../helpers/Encrypt';

dotenv.config();

const dbConfig = {
	connectionString: config.db,
};

class DatabaseInit {
	constructor() {
		try {
			this.pool = new Pool(dbConfig);
			this.connect = async () => this.pool.on('connect', (err) => {
			});

			this.queryUsers = `CREATE TABLE IF NOT EXISTS users(
          id serial PRIMARY KEY,
          email VARCHAR(128) NOT NULL,
          firstname VARCHAR(128) NOT NULL,
          lastname VARCHAR(128) NOT NULL,
          userpassword VARCHAR(128) NOT NULL,
          address VARCHAR(128) NOT NULL,
          status VARCHAR(128) NOT NULL,
          isAdmin VARCHAR(100)  NOT NULL,
          signedupDate VARCHAR(100)  NOT NULL
        )`;
			this.queryLoans = `CREATE TABLE IF NOT EXISTS loans(
          id serial PRIMARY KEY,
          usermail VARCHAR(100) NOT NULL,
          firstname VARCHAR(100) NOT NULL,
          lastname VARCHAR(100) NOT NULL,
          requestedOn VARCHAR(100) NOT NULL,
          status VARCHAR(100) NOT NULL,
          repaid VARCHAR(100) NOT NULL,
          tenor VARCHAR(120) NOT NULL,
          principalAmount VARCHAR(100) NOT NULL,
          paymentInstallment VARCHAR(100)  NOT NULL,
          totalAmounttopay VARCHAR(100) NOT NULL,
          intrestRate VARCHAR(100) NOT NULL
        )`;

			this.queryPayments = `CREATE TABLE IF NOT EXISTS payments(
          id serial PRIMARY KEY,
          loanid INT NOT NULL,
          usermail VARCHAR(100) NOT NULL,
          totalAmounttopay  INT  NOT NULL,
          installmentAmount  INT  NOT NULL,
          balance  INT  NOT NULL,
          paymentNo  INT  NOT NULL,
          paidOn VARCHAR(28) NOT NULL
          )`;
			this.dropTables = 'DROP TABLE IF EXISTS users';
			this.deleteData = 'DELETE FROM users';

			this.initDb();
			this.createAdmin();
		} catch (error) {
			return error.toString();
		}
	}

	async query(sql, data = []) {
		const conn = await this.connect();
		try {
			if (data.length) {
				return await conn.query(sql, data);
			}
			return await conn.query(sql);
		} catch (err) {
			return err.toString();
		}
	}

	async initDb() {
		try {
			await this.query(this.queryUsers);
			await this.query(this.queryLoans);
			await this.query(this.queryPayments);
		} catch (error) {
			return error.toString();
		}
	}

	async deleteData() {
		await this.query(this.deleteData);
	}

	async dropTables() {
		await this.query(this.dropTables);
	}

	async createAdmin() {
		try {
			const { email } = process.env;
			const sql = `SELECT * FROM users WHERE email='${email}'`;
			const {
				rows
			} = await this.query(sql);
			if (rows.length === 0) {
				const hashedPassword = EncryptData.generateHash(process.env.password);
				const adminUser = {
					email: process.env.email,
					firstname: 'admin',
					lastname: 'admin',
					password: hashedPassword,
					address: 'kenya',
					status: 'verifieddsd',
					isAdmin: true,
					signedupDate: userDate.date(),
				};
				const sql = 'INSERT INTO users ( email, firstname, lastname, userpassword, address, status, isAdmin, signedupDate) values($1, $2, $3, $4, $5, $6 , $7 ,$8) returning *';
				const value = [adminUser.email, adminUser.firstname, adminUser.lastname, adminUser.password, adminUser.address, adminUser.status, adminUser.isAdmin, adminUser.signedupDate];
				const {
					row,
				} = this.query(sql, value);
			}
		} catch (error) {
			return error.toString();
		}
	}
}

export default new DatabaseInit();
