import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import { RegisterAuthenticationDto } from './dto/register-authentication.dto';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../../schemas/user.schema';
import { Model, Types } from 'mongoose';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let userModel: Model<User>;

  const now = new Date();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        {
          provide: getModelToken(User.name),
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    userModel = module.get<Model<User>>(getModelToken(User.name));
    service = module.get<AuthenticationService>(AuthenticationService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user', async () => {
    const mockRegisterDto = {
      name: 'rudolph',
      email: 'rudolph@testmail.com',
      password: 'rudolphPassword',
    } as RegisterAuthenticationDto;

    const mockCreatedUser = {
      _id: new Types.ObjectId(),
      ...mockRegisterDto,
      createdAt: now,
    };

    (userModel.create as jest.Mock).mockResolvedValue(mockCreatedUser);

    const newUser = await service.register(mockRegisterDto);

    expect(newUser).toEqual(
      expect.objectContaining({
        _id: expect.any(Types.ObjectId),
        name: mockRegisterDto.name,
        email: mockRegisterDto.email,
        createdAt: now,
      })
    );
  });
});
