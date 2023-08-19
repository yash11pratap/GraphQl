import mongoose  from  "mongoose";


const likeSchema = new mongoose.Schema(
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
  
  const Like = mongoose.model("Like", likeSchema);
export default Like;
