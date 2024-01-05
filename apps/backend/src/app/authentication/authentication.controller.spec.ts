import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import { UserService } from '../user/user.service';
import { RegisterAuthenticationDto } from './dto/register-authentication.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Types } from 'mongoose';

jest.mock('../../utils/hash.ts', () => ({
  hashPassword: jest
    .fn()
    .mockImplementation(async (password) => `hashed_${password}`),
}));

describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  let userService: UserService;
  let authenticationService: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        AuthenticationService,
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
    userService = module.get<UserService>(UserService);
    authenticationService = module.get<AuthenticationService>(
      AuthenticationService
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return error duplicate email', async () => {
    jest.spyOn(userService, 'doesThisEmailExist').mockResolvedValue(true);

    jest.spyOn(authenticationService, 'register');

    const mockBody = {
      email: 'rudolph@mail.com',
      password: 'asdfghjkl',
    } as RegisterAuthenticationDto;

    try {
      await controller.register(mockBody);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.getStatus()).toBe(HttpStatus.CONFLICT);
      expect(error.message).toBe('Data with this email already exists.');
    }

    expect(authenticationService.register).not.toHaveBeenCalled();
  });

  it('should create new data', async () => {
    const mockBody = {
      name: 'rudolph',
      email: 'rudolph@mail.com',
      password: 'asdfghjkl',
    } as RegisterAuthenticationDto;

    jest.spyOn(userService, 'doesThisEmailExist').mockResolvedValue(false);

    jest.spyOn(authenticationService, 'register').mockResolvedValue({
      ...mockBody,
      _id: 'lkjasdsalkj' as unknown as Types.ObjectId,
    } as UserDocument);

    const registrationProcess = await controller.register(mockBody);

    expect(registrationProcess).toEqual({
      _id: 'lkjasdsalkj',
      name: mockBody.name,
      email: mockBody.email,
    });

    expect(authenticationService.register).toHaveBeenCalled();
    expect(userService.doesThisEmailExist).toHaveBeenCalledWith(mockBody.email);
    expect(authenticationService.register).toHaveBeenCalledWith({
      ...mockBody,
      password: `hashed_${mockBody.password}`,
    });

    // @ts-ignore
    expect(registrationProcess.password).toBeUndefined();
  });
});
