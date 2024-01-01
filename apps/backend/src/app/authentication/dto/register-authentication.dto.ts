import { OmitType } from '@nestjs/mapped-types';
import { UserDocument } from 'apps/backend/src/schemas/user.schema';
import { IsEmail, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class RegisterAuthenticationDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
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
