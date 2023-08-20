import express from 'express'
const router=express.Router();
import auth  from '../../middleware/auth'
import validate  from '../../middleware/validate'
import {updateTweet as updateTweetController, deleteTweet as deleteTweetController, unlikeTweet as unlikeTweetController,getTweet as getTweetController, getTweets as getTweetsController,createTweet as createTweetController ,getFeedsTweets as getFeedsTweetsController, likeTweet as likeTweetController, unRetweet as unRetweetController, retweet as retweetController}  from './tweet.controller'
import {getFeedsTweets as getFeedsTweetsValidator, getTweet as getTweetValidator, updateTweet as uploadTweetValidator, deleteTweet as deleteTweetValidator, getTweets as getTweetsValidator}  from './tweet.validation'

router.route('/feed').get(auth(), validate(getFeedsTweetsValidator), getFeedsTweetsController);

router
  .route('/like/:tweetId')
  .post(auth(), validate(getTweetValidator), likeTweetController)
  .delete(auth(), validate(getTweetValidator), unlikeTweetController);

router
  .route('/retweet/:tweetId')
  .post(auth(), validate(getTweetValidator), retweetController)
  .delete(auth(), validate(getTweetValidator),unRetweetController);

router
  .route('/')
  .get(validate(getTweetsValidator), getTweetsController)
  .post(auth(), validate(getTweetValidator), createTweetController);

router
  .route('/:tweetId')
  .get(validate(getTweetValidator), getTweetController)
  .patch(auth(), validate(getTweetValidator), updateTweetController)
  .delete(auth(), validate(getTweetValidator), deleteTweetController);

export default router;
