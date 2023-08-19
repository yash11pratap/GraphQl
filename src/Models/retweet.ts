import mongoose  from  "mongoose";

const retweetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true
    },
    tweetId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Tweet",
      required: true
    }
  },
  { timestamps: true }
);

const Retweet = mongoose.model("Retweet", retweetSchema);
export default  Retweet;
