import { Injectable } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Workspace, WorkspaceDocument } from '../../schemas/workspace.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectModel(Workspace.name)
    private readonly workspaceModel: Model<Workspace>
  ) {}

  async create(
    userId: Types.ObjectId,
    createWorkspaceDto: CreateWorkspaceDto
  ): Promise<WorkspaceDocument> {
    const workspace = await this.workspaceModel.create({
      ...createWorkspaceDto,
      owner: userId,
    });

    return workspace;
  }
}
