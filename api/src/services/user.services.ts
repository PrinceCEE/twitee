import { Model } from "mongoose";
import { RegisterDto } from "../dtos";
import { IUser } from "../interfaces";

export class UserService {
  constructor(private userModel: Model<IUser>) {}

  async createUser(data: RegisterDto) {
    const user = new this.userModel({
      ...data,
      name: data.email.split("@")[0],
    });

    return user.save();
  }

  async getUserByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    return user ?? null;
  }

  async getUserByName(name: string) {
    const user = await this.userModel.findOne({ name });
    return user ?? null;
  }
}
