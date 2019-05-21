import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import reqResponses from '../helpers/Responses';

dotenv.config();

class Token {

  static generateToken(email,firstname, lastname, address) {
    const payload =  {email,firstname, lastname, address};
    const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: 60 * 60 * 24 * 7 });
    return token;
  }

  static checkToken(token, res) {
    if (!token || token === '') {
      return reqResponses.handleError(400, 'Token required', res);
    }
    return true;
  }

}

export default Token;
