import { NextFunction, Request,Response } from "express";

import Bookmark  from "../models/Bookmark";

export const addBookmark = async (req : Request, res : Response, next : NextFunction) => {
  try {
    const userId = res.locals.user.id,
      tweetId = req.params.id;

    if (await Bookmark.exists({ tweetId, userId })) {
      return res.status(400).json({
        status: "fail",
        msg: "You have already bookmarked this tweet"
      });
    }

    const bookmark = await Bookmark.create({
      tweetId,
      userId
    });

    res.status(200).json({
      status: "success",
      data: {
        bookmark
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      msg: err.message
    });
  }
};

export const removeBookmark = async (req : Request, res : Response) => {
  try {
    const userId = res.locals.user.id,
      tweetId = req.params.id;
    const bookmark = await Bookmark.findOneAndDelete({
      tweetId,
      userId
    });

    res.status(204).json({
      status: "success",
      msg: "Successfully removed bookmark",
      data: {
        bookmark
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      msg: err.message
    });
  }
};
export const getAllBookmarks = async (req : Request, res : Response) => {
  try {
    const userId = res.locals.user.id;
    const bookmarks = await Bookmark.find({ userId });

    res.status(200).json({
      status: "success",
      data: {
        bookmarks
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      msg: err.message
    });
  }
};

export const clearAllBookmarks = async (req : Request, res : Response) => {
  try {
    const userId = res.locals.user.id;
    await Bookmark.deleteMany({ userId });

    res.status(204).json({
      status: "success",
      msg: "Successfully cleared all bookmarks"
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      msg: err.message
    });
  }
};
