import { Document } from "mongoose";

export interface IComment extends Document {
  twit: any;
  poster: any;
  content: string;
}
