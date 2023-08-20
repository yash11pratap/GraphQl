import { pick }  'lodash';
import Tweet from './tweet.model';
import { ErrorHandler } from '../../utils/error'
import User  from '../users/user.model'
import Profile  from '../profiles/profile.model'
import { Request,Response,NextFunction } from 'express';
export const getFeedsTweets = async (req : Request, res : Response) => {
  const options = pick(req.query, ['limit', 'page']);
  const { _id: userId } = req.user;
  options.populate = {
    path: 'author',
    select: ['name', 'username', 'avatar'],
  };
  options.sortBy = 'createdAt:desc';

  const profile = await Profile.findOne({ user: userId });

  const tweets = await Tweet.paginate(
    {
      $and: [
        { replyTo: null },
        {
          $or: [
            { author: userId },
            {
              author: {
                $in: profile.following,
              },
            },
          ],
        },
      ],
    },
    options
  );

  res.json(tweets);
};

export const getTweets = async (req : Request, res : Response) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const filters = pick(req.query, ['author', 'likes', 'retweets', 'replyTo']);

  // By default, do not include tweets replies
  if (!filters.replyTo) {
    filters.replyTo = null;
  }

  if (filters.author && !(await User.exists({ _id: filters.author }))) {
    throw new ErrorHandler(404, 'User does not exists');
  }

  if (filters.likes && !(await User.exists({ _id: filters.likes }))) {
    throw new ErrorHandler(404, 'User does not exists');
  }

  if (filters.retweets && !(await User.exists({ _id: filters.retweets }))) {
    throw new ErrorHandler(404, 'User does not exists');
  }

  if (filters.replyTo && !(await Tweet.exists({ _id: filters.replyTo }))) {
    throw new ErrorHandler(404, 'Tweet does not exists');
  }

  options.populate = {
    path: 'author',
    select: ['name', 'username', 'avatar'],
  };
  options.sortBy = options.sortBy || 'createdAt:desc';

  const tweets = await Tweet.paginate(filters, options);

  res.json(tweets);
};

export const getTweet = async (req : Request, res : Response) => {
  const { tweetId } = req.params;

  const tweet = await Tweet.findById(tweetId).populate('author', ['name', 'username', 'avatar']);

  if (!tweet) {
    throw new ErrorHandler(404, 'Tweet not found');
  }

  res.json({ tweet });
};

export const createTweet = async (req : Request, res : Response) => {
  const { _id: authUserId } = req.user;
  const values = pick(req.body, ['text', 'replyTo']);
  values.author = authUserId;

  if (values.replyTo && !(await Tweet.exists({ _id: values.replyTo }))) {
    throw new ErrorHandler(404, 'Tweet not found');
  }

  const tweet = await Tweet.create(values);

  res.status(201).json({ tweet });

  if (values.replyTo) {
    const originalTweet = await Tweet.findById(values.replyTo);
    await originalTweet.updateRepliesCount();
  }
};

export const updateTweet = async (req : Request, res : Response) => {
  const { tweetId } = req.params;
  const { _id: authUserId } = req.user;
  const newValues = pick(req.body, ['text']);
  newValues.edited = true;

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ErrorHandler(404, 'Tweet not found');
  }

  if (!tweet.author.equals(authUserId) && req.user.role !== 'admin') {
    throw new ErrorHandler(403, "You cannot update someone's tweet");
  }

  Object.assign(tweet, newValues);

  await tweet.save();

  res.json({ tweet });
};

export const deleteTweet = async (req : Request, res : Response) => {
  const { tweetId } = req.params;
  const { _id: authUserId } = req.user;

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ErrorHandler(404, 'Tweet not found');
  }

  if (!tweet.author.equals(authUserId) && req.user.role !== 'admin') {
    throw new ErrorHandler(403, "You cannot delete someone's tweet");
  }

  await tweet.remove();

  res.json({ tweet });

  if (tweet.replyTo) {
    const originalTweet = await Tweet.findById(tweet.replyTo);
    if (originalTweet) {
      await originalTweet.updateRepliesCount();
    }
  }
};

export const likeTweet = async (req : Request, res : Response) => {
  const { tweetId } = req.params;
  const { _id: userId } = req.user;

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ErrorHandler(404, 'Tweet not found');
  }

  const profile = await Profile.findOne({ user: userId });

  if (profile.likesIt(tweetId)) {
    throw new ErrorHandler(400, 'User already likes a tweet');
  }

  await Promise.all([profile.like(tweetId), tweet.like(userId)]);

  res.json({ tweet });
};

export const unlikeTweet = async (req : Request, res : Response) => {
  const { tweetId } = req.params;
  const { _id: userId } = req.user;

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ErrorHandler(404, 'Tweet not found');
  }

  const profile = await Profile.findOne({ user: userId });

  if (!profile.likesIt(tweetId)) {
    throw new ErrorHandler(400, 'User did not liked the tweet yet');
  }

  await Promise.all([profile.unlike(tweetId), tweet.unlike(userId)]);

  res.json({ tweet });
};

export const retweet = async (req : Request, res : Response) => {
  const { tweetId } = req.params;
  const { _id: userId } = req.user;

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ErrorHandler(404, 'Tweet not found');
  }

  const profile = await Profile.findOne({ user: userId });

  if (profile.retweeted(tweetId)) {
    throw new ErrorHandler(400, 'User already retweeted a tweet');
  }

  await Promise.all([profile.retweet(tweetId), tweet.retweet(userId)]);

  res.json({ tweet });
};

export const unRetweet = async (req : Request, res : Response) => {
  const { tweetId } = req.params;
  const { _id: userId } = req.user;

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ErrorHandler(404, 'Tweet not found');
  }

  const profile = await Profile.findOne({ user: userId });

  if (!profile.retweeted(tweetId)) {
    throw new ErrorHandler(400, 'User did not retweeted a tweet yet');
  }

  await Promise.all([profile.unRetweet(tweetId), tweet.unRetweet(userId)]);

  res.json({ tweet });
};

