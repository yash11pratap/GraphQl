import path from "path";
import express from "express";
import authRoute from "./routes/authRoute";
import userRoute from "./routes/userRoute";
import tweetRoute from "./routes/tweetRoute";
import connectionRoute from "./routes/connectionRoute";
import messageRoute from "./routes/messageRoute";
import conversationRoute from "./routes/conversationRoute";

const app = express();

if (process.env.NODE_ENV == "development") {
  app.use(require("morgan")("dev"));
}

app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/tweets", tweetRoute);
app.use("/api/connect", connectionRoute);
app.use("/api/messages", messageRoute);
app.use("/api/conversations", conversationRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Could not find ${req.url}`
  });
});

export default app;
