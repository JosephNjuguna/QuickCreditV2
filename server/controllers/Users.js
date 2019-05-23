import Usermodel from '../models/Users';
import EncryptData from '../helpers/Encrypt';
import userDate from '../helpers/Date';
import reqResponses from '../helpers/Responses';
import jwtGen from '../helpers/Jwt';
import jwt from 'jsonwebtoken';

const signedupDate = userDate.date();

class Users {
  
  static async signup(req, res) {
    try {
      const {
        firstname,
        lastname,
        address,
        email,
        password
      } = req.body;
      const hashedPassword = EncryptData.generateHash(password);
      const addUser = await new Usermodel({
        email,
        firstname,
        lastname,
        password: hashedPassword,
        address,
        status: 'unverified',
        isAdmin: false,
        signedupDate
      });
      if (!addUser.signup()) {
        reqResponses.handleError(409, 'Email already in use', res);
      }
      const token = jwtGen.generateToken(email,firstname, lastname, address);
      return reqResponses.handleSignupsuccess(201, 'successfully created account', token, addUser.result, res);
    } catch (error) {
      reqResponses.handleError(500, error.toString(), res);
    }
  }

  static async login(req, res) {
    try {
      const incomingEmail = req.body.email;
      const { password } = req.body;
      const addUser = await Usermodel.login(incomingEmail);
      const { email, firstname, lastname, address} = addUser;
      if (EncryptData.validPassword(password, addUser.userpassword)) {
        const token = jwtGen.generateToken(email, firstname, lastname, address);
        reqResponses.handleSignupsuccess(200, `welcome ${firstname}`, token, addUser, res);
      } else {
        reqResponses.handleError(401, 'Incorrect password', res);
      }
    } catch (error) {
      console.log(error);
      reqResponses.handleError(500, error.toString(), res);
    }
  }

  static async verifyUser(req, res) {
    try {
      const { email } = req.params;
      const { status } = req.body;

      const userVerifaction = await Usermodel.verifyUser(email, status);

      if (!userVerifaction) {
        return reqResponses.handleError(404, 'User email not found', res);
      }
      reqResponses.handleSuccess(200, 'user verified successfully', userVerifaction.result, res);
    } catch (error) {
      reqResponses.handleError(500, error.toString(), res);
    }
  }

  static async userProfile(req, res) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      req.userData = decoded;

      const userProfilemail = req.userData.email;
      const userInfo = await Usermodel.findOne(userProfilemail);

      if (!userInfo) {
        return reqResponses.handleError(404, 'User id not found', res);
      }
      reqResponses.handleSuccess(200, 'welcome', userInfo.result, res);
    } catch (error) {
      reqResponses.handleError(500, error.toString(), res);
    }
  }

  static async allUsers(req, res) {
    try {
      const allUserdata = await new Usermodel();
      if (!allUserdata.allUsers()) {
        reqResponses.handleError(404, 'No Users record found', res);
      }
      reqResponses.handleSuccess(200, 'All users record', allUserdata.result, res);
    } catch (error) {
      reqResponses.handleError(500, error.toString(), res);
    }
  }

}
export default Users;
