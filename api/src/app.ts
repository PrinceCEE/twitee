import express from "express";
import Logger from "morgan";
import cors from "cors";
import passport from "passport";
import authRouter from "./routers/auth.router";
import twitRouter from "./routers/twit.router";
import { IResponse, Req, Res, Next } from "./interfaces";
import { HttpException } from "./errors";
import initStrategies from "./strategies";
import { AuthService, TwitService, UserService } from "./services";

const initApp = (
  authService: AuthService,
  userService: UserService,
  twitService: TwitService
) => {
  // init passport strategies
  initStrategies(userService);

  const app = express();

  // Global middlewares
  app.use(Logger("dev"));
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(passport.initialize());

  // Routers
  app.use("/auth", authRouter(authService, userService));
  app.use("/twits", twitRouter(userService, twitService));

  app.use((req, res, next) => {
    const response: IResponse = {
      success: false,
      data: "Not found",
    };

    res.status(404).json(response);
  });

  app.use((err: HttpException, req: Req, res: Res, next: Next) => {
    const response: IResponse = {
      success: false,
      data: err.message,
    };

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json(response);
  });

  return app;
};

export default initApp;
