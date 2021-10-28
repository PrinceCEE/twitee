import { Connection } from "mongoose";
import supertest from "supertest";
import bootstrapApp from "./test.config";

describe("Test Authentication", () => {
  let app, connection: Connection;

  const userDto = {
    email: "user@gmail.com",
    password: "password",
  };

  beforeAll(async () => {
    const config = await bootstrapApp();
    app = config.app;
    connection = config.connection;
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  test("register with short password", async () => {
    const request = supertest(app);
    const { statusCode } = await request
      .post("/auth/register")
      .send({ ...userDto, password: "pass" });

    expect(statusCode).toBe(400);
  });

  test("regster user", async () => {
    const request = supertest(app);
    const { body } = await request
      .post("/auth/register")
      .send(userDto);

    expect(body.data).toBe("user, welcome to Twitee");
  });

  test("register user when already registered", async () => {
    const request = supertest(app);
    const { body } = await request
      .post("/auth/register")
      .send(userDto);

    expect(body.data).toBe(
      "user@gmail.com is already registered, log in"
    );
  });

  test("log in user", async () => {
    const request = supertest(app);
    const { body } = await request.post("/auth/login").send(userDto);

    expect(body.data).toBe("Welcome back, user");
  });

  test("log in user with wrong credentials", async () => {
    const request = supertest(app);
    const { body } = await request
      .post("/auth/login")
      .send({ ...userDto, password: "password1" });

    expect(body.data).toBe("Incorrect login details");
  });
});
