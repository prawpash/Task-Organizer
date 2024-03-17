import { Test, TestingModule } from '@nestjs/testing';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { getModelToken } from '@nestjs/mongoose';
import { Workspace, WorkspaceDocument } from '../../schemas/workspace.schema';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { Types } from 'mongoose';

describe('WorkspaceController', () => {
  let controller: WorkspaceController;
  let workspaceService: WorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkspaceController],
      providers: [
        WorkspaceService,
        {
          provide: getModelToken(Workspace.name),
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<WorkspaceController>(WorkspaceController);
    workspaceService = module.get<WorkspaceService>(WorkspaceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create new workspace', async () => {
    const request = {} as Request;
    request.user = {
      sub: new Types.ObjectId(),
      name: 'user#1',
    };
    request.user.userId = request.user.sub;

    const mockBody = {
      title: 'workspace title',
      description: 'workspace description',
    } as CreateWorkspaceDto;

    jest.spyOn(workspaceService, 'create').mockResolvedValue({
      id: '1',
      ...mockBody,
    } as WorkspaceDocument);

    const createdWorkspace = await controller.create(request, mockBody);

    expect(createdWorkspace).toEqual({
      id: '1',
      ...mockBody,
    });

    expect(workspaceService.create).toHaveBeenCalledWith(
      request.user.userId,
      mockBody
    );
  });
});
