import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { SchemasModule } from '../../schemas/schemas.module';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthenticationStrategy } from './authentication.strategy';

@Module({
  imports: [
    SchemasModule,
    UserModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '60m',
      },
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, AuthenticationStrategy],
})
export class AuthenticationModule {}
