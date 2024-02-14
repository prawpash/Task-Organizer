import { Types } from 'mongoose';

export interface IJwtPayload {
  sub: Types.ObjectId;
  name: string;
  userId?: Types.ObjectId;
}
