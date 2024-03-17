import { OmitType } from '@nestjs/mapped-types';
import { UserDocument } from '../../../schemas/user.schema';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class RegisterAuthenticationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RegisterAuthenticationResponseDto extends OmitType(
  RegisterAuthenticationDto,
  ['password']
) {
  @IsString()
  _id: Types.ObjectId;

  constructor(user: UserDocument) {
    super();

    this._id = user._id;
    this.name = user.name;
    this.email = user.email;
  }
}
