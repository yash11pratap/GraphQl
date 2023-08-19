import Tweet from "../models/tweet";
import Like from "../models/Like";
import Comment from "../models/Comment";
import Retweet  from "../models/retweet";
import { cloudinaryLink } from "../utils/upload";
import { NextFunction, Response, Request } from "express";

// Get All Tweets
export const getAllTweets = async (req : Request, res : Response, next : NextFunction) => {
  try {
    const tweets = await Tweet.find();
    res.status(200).json({
      status: "success",
      data: {
        tweets
      }
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      status: "fail",
      msg: err.message
    });
  }
};

// Get Tweet
export const getTweet = async (req : Request, res : Response, next : NextFunction) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        tweet
      }
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      status: "fail",
      msg: err.message
    });
  }
};

// Create Tweet
export const createTweet = async (req : Request, res : Response, next : NextFunction) => {
  try {
    const user = res.locals.user;
    // Get Cloudinary Link for Media
    const mediaLink = await cloudinaryLink(req.file.path);
    let tweet = await Tweet.create({
      userId: user._id,
      text: req.body.text,
      media: mediaLink.url
    });
    tweet = await (tweet.populate("userId", "name username") as any).execPopulate();

    res.status(201).json({
      status: "success",
      data: {
        tweet
      }
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      status: "fail",
      msg: err.message
    });
  }
};

// Get Tweets Of User
export const getTweetsOfUser = async (req : Request, res : Response, next : NextFunction) => {
  try {
    const userId = req.params.id;
    const tweets = await Tweet.find({ userId })
      .populate("userId", "name username")
      .sort("-createdAt");
    res.status(200).json({
      status: "success",
      data: {
        length: tweets.length,
        tweets
      }
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      status: "fail",
      msg: err.message
    });
  }
};

// Update My Tweet
export const updateMyTweet = async (req : Request, res : Response, next : NextFunction) => {
  try {
    const tweet = await Tweet.findOneAndUpdate(
      { _id: req.params.id, userId: res.locals.user.id },
      req.body,
      {
        new: true
      }
    );
    res.status(200).json({
      status: "success",
      data: {
        tweet
      }
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ status: "error", msg: err.message });
  }
};

// Delete My Tweet
export const deleteMyTweet = async (req : Request, res : Response, next : NextFunction) => {
  try {
    const tweetId = req.params.id;
    await Tweet.findOneAndDelete({ _id: tweetId, userId: res.locals.user.id });
    await Like.deleteMany({ tweetId });
    await Comment.deleteMany({ tweetId });
    await Retweet.deleteMany({ tweetId });
    res
      .status(204)
      .json({ status: "success", msg: "Tweet successfully deleted" });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ status: "error", msg: err.message });
  }
};
