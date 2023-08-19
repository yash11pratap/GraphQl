import express from "express";

const router = express.Router();

import {
  getAllUsers, 
  uploadUserImages,
  resizeUserImages,
  updateMe,
  deleteMe,
  getUser,
  updateUser } from "../controllers/userController";
import {forgotPassword,resetPassword,protect} from "../controllers/authController";
import {getLikedTweetsOfUser} from "../controllers/likeController";
import {getFollowers, getFollowing} from "../controllers/connectionController";
import {getCommentsOfUser} from "../controllers/commentController";
import {getTweetsOfUser} from "../controllers/tweetController";
import {getAllBookmarks,clearAllBookmarks} from "../controllers/bookmarkController";
import {getRetweetsOfUser} from "../controllers/retweetController";
import {getHomeContent,getExploreContent} from "../controllers/homeExploreController";

// Forgot Password
router.post("/forgotPassword", forgotPassword);
// Reset Password
router.patch("/resetPassword/:token", resetPassword);

router.use(protect);

router.get("/", getAllUsers);
router.patch(
  "/updateMe",
  uploadUserImages,
  resizeUserImages,
  updateMe
);
router.delete("/deleteMe", deleteMe);

// Related To Home And Explore Section
router.get("/home", getHomeContent);
router.get("/explore", getExploreContent);

// Related To Tweet
router.get("/tweets/:id", getTweetsOfUser);

// Related To Like
router.get("/like/:id", getLikedTweetsOfUser);

// Related To Comment
router.get("/comments/:id", getCommentsOfUser);

// Related To connection
router.get("/followers/:id", getFollowers);
router.get("/following/:id", getFollowing);

// Related To Bookmark
router.get("/bookmark", getAllBookmarks);
router.delete("/bookmark", clearAllBookmarks);

// Related To Retweet
router.get("/retweet/:id", getRetweetsOfUser);

router
  .route("/:id")
  .get(getUser)
  .patch(updateUser);

module.exports = router;
