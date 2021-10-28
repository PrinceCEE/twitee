import mongoose, { Connection } from "mongoose";
import { ITwit, IUser } from "../../interfaces";
import { IComment } from "../../interfaces/comment.interface";
import { CommentSchema, TwitSchema, UserSchema } from "../../schemas";
import { TwitService, UserService } from "../../services";

describe("Test the Twit Service", () => {
  let connection: Connection,
    twitService: TwitService,
    user: IUser,
    twit: ITwit;

  beforeAll(async () => {
    connection = await mongoose.createConnection(process.env.DB_URL);
    const userModel = connection.model<IUser>("User", UserSchema);
    const twitModel = connection.model<ITwit>("Twit", TwitSchema);
    const commentModel = connection.model<IComment>(
      "Comment",
      CommentSchema
    );

    const userService = new UserService(userModel);
    twitService = new TwitService(twitModel, commentModel);

    user = await userService.createUser({
      email: "user@gmail.com",
      password: "password",
    });
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  test("Create new twit", async () => {
    twit = await twitService.newTwit({
      content: "My first twit",
      poster: user.id,
    });
    expect(twit.content).toBe("My first twit");
  });

  test("Get twit", async () => {
    const retTwit = await twitService.getTwit(twit.id);
    expect(retTwit.content).toBe("My first twit");
  });

  test("Get all twits", async () => {
    const twits = await twitService.allTwits();
    expect(twits.length).toBe(1);
  });

  test("Get empty twit comments", async () => {
    const comments = await twitService.twitComments(twit.id);
    expect(comments.length).toBe(0);
  });

  test("Check is twit liked", async () => {
    const isLiked = await twitService.isTwitLiked(user.name, twit.id);
    expect(isLiked).toBe(false);
  });

  test("Like twit", async () => {
    const likedTwit = await twitService.likeTwit(twit.id, user.name);
    expect(likedTwit.likes.length).toBe(1);
  });

  test("Unlike twit", async () => {
    const unLikedTwit = await twitService.unlikeTwit(
      twit.id,
      user.name
    );
    expect(unLikedTwit.likes.length).toBe(0);
  });

  test("delete twit", async () => {
    const deletedTwit = await twitService.deleteTwit(twit.id);
    expect(deletedTwit.id).toBe(twit.id);
  });

  describe("Add comments to twits", () => {
    let twit: ITwit;

    beforeAll(async () => {
      twit = await twitService.newTwit({
        content: "My first twit",
        poster: user.id,
      });
    });

    test("Add comment", async () => {
      const comment = await twitService.addComment({
        content: "Twit content",
        poster: user.id,
        twit: twit.id,
      });

      expect(comment.content).toBe("Twit content");
    });

    test("all comments", async () => {
      const comments = await twitService.twitComments(twit.id);

      expect(comments.length).toBe(1);
    });
  });
});
