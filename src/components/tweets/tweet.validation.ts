import Joi from 'joi'
import { objectId } from '../../utils/customValidation'

export const getFeedsTweets = {
  query: Joi.object().keys({
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getTweets = {
  query: Joi.object().keys({
    author: Joi.string().custom(objectId),
    likes: Joi.string().custom(objectId),
    retweets: Joi.string().custom(objectId),
    replyTo: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getTweet = {
  params: Joi.object().keys({
    tweetId: Joi.string().required().custom(objectId),
  }),
};

export const createTweet = {
  body: Joi.object().keys({
    text: Joi.string().required().min(1).max(280),
    replyTo: Joi.string().custom(objectId),
  }),
};

export const updateTweet = {
  params: getTweet.params,
  body: Joi.object().keys({
    text: Joi.string().required().min(1).max(280),
  }),
};

export const deleteTweet = {
  params: getTweet.params,
};

