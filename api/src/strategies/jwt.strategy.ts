import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { UserService } from "../services";

const initJwtStrategy = (userService: UserService) => {
  passport.use(
    new Strategy(
      {
        secretOrKey: process.env.SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      },
      async (payload, done) => {
        const user = await userService.getUserByEmail(payload.sub);
        if (!user) {
          done(null, false, { message: "Unauthorized email" });
          return;
        }

        done(null, user);
      }
    )
  );
};

export default initJwtStrategy;
