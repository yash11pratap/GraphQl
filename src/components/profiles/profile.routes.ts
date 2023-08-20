import express from 'express'
import {followProfile,unfollowProfile,getProfiles,getProfile as getProfileController,updateProfile as updateProfileController} from './profile.controller'
import {getProfile,updateProfile} from './profile.validation'
import auth from '../../middleware/auth'
import validate from '../../middleware/validate'

/**
 * @route   POST / DELETE api/profiles/follow/:userId
 * @desc    Follow / unfollow profile
 * @access  User
 */
const router=express.Router();
router
  .route('/follow/:userId')
  .post(auth(), validate(getProfile), followProfile)
  .delete(auth(), validate(getProfile), unfollowProfile);

/**
 *  @route   GET api/profiles
 *  @desc    Get profiles
 *  @access  Public
 */
router.get('/', validate(getProfiles), getProfiles);

/**
 * @route   GET api/profiles/:userId
 * @desc    Get user's profile
 * @access  Public
 */
router.get('/:userId', validate(getProfile), getProfileController);

/**
 * @route   PATCH api/profiles/:userId
 * @desc    Update user's profile
 * @access  Owner, Admin
 */
router.patch(
  '/:userId',
  auth('manageUsers'),
  validate(updateProfile),
  updateProfileController
);

export default  router;
