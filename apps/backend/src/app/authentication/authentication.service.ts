import { Injectable } from '@nestjs/common';
import { RegisterAuthenticationDto } from './dto/register-authentication.dto';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>
  ) {}

  async register(
    registerDto: RegisterAuthenticationDto
  ): Promise<UserDocument> {
    const user = await this.userModel.create(registerDto);

    return user;
  }
}
