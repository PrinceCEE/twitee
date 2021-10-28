import { NewTwitDto } from "../dtos";
import { Req, Res, Next, IResponse, IUser } from "../interfaces";
import { TwitService } from "../services";

export default class TwitsController {
  constructor(private twitService: TwitService) {}

  allTwits = async (req: Req, res: Res, next: Next) => {
    const twits = await this.twitService.allTwits();
    const response: IResponse = {
      success: true,
      data: twits,
    };
    res.json(response);
  };

  twit = async (req: Req, res: Res, next: Next) => {
    const { twitID } = req.params;
    const twit = await this.twitService.getTwit(twitID);

    const response: IResponse = {
      success: true,
      data: twit,
    };
    res.json(response);
  };

  twitComments = async (req: Req, res: Res, next: Next) => {
    const { twitID } = req.params;
    const comments = await this.twitService.twitComments(twitID);

    const response: IResponse = {
      success: true,
      data: comments,
    };
    res.json(response);
  };

  newTwit = async (req: Req, res: Res, next: Next) => {
    const data: NewTwitDto = req.body;
    const user = req.user as IUser;

    const twit = await this.twitService.newTwit({
      ...data,
      poster: user.id,
    });

    const response: IResponse = {
      success: true,
      data: twit,
    };

    res.json(response);
  };

  deleteTwit = async (req: Req, res: Res, next: Next) => {
    const { twitID } = req.params;
    await this.twitService.deleteTwit(twitID);
    const response: IResponse = {
      success: true,
      data: "Twit deleted",
    };
    res.json(response);
  };

  newComment = async (req: Req, res: Res, next: Next) => {
    const { twitID } = req.params;
    const user = req.user as IUser;
    const data = req.body;

    const comment = await this.twitService.addComment({
      ...data,
      poster: user.id,
      twit: twitID,
    });

    const response: IResponse = {
      success: true,
      data: comment,
    };
    res.json(response);
  };

  likeOrUnlikeTwit = async (req: Req, res: Res, next: Next) => {
    const { twitID } = req.params;
    const user = req.user as IUser;

    const isLiked = await this.twitService.isTwitLiked(
      user.name,
      twitID
    );

    isLiked
      ? await this.twitService.unlikeTwit(twitID, user.name)
      : await this.twitService.likeTwit(twitID, user.name);

    const response: IResponse = {
      success: true,
      data: isLiked ? "Like removed" : "Successfully liked",
    };

    res.json(response);
  };
}
