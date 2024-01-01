import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Exclude()
  @Prop({ required: true })
  password: string;

  @Prop({ default: Date.now() })
  createdAt: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
