import { sign } from "jsonwebtoken";
import { IUser } from "../interfaces";
import { sendEmail } from "../utils";

export class AuthService {
  async sendRegEmail(email: string) {
    const name = email.split("@")[0];
    await sendEmail(
      email,
      "Welcome to Twitee",
      `Hello, ${name}.\nWelcome to Twitee!`
    );
  }

  login(user: IUser) {
    return sign({ sub: user.email }, process.env.SECRET, {
      expiresIn: "7d",
    });
  }
}
