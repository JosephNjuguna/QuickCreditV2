import Db from '../db/db';

class UsersModel {
	constructor(payload = null) {
		this.payload = payload;
		this.result = null;
	}

	static async findByEmail(email) {
		const sql = `SELECT * FROM users WHERE email='${email}'`;
		const { rows } = await Db.query(sql);
		if (rows.length === 0) {
			return false;
		}
		return true;
		this.result;
	}

	static async signup(email, firstname, lastname, password, address, status, isAdmin, signedupDate) {
		const values = [email, firstname, lastname, password, address, status, isAdmin, signedupDate];
		const sql = 'INSERT INTO users ( email, firstname, lastname, userpassword, address, status, isAdmin, signedupDate) VALUES($1, $2, $3, $4, $5 ,$6 ,$7 ,$8) returning *';
		const { rows } = await Db.query(sql, values);
		const result = rows[0];
		return result;
	}

	static async login(email) {
		const sql = `SELECT * FROM users WHERE email='${email}'`;
		const {
			rows,
		} = await Db.query(sql);
		if (rows.length === 0) {
			return false;
		}
		const result = rows[0];
		return result;
	}

	static async verifyUser(email, status) {
		const sql = 'UPDATE users SET status = ($1) WHERE email = $2 returning *;';
		const values = [status, email];
		const { rows } = await Db.query(sql, values);
		if (rows.length === 0) {
			return false;
		}
		this.result = rows[0];
		return true;
	}

	static async findOne(email) {
		const sql = `SELECT * FROM users WHERE email='${email}'`;
		const { rows } = await Db.query(sql);
		if (rows.length === 0) {
			return false;
		}
		this.result = rows[0];
		return true;
	}
	static async findprofile(email) {
		const sql = `SELECT * FROM users WHERE email='${email}'`;
		const { rows } = await Db.query(sql);
		if (rows.length === 0) {
			return false;
		}
		const result = rows[0];
		return result;
	}

	async allUsers() {
		const sql = 'SELECT * FROM users';
		const { rows } = await Db.query(sql);
		if (rows) {
			const result = rows[0];
			return result;
		}
		return false;
	}
}

export default UsersModel;
