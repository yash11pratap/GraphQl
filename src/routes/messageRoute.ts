import express  from "express";
const router = express.Router();
import Message from "../models/Message";
import { Request,Response } from "express";
//add

router.post("/", async (req : Request, res : Response) => {
  const newMessage = new Message(req.body);

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    console.log(err);

    res.status(500).json(err);
  }
});

//get

router.get("/:conversationId", async (req : Request, res : Response) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId
    });
    res.status(200).json(messages);
  } catch (err) {
    console.log(err);

    res.status(500).json(err);
  }
});

export default  router;
