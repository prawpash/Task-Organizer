import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>
  ) {}

  async doesThisEmailExist(email: string): Promise<boolean> {
    const user = await this.userModel
      .findOne({
        email: email,
      })
      .exec();

    if (!user) {
      return false;
    }

    return true;
  }
}
