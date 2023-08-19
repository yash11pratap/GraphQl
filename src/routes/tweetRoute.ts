import express  from "express";
const router = express.Router();

import {getAllTweets,createTweet,getTweet,updateMyTweet,deleteMyTweet} from "../controllers/tweetController";
import {protect} from "../controllers/authController";
import {getLikedUsersOfTweet,likeTweet,unLikeTweet} from "../controllers/likeController";
import {getCommentsOfTweet,createComment,deleteComment} from "../controllers/commentController";
import {addBookmark,removeBookmark} from "../controllers/bookmarkController";
import {createRetweet,deleteRetweet,getRetweetedUsersOfTweet} from "../controllers/retweetController";
import { upload } from "../utils/upload";

// For Logged-in users
router.use(protect);

router
  .route("/")
  .get(getAllTweets)
  .post(upload.single("media"), createTweet);

// Related to Like
router.get("/like/users/:id", getLikedUsersOfTweet);
router.post("/like/:id", likeTweet);
router.post("/unlike/:id", unLikeTweet);

// Related To Comment
router.get("/comments/:id", getCommentsOfTweet);
router.post("/comment/:id", createComment);
router.delete("/comment/remove/:id", deleteComment);

// Related To Bookmark
router.post("/bookmark/:id", addBookmark);
router.delete("/bookmark/:id",removeBookmark);

// Related To Retweet
router.get("/retweet/:id", getRetweetedUsersOfTweet);
router.post("/retweet/:id", createRetweet);
router.delete("/retweet/:id", deleteRetweet);

router
  .route("/:id")
  .get(getTweet)
  .patch(updateMyTweet)
  .delete(deleteMyTweet);
  
export default router;
