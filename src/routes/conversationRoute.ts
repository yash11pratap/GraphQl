import express  from "express";
const router = express.Router();
import Conversation from "../models/Conversation";
import { Request,Response } from "express";

//new conv

router.post("/", async (req : Request, res : Response) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId]
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get conv of a user

router.get("/:userId", async (req : Request, res : Response) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] }
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get conv includes two userId

router.get("/find/:firstUserId/:secondUserId", async (req : Request, res : Response) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] }
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
