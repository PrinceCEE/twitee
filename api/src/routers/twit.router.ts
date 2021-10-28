import { Router } from "express";
import TwitsMiddleware from "../middlewares/twits.middleware";
import TwitsController from "../controllers/twits.controller";
import AuthMiddleware from "../middlewares/auth.middleware";
import { TwitService, UserService } from "../services";

const initRouter = (
  userService: UserService,
  twitService: TwitService
) => {
  const router = Router();

  const authMiddleware = new AuthMiddleware(userService);
  const twitsMiddleware = new TwitsMiddleware(twitService);
  const twitsController = new TwitsController(twitService);

  router.get("/", twitsController.allTwits);

  router.post(
    "/new",
    authMiddleware.jwtAuth,
    twitsMiddleware.newTwit,
    twitsController.newTwit
  );

  router.post(
    "/delete/:twitID",
    authMiddleware.jwtAuth,
    twitsMiddleware.checkTwitExists,
    twitsMiddleware.deleteTwit,
    twitsController.deleteTwit
  );

  router.post(
    "/like/:twitID",
    authMiddleware.jwtAuth,
    twitsMiddleware.checkTwitExists,
    twitsController.likeOrUnlikeTwit
  );

  router.post(
    "/:twitID/new_comment",
    authMiddleware.jwtAuth,
    twitsMiddleware.checkTwitExists,
    twitsMiddleware.newComment,
    twitsController.newComment
  );

  router.get(
    "/:twitID",
    twitsMiddleware.checkTwitExists,
    twitsController.twit
  );

  router.get(
    "/:twitID/comments",
    twitsMiddleware.checkTwitExists,
    twitsController.twitComments
  );

  return router;
};

export default initRouter;
