import { hash, genSalt } from "bcrypt";
import { RegisterDto } from "../dtos";
import { Req, Res, Next, IResponse, IUser } from "../interfaces";
import { AuthService, UserService } from "../services";
import { InternalServerError } from "../errors";

export default class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  register = async (req: Req, res: Res, next: Next) => {
    const data: RegisterDto = req.body;

    const salt = await genSalt(10);
    data.password = await hash(data.password, salt);

    const user = await this.userService.createUser(data);
    if (!user) {
      return next(new InternalServerError());
    }

    // send registration email to the user
    await this.authService.sendRegEmail(user.email);

    const response: IResponse = {
      success: true,
      data: `${user.name}, welcome to Twitee`,
      accessToken: this.authService.login(user),
    };
    res.json(response);
  };

  login = (req: Req, res: Res, next: Next) => {
    const user = req.user as IUser;
    const response: IResponse = {
      success: true,
      data: `Welcome back, ${user.name}`,
      accessToken: this.authService.login(user),
    };

    res.json(response);
  };
}
