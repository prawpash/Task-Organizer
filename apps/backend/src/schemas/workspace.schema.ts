import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

@Schema({ timestamps: true })
export class Workspace {
  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  description?: string;

  // relations
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User;

  constructor(partial: Partial<Workspace>) {
    Object.assign(this, partial);
  }
}

export type WorkspaceDocument = HydratedDocument<Workspace>;

export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);
