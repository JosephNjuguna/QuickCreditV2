import express from 'express';
import controllers from '../controllers/Users';
import validate from '../middleware/validations';
import Auth from '../middleware/auth';

const router = express.Router();

router.post('/signup', validate.validatesignup, validate.validatenewEmail, controllers.signup);
router.post('/login', validate.validatelogin, validate.validateexistingEmail, controllers.login);
router.get('/profile', Auth.checkUser, controllers.userProfile);

export default router;
