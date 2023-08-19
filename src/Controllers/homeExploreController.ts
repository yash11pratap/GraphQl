import Connection  from "../models/Connection";
import Tweet  from "../models/tweet";
import Retweet  from "../models/retweet";
import User from "../models/User";
import Comment from "../models/Comment";
import { NextFunction, Response, Request } from "express";

export const getHomeContent = async (req : Request, res : Response) => {
  try {
    let followings = await Connection.find({ following: res.locals.user.id });
    let result = [];

    // Get other user's tweets and retweets
    for (let i = 0; i < followings.length; i++) {
      const tweetArr = await Tweet.find({
        userId: followings[i].followed
      }).populate("userId", "name username");
      const retweetArr = await Retweet.find({
        userId: followings[i].followed
      })
        .populate({
          path: "tweetId",
          populate: {
            path: "userId",
            select: "name username"
          }
        })
        .populate("userId", "name username");
      const commentsArr = await Comment.find({
        userId: followings[i].followed
      })
        .populate("tweetId")
        .populate("userId", "name username");
      result = result.concat(tweetArr, retweetArr, commentsArr);
    }
    // Get logged in user's tweets and retweets
    result = result.concat(
      await Tweet.find({ userId: res.locals.user.id }).populate(
        "userId",
        "name username"
      )
    );
    result = result.concat(
      await Retweet.find({ userId: res.locals.user.id })
        .populate({
          path: "tweetId",
          populate: {
            path: "userId",
            select: "name username"
          }
        })
        .populate("userId", "name username")
    );
    result = result.concat(
      await Comment.find({ userId: res.locals.user.id })
        .populate({
          path: "tweetId",
          populate: {
            path: "userId",
            select: "name username"
          }
        })
        .populate("userId", "name username")
    );

    // Sort all tweets according to the date in descending order
    result.sort(function (tweet1, tweet2) {
      return tweet2.createdAt  - tweet1.createdAt;
    });

    res.status(200).json({
      status: "success",
      data: {
        result
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

export const getExploreContent = async (req : Request, res : Response) => {
  try {
    console.log("HEY")
    const suggestions = await getFollowSuggestion(res.locals.user.id);
    console.log("HEY2")

    res.status(200).json({
      status: "success",
      data: {
        suggestions
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

export const getFollowSuggestion = async (id) => {
  const followings = await Connection.find({ following: id }).select(
    "followed"
  );
  console.log(getFollowSuggestion+id);
  let followingsArr = Array.from(followings, (f) => (f as any).followed);
  followingsArr.push(id);

  // Get User's which are not in the followings of the user.
  const users = await User.find({ _id: { $nin: followingsArr } });
  return users;
};
