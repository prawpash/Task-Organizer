import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Query } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';

describe('UserService', () => {
  let service: UserService;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    userModel = module.get<Model<User>>(getModelToken(User.name));
    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return true when email exist', async () => {
    jest.spyOn(userModel, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce({ _id: 'lkjasdj' }),
    } as unknown as Query<unknown, unknown, object, User, 'findOne'>);

    const userExists = await service.doesThisEmailExist('rudolph@mail.com');

    expect(userExists).toBe(true);
  });

  it('should return false when email exist', async () => {
    jest.spyOn(userModel, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(null),
    } as unknown as Query<unknown, unknown, object, User, 'findOne'>);

    const userExists = await service.doesThisEmailExist('rudolph@mail.com');

    expect(userExists).toBe(false);
  });

  it('should return user based on email', async () => {
    const mockUser = {} as UserDocument;

    mockUser.name = 'rudolph';
    mockUser.email = 'rudolph@mail.com';
    mockUser.password = 'hashed_password';

    jest.spyOn(userModel, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockUser),
    } as unknown as Query<unknown, unknown, object, User, 'findOne'>);

    const user = await service.findByEmail('rudolph@mail.com');

    expect(user).toBe(mockUser);
  });
});
