import { BadRequestError, UnauthorizedError } from "../errors";
import { Req, Res, Next, IUser } from "../interfaces";
import { TwitService } from "../services";
import { twitValidator } from "../validators";

export default class TwitsMiddleware {
  constructor(private twitService: TwitService) {}

  newTwit = (req: Req, res: Res, next: Next) => {
    const { error } = twitValidator.validate(req.body);
    if (error) {
      next(new BadRequestError(error.message));
      return;
    }

    next();
  };

  checkTwitExists = async (req: Req, res: Res, next: Next) => {
    const { twitID } = req.params;

    const twit = await this.twitService.getTwit(twitID);
    if (!twit) {
      next(new BadRequestError("Twit doesn't exist"));
      return;
    }
    next();
  };

  deleteTwit = async (req: Req, res: Res, next: Next) => {
    const { twitID } = req.params;
    const user = req.user as IUser;
    const twit = await this.twitService.getTwit(twitID);

    if (twit.poster.toString() !== user._id.toString()) {
      next(new UnauthorizedError("You can't delete this twit"));
      return;
    }

    next();
  };

  newComment = async (req: Req, res: Res, next: Next) => {
    const { error } = twitValidator.validate(req.body);

    if (error) {
      next(new BadRequestError(error.message));
      return;
    }

    next();
  };
}
