import express from 'express';
import controllers from '../controllers/Users';
import validate from '../middleware/validations';

const router = express.Router();
router.post('/signup', validate.validatesignup, validate.validatenewEmail, controllers.signup);

export default router;
