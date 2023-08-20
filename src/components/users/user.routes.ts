import express from "express"
let router = express.Router();
import {getUserById as getUserByIdController,getUsers as getUsersController,deleteUser as deleteUserController,updateUser as updateUserController, createUser as createUserController} from './user.controller';
import {getUsers as getUsersValidator,createUser as createUserValidator, updateUser as updateUserValidator, deleteUser as deleteUserValidator} from './user.validation';
import {getUsers as getUsersAuth, manageUsers as manageUsersAuth} from '../../middleware/auth'

/**
 * @route   GET api/users
 * @desc    Get all users
 * @access  Admin
 */
router.get('/',getUsersAuth,getUsersValidator , getUsersController as any);

/**
 * @route   GET api/users/:userId
 * @desc    Get user by id
 * @access  Owner, Admin
 */
router.get('/:userId', getUsersAuth, getUsersValidator, getUserByIdController as any);

/**
 * @route   POST api/users
 * @desc    Create user
 * @access  Admin
 */
router.post('/', manageUsersAuth,createUserValidator, createUserController as any);

/**
 * @route   PATCH api/users/:userId
 * @desc    Update user
 * @access  Owner, Admin
 */
router.patch('/:userId', manageUsersAuth ,updateUserValidator, updateUserController as any);

/**
 * @route   DELETE api/users/:userId
 * @desc    Delete a user
 * @access  Owner, Admin
 */
router.delete('/:userId', manageUsersAuth , deleteUserValidator, deleteUserController as any);

export default router;
