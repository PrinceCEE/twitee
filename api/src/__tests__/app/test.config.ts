import mongoose from "mongoose";
import initApp from "../../app";
import { UserSchema, TwitSchema, CommentSchema } from "../../schemas";
import { IUser, ITwit, IComment } from "../../interfaces";
import {
  AuthService,
  UserService,
  TwitService,
} from "../../services";

async function bootstrapApp() {
  const connection = await mongoose.createConnection(
    process.env.DB_URL
  );

  // models
  const userModel = connection.model<IUser>("User", UserSchema);
  const twitModel = connection.model<ITwit>("Twit", TwitSchema);
  const commentModel = connection.model<IComment>(
    "Comment",
    CommentSchema
  );

  // Services
  const userService = new UserService(userModel);
  const authService = new AuthService();
  const twitService = new TwitService(twitModel, commentModel);

  // set up app
  const app = initApp(authService, userService, twitService);

  return { app, connection };
}

export default bootstrapApp;
