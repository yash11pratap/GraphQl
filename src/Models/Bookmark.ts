import mongoose  from  "mongoose";

const bookmarkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User"
  },
  tweetId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Tweet"
  }
});

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
export default Bookmark;
