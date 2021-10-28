import passport from "passport";
import { RegisterDto } from "../dtos";
import { BadRequestError, UnauthorizedError } from "../errors";
import { Req, Res, Next, IUser } from "../interfaces";
import { UserService } from "../services/user.services";
import { authValidator } from "../validators";

export default class AuthMiddleware {
  constructor(private userService: UserService) {}

  validateRegister = async (req: Req, res: Res, next: Next) => {
    const { error } = authValidator.validate(req.body);
    if (error) {
      return next(new BadRequestError(error.message));
    }

    const { email } = req.body as RegisterDto;

    let user = await this.userService.getUserByEmail(email);
    if (user) {
      return next(
        new UnauthorizedError(
          `${email} is already registered, log in`
        )
      );
    }

    next();
  };

  validateLogin = (req: Req, res: Res, next: Next) => {
    const { error } = authValidator.validate(req.body);
    if (error) {
      return next(new BadRequestError(error.message));
    }

    next();
  };

  localAuth = (req: Req, res: Res, next: Next) => {
    passport.authenticate(
      "local",
      { session: false },
      (err, user: IUser, info: { message: string }) => {
        if (err) {
          next(new BadRequestError(err.message));
          return;
        }

        if (!user) {
          next(new BadRequestError(info.message));
          return;
        }

        req.login(user, { session: false }, (err) => {
          if (err) {
            next(new BadRequestError(err.message));
            return;
          }

          next();
        });
      }
    )(req, res, next);
  };

  jwtAuth = (req: Req, res: Res, next: Next) => {
    passport.authenticate("jwt", { session: false })(req, res, next);
  };
}
