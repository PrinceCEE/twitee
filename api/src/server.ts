import dotenv from "dotenv";
// load the environment
dotenv.config();

import http from "http";
import mongoose from "mongoose";
import initApp from "./app";
import { AuthService, TwitService, UserService } from "./services";
import { CommentSchema, TwitSchema, UserSchema } from "./schemas";
import { ITwit, IUser, IComment } from "./interfaces";

const PORT = process.env.PORT || 3000;

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
  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });

  server.on("error", (err) => {
    console.log(err);
    process.exit(1);
  });
}

process.on("uncaughtException", (err) => {
  console.log(err);
  process.exit(1);
});

process.on("unhandledRejection", (res) => {
  console.log(res);
  process.exit(1);
});

bootstrapApp();
