import { Model } from "mongoose";
import { ITwit } from "../interfaces";
import { IComment } from "../interfaces/comment.interface";

export class TwitService {
  constructor(
    private twitModel: Model<ITwit>,
    private commentModel: Model<IComment>
  ) {}

  newTwit(data: { content: string; poster: string }) {
    const twit = new this.twitModel(data);
    return twit.save();
  }

  getTwit(id: string) {
    return this.twitModel.findById(id);
  }

  allTwits() {
    return this.twitModel.find({});
  }

  twitComments(id: string) {
    return this.commentModel.find({ twit: id });
  }

  async unlikeTwit(twitID: string, name: string) {
    const twit = await this.twitModel.findById(twitID);
    const index = twit.likes.findIndex(
      (val) => val.username === name
    );

    twit.likes.splice(index, 1);
    return twit.save();
  }

  async isTwitLiked(name: string, twitID: string) {
    const twit = await this.twitModel.findById(twitID);
    const val = twit.likes.find((like) => like.username === name);
    return !!val;
  }

  async likeTwit(twitID: string, name: string) {
    const twit = await this.twitModel.findById(twitID);
    twit.likes.push({
      username: name,
    });
    return twit.save();
  }

  async deleteTwit(id: string) {
    const twit = await this.twitModel.findOneAndDelete({ _id: id });

    // delete all the twit comments after deleting twit
    await this.commentModel.deleteMany({ twit: twit.id });
  }

  addComment(data: {
    content: string;
    poster: string;
    twit: string;
  }) {
    const comment = new this.commentModel(data);
    return comment.save();
  }
}
