import express from 'express';
import {registerUser,loginUser} from './auth.controller'
import {register}  from './auth.validation'
import validate  from '../../middleware/validate'

/**
 * @route   POST api/auth/register
 * @desc    Register user | Return JWT
 * @access  Public
 */
const router = express.Router();
router.post('/register', validate(register), registerUser);

/**
 * @route   POST api/users/login
 * @desc    Login user | Return JWT
 * @access  Public
 */
router.post('/login', validate(register), loginUser);

export default  router;
