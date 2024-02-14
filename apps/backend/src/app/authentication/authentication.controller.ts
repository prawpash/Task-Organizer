import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import {
  RegisterAuthenticationDto,
  RegisterAuthenticationResponseDto,
} from './dto/register-authentication.dto';
import { UserService } from '../user/user.service';
import { hashPassword, verifyPassword } from '../../utils/hash';
import { LoginAuthenticationDto } from './dto/login-authentication.dto';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from './jwt-payload.interface';

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  @Post('register')
  async register(@Body() registerAuthDto: RegisterAuthenticationDto) {
    const userExists = await this.userService.doesThisEmailExist(
      registerAuthDto.email
    );

    if (userExists) {
      throw new HttpException(
        'Data with this email already exists.',
        HttpStatus.CONFLICT
      );
    }

    const hashedPassword = await hashPassword(registerAuthDto.password);

    const user = await this.authenticationService.register({
      ...registerAuthDto,
      password: hashedPassword,
    });

    const formattedData = new RegisterAuthenticationResponseDto(user);

    return formattedData;
  }

  @Post('login')
  async login(@Body() loginAuthDto: LoginAuthenticationDto) {
    const user = await this.userService.findByEmail(loginAuthDto.email);

    if (!user) {
      throw new HttpException(
        'The Email or Password is wrong.',
        HttpStatus.UNAUTHORIZED
      );
    }

    const isPasswordMatch = await verifyPassword(
      loginAuthDto.password,
      user.password
    );

    if (!isPasswordMatch) {
      throw new HttpException(
        'The Email or Password is wrong.',
        HttpStatus.UNAUTHORIZED
      );
    }

    const payload: IJwtPayload = { sub: user._id, name: user.name };

    const accessToken = await this.jwtService.signAsync(payload);

    return { access_token: accessToken };
  }
}
