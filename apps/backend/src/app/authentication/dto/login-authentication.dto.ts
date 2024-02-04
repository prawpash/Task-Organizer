import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginAuthenticationDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
