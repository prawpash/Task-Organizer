import { IJwtPayload } from './app/authentication/jwt-payload.interface';

declare global {
  export interface Request {
    user: IJwtPayload;
  }
}
