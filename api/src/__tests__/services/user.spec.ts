import mongoose, { Connection } from "mongoose";
import { IUser } from "../../interfaces";
import { UserSchema } from "../../schemas";
import { UserService } from "../../services";

describe("Test user service", () => {
  let connection: Connection;
  let userService: UserService;

  beforeAll(async () => {
    connection = await mongoose.createConnection(process.env.DB_URL);
    const userModel = connection.model<IUser>("User", UserSchema);
    userService = new UserService(userModel);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  test("Create new user", async () => {
    const user = await userService.createUser({
      email: "user@gmail.com",
      password: "password",
    });

    expect(user.name).toBe("user");
  });

  test("Get user by email", async () => {
    const user = await userService.getUserByEmail("user@gmail.com");
    expect(user.name).toBe("user");
  });

  test("Get user by name", async () => {
    const user = await userService.getUserByName("user");
    expect(user.email).toBe("user@gmail.com");
  });

  test("Get user by unregistered email address", async () => {
    const user = await userService.getUserByEmail("users@gmail.com");
    expect(user).toBe(null);
  });

  test("Get user by unregistered name", async () => {
    const user = await userService.getUserByEmail("users");
    expect(user).toBe(null);
  });
});
