import { Router } from "express";
import AuthMiddleware from "../middlewares/auth.middleware";
import AuthController from "../controllers/auth.controller";
import { UserService, AuthService } from "../services";

const initRouter = (
  authService: AuthService,
  userService: UserService
) => {
  const router = Router();

  const authMiddleware = new AuthMiddleware(userService);
  const authController = new AuthController(userService, authService);

  router.post(
    "/register",
    authMiddleware.validateRegister,
    authController.register
  );

  router.post(
    "/login",
    authMiddleware.validateLogin,
    authMiddleware.localAuth,
    authController.login
  );

  return router;
};

export default initRouter;
