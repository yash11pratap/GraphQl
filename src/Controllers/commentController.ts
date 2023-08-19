import Tweet  from "../models/Tweet";
import Comment  from "../models/Comment";
import { NextFunction, Response, Request } from "express";

// Create Comment
export const createComment = async (req : Request, res : Response) => {
  try {
    const tweetId = req.params.id,
      userId = res.locals.user.id,
      text = req.body.text;
    let comment = await Comment.create({ tweetId, userId, text }) as any;
    const tweet = await Tweet.findByIdAndUpdate(
      tweetId,
      {
        $inc: { commentsCount: 1 }
      },
      { new: true }
    );

    comment = await comment
      .populate({
        path: "tweetId",
        populate: {
          path: "userId",
          select: "name username"
        }
      })
      .populate("userId", "name username")
      .execPopulate();

    res.status(200).json({
      status: "success",
      data: {
        comment,
        tweet
      }
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
      msg: err.message
    });
  }
};

// Delete Comment
export const deleteComment = async (req : Request, res : Response) => {
  try {
    const tweetId = req.params.id,
      userId = res.locals.user.id;
    const comment = await Comment.findOneAndDelete({ tweetId, userId });
    const tweet = await Tweet.findByIdAndUpdate(
      tweetId,
      { $inc: { commentsCount: -1 } },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      data: {
        tweet,
        comment
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      msg: err.message
    });
  }
};

// Get Comments Of Tweet
export const getCommentsOfTweet = async (req : Request, res : Response) => {
  try {
    const tweetId = req.params.id,
      userId = res.locals.user.id;
    const comments = await Comment.find({ tweetId, userId })
      .populate("userId", "name username")
      .select("userId text");

    res.status(200).json({
      status: "success",
      data: {
        comments
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      msg: err.message
    });
  }
};

// Get Comments Of User
export const getCommentsOfUser = async (req : Request, res : Response) => {
  try {
    const userId = req.params.id;
    const comments = await Comment.find({ userId })
      .populate("tweetId")
      .select("text tweetId");

    res.status(200).json({
      status: "success",
      data: {
        comments
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      msg: err.message
    });
  }
};
