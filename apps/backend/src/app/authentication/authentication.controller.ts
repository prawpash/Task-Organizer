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

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService
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

    const user = await this.authenticationService.register(registerAuthDto);

    const formattedData = new RegisterAuthenticationResponseDto(user);

    return formattedData;
  }
}
