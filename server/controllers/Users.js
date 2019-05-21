import Usermodel from '../models/Users';
import EncryptData from '../helpers/Encrypt';
import userDate from '../helpers/Date';
import Userid from '../helpers/Uid';
import reqResponses from '../helpers/Responses';
import Token from '../helpers/Token';

const userid = Userid.uniqueId();
const signedupDate = userDate.date();

class Users {

  static async signup(req, res) {
    try {
      const {
        firstname,
        lastname,
        address,
        email,
        password,
      } = req.body;
      const hashedPassword = EncryptData.generateHash(password);
      const addUser = await new Usermodel({
        userid,
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
      const token = Token.genToken(email, userid, firstname, lastname, address);
      return reqResponses.handleSignupsuccess(201, 'successfully created account', token, addUser.result, res);
    } catch (error) {
      reqResponses.handleError(500, error.toString(), res);
    }
  }

}

export default Users;
