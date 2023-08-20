const router = from 'express').Router();
const auth = from '../../middleware/auth');
const validate = from '../../middleware/validate');
const tweetController = from './tweet.controller');
const tweetValidation = from './tweet.validation');

router.route('/feed').get(auth(), validate(tweetValidation.getFeedsTweets), tweetController.getFeedsTweets);

router
  .route('/like/:tweetId')
  .post(auth(), validate(tweetValidation.getTweet), tweetController.likeTweet)
  .delete(auth(), validate(tweetValidation.getTweet), tweetController.unlikeTweet);

router
  .route('/retweet/:tweetId')
  .post(auth(), validate(tweetValidation.getTweet), tweetController.retweet)
  .delete(auth(), validate(tweetValidation.getTweet), tweetController.unRetweet);

router
  .route('/')
  .get(validate(tweetValidation.getTweets), tweetController.getTweets)
  .post(auth(), validate(tweetValidation.createTweet), tweetController.createTweet);

router
  .route('/:tweetId')
  .get(validate(tweetValidation.getTweet), tweetController.getTweet)
  .patch(auth(), validate(tweetValidation.updateTweet), tweetController.updateTweet)
  .delete(auth(), validate(tweetValidation.deleteTweet), tweetController.deleteTweet);

export default = router;
