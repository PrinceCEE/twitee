import localStrategy from "./local.strategy";
import jwtStrategy from "./jwt.strategy";
import { UserService } from "../services";

export default (userService: UserService) => {
  localStrategy(userService);
  jwtStrategy(userService);
};
