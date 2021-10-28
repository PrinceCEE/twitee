import { Document } from "mongoose";

export interface ITwit extends Document {
  poster: any;
  content: string;
  likes: {
    username: string;
  }[];
}
