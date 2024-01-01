import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { SchemasModule } from '../../schemas/schemas.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [SchemasModule, UserModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class AuthenticationModule {}
