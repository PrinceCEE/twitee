import passport from "passport";
import { compare } from "bcrypt";
import { Strategy } from "passport-local";
import { UserService } from "../services";

const initLocalStrategy = (userService: UserService) => {
  passport.use(
    new Strategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email: string, password: string, done) => {
        const user = await userService.getUserByEmail(email);
        if (!user) {
          done(null, false, {
            message: "User not registered",
          });
          return;
        }

        const isSame = await compare(password, user.password);
        if (!isSame) {
          return done(null, false, {
            message: "Incorrect login details",
          });
        }

        done(null, user);
      }
    )
  );
};

export default initLocalStrategy;
