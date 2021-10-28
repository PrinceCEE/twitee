import dotenv from "dotenv";
import { AuthService } from "../../services";

describe("Test the Auth Service", () => {
  let authService: AuthService;
  beforeAll(() => {
    dotenv.config();
    authService = new AuthService();
  });

  test("Generates the access token", () => {
    const accessToken = authService.login({
      email: "user@gmail.com",
    } as any);

    expect(accessToken.length).toBeGreaterThan(16);
  });

  test("Send Registration email to user", async () => {
    let response;

    try {
      response = await authService.sendRegEmail(
        "princecee15@gmail.com"
      );
    } catch (err) {
      expect(err).toBe(null);
    }

    expect(response).toBeUndefined();
  });
});
