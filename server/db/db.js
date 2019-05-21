import { Pool } from 'pg';
import config from '../../config/config';
import userDate from '../helpers/Date';
import dotenv from 'dotenv';

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
          userid VARCHAR(100) NOT NULL,
          email VARCHAR(128) NOT NULL,
          firstname VARCHAR(128) NOT NULL,
          lastname VARCHAR(128) NOT NULL,
          userpassword VARCHAR(128) NOT NULL,
          address VARCHAR(128) NOT NULL,
          status VARCHAR(128) NOT NULL,
          isAdmin VARCHAR(100)  NOT NULL,
          signedupDate VARCHAR(100)  NOT NULL
        )`;
      this.dropTables = 'DROP TABLE IF EXISTS users';
      this.deleteData = 'DELETE FROM users';

      this.initDb();
      this.createAdmin();

    } catch (error) {
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
      return err;
    }
  }

  async initDb() {
    try {
      await this.query(this.queryUsers);
    } catch (error) {
      console.log(error);
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
      const email = process.env.email;
      const sql = `SELECT * FROM users WHERE email='${email}'`;
      const {
        rows
      } = await this.query(sql);
      if (rows.length === 0) {
        const adminUser = {
          userid: '123admin',
          email: process.env.email,
          firstname: 'admin',
          lastname: 'admin',
          password: process.env.password,
          address: 'kenya',
          status: 'verifieddsd',
          isAdmin: true,
          signedupDate: userDate.date()
        };
        const sql = 'INSERT INTO users (userid, email, firstname, lastname, userpassword, address, status, isAdmin, signedupDate) values($1, $2, $3, $4, $5, $6 , $7 ,$8 , $9) returning *';
        const value = [adminUser.userid, adminUser.email, adminUser.firstname, adminUser.lastname, adminUser.password, adminUser.address, adminUser.status, adminUser.isAdmin, adminUser.signedupDate];
        const {
          row
        } = this.query(sql, value);
      }
    } catch (error) {
    }
  }
  
}

export default new DatabaseInit();
