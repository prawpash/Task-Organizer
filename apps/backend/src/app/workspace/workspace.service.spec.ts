import { Test, TestingModule } from '@nestjs/testing';
import { WorkspaceService } from './workspace.service';
import { Model, Types } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Workspace, WorkspaceDocument } from '../../schemas/workspace.schema';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UserDocument } from '../../schemas/user.schema';

describe('WorkspaceService', () => {
  let service: WorkspaceService;
  let workspaceModel: Model<Workspace>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkspaceService,
        {
          provide: getModelToken(Workspace.name),
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    workspaceModel = module.get<Model<Workspace>>(
      getModelToken(Workspace.name)
    );
    service = module.get<WorkspaceService>(WorkspaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should create workspace', async () => {
    const userId = new Types.ObjectId();

    const mockUser = {} as UserDocument;
    mockUser._id = userId;

    const mockCreateWorkspace = {
      title: 'workspace 1',
      description: 'workspace 1 description',
    } as CreateWorkspaceDto;

    const mockCreatedWorkspace = {} as WorkspaceDocument;

    mockCreatedWorkspace.id = '1';
    mockCreatedWorkspace.title = 'workspace 1';
    mockCreatedWorkspace.description = 'workspace 1 description';

    (workspaceModel.create as jest.Mock).mockResolvedValue(
      mockCreatedWorkspace
    );

    const newWorkspace = await service.create(userId, mockCreateWorkspace);

    expect(newWorkspace).toEqual(mockCreatedWorkspace);
    expect(workspaceModel.create).toHaveBeenCalledWith({
      ...mockCreateWorkspace,
      owner: userId,
    });
  });
});
