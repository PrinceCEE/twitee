import { Schema } from "mongoose";

export const CommentSchema = new Schema({
  twit: { type: Schema.Types.ObjectId, ref: "Twit" },
  poster: { type: Schema.Types.ObjectId, ref: "User" },
  content: String,
});
