import { Connection } from "mongoose";
import supertest from "supertest";
import { ITwit } from "../../interfaces";
import bootstrapApp from "./test.config";

describe("Test Authentication", () => {
  let app, connection: Connection;

  let twit: ITwit, accessToken: string;

  beforeAll(async () => {
    const config = await bootstrapApp();
    app = config.app;
    connection = config.connection;

    // sign in user
    const request = supertest(app);
    const { body } = await request
      .post("/auth/register")
      .send({ email: "user@gmail.com", password: "password" });
    accessToken = body.accessToken;
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  test("Unauthorized user post twit", async () => {
    const request = supertest(app);
    const { statusCode } = await request
      .post("/twits/new")
      .send({ content: "Hello, world" });

    expect(statusCode).toBe(401);
  });

  test("Post new twit", async () => {
    const request = supertest(app);
    const { body } = await request
      .post("/twits/new")
      .auth(accessToken, { type: "bearer" })
      .send({ content: "Hello, world" });

    twit = body.data;
    expect(body.data.content).toBe("Hello, world");
  });

  test("Like twit", async () => {
    const request = supertest(app);
    const { body } = await request
      .post(`/twits/like/${twit._id}`)
      .auth(accessToken, { type: "bearer" });
    expect(body.data).toBe("Successfully liked");
  });

  test("Unlike twit", async () => {
    const request = supertest(app);
    const { body } = await request
      .post(`/twits/like/${twit._id}`)
      .auth(accessToken, { type: "bearer" });
    expect(body.data).toBe("Like removed");
  });

  test("Add comment to twit", async () => {
    const request = supertest(app);
    const { body } = await request
      .post(`/twits/${twit._id}/new_comment`)
      .auth(accessToken, { type: "bearer" })
      .send({ content: "The only comment in the twit" });

    expect(body.data.content).toBe("The only comment in the twit");
  });

  test("Get all twits", async () => {
    const request = supertest(app);
    const { body } = await request.get("/twits");

    expect(body.data.length).toBe(1);
    expect(body.data[0].content).toBe("Hello, world");
  });

  test("Get twit", async () => {
    const request = supertest(app);
    const { body } = await request.get(`/twits/${twit._id}`);

    expect(body.data.content).toBe("Hello, world");
  });

  test("Get twit comments", async () => {
    const request = supertest(app);
    const { body } = await request.get(`/twits/${twit._id}/comments`);

    expect(body.data.length).toBe(1);
    expect(body.data[0].content).toBe("The only comment in the twit");
  });

  test("Delete twit by unauthorized user", async () => {
    const request = supertest(app);

    let { body: newUser } = await request
      .post("/auth/register")
      .send({ email: "user1@gmail.com", password: "password" });

    const { body } = await request
      .post(`/twits/delete/${twit._id}`)
      .auth(newUser.accessToken, { type: "bearer" });

    expect(body.data).toBe("You can't delete this twit");
  });

  test("Delete twit", async () => {
    const request = supertest(app);
    const { body } = await request
      .post(`/twits/delete/${twit._id}`)
      .auth(accessToken, { type: "bearer" });
    expect(body.data).toBe("Twit deleted");
  });
});
