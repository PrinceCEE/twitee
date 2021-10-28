import { Schema } from "mongoose";

export const TwitSchema = new Schema({
  poster: { type: Schema.Types.ObjectId, ref: "User" },
  content: String,
  likes: [{ username: String }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});
